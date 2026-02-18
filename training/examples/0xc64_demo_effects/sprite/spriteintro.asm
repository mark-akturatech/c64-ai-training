// Example: Sprite Multiplexing with Raster Splits
//
// Displays 16 sprites simultaneously by using raster interrupt-driven sprite data swapping. An
// interrupt queue at lines 0, 140, and 250 switches sprite pointers ($07F8-$07FF), position
// registers ($D000-$D00F), colors ($D027-$D02E), and multicolor palette ($D025/$D026) between
// two complete sprite sets. Includes color cycling on text rows via color RAM animation.
//
// Key Registers:
//   $D012 - VIC-II raster line - interrupt queue at 0, 140, 250
//   $D015 - VIC-II sprite enable - all 8 sprites enabled
//   $D01C - VIC-II sprite multicolor - multicolor mode for all
//   $D000-$D00F - VIC-II sprite positions - X/Y updated per split
//   $D025/$D026 - VIC-II sprite multicolors - palette updated per split
//   $D027-$D02E - VIC-II sprite colors - individual colors per split
//   $07F8-$07FF - Sprite data pointers - swapped between sets
//   $D9B8/$D9E0 - Color RAM rows - cycling colors
//
// Techniques: sprite multiplexing, raster interrupt queuing, color cycling, sprite data swapping
// Hardware: VIC-II, CIA
//

// Program: 16 Sprite Raster Split
// Author: Andrew Burch
// Site: www.0xc64.com
// Assembler: KickAssembler (converted from win2c64)
// Notes: Uses a raster interrupt to produce 16
//        sprites on screen at once
//
// More info: http://www.0xc64.com/2013/12/06/sprite-split-with-rasters

.const spritepos     = $d000       // sprite x/y registers
.const spriteposhigh = $d010       // high bit for x position
.const spriteenable  = $d015       // sprite enable bits
.const spriteptr     = $07f8       // sprite data pointers
.const spritemulti   = $d01c       // multi colour enable register
.const spritecolour  = $d027       // sprite colour registers
.const multi1        = $d025       // sprite multi colour 1
.const multi2        = $d026       // sprite multi colour 2
.const charline12    = $05b8       // row 12 of character map
.const charline13    = $05e0       // row 13 of character map
.const colmapline12  = $d9b8       // row 12 of colour map
.const colmapline13  = $d9e0       // row 13 of colour map

BasicUpstart2(main)

main:
                jsr $e544               // clear screen

                lda #0                  // set screen & border colour
                sta $d020
                sta $d021

                ldx #0                  // init display text
!loop:
                lda text1, x
                sta charline12, x
                lda text2, x
                sta charline13, x
                inx
                cpx #40
                bne !loop-

                ldx #0                  // init text colours
!loop:
                lda initcolourmap1, x
                sta colmapline12, x
                lda initcolourmap2, x
                sta colmapline13, x
                inx
                cpx #40
                bne !loop-

                lda #$ff                // enable all sprites
                sta spriteenable
                sta spritemulti         // enable multicolour on all

                sei                     // set up interrupt
                lda #$7f
                sta $dc0d               // turn off the CIA interrupts
                sta $dd0d
                and $d011               // clear high bit of raster line
                sta $d011

                ldx #0                  // setup interrupt queue
                lda intqueuelow, x
                sta $0314
                lda intqueuehigh, x
                sta $0315
                lda inttrigger, x       // set trigger scan line
                sta $d012
                stx intindex

                lda #$01                // enable raster interrupts
                sta $d01a
                cli
                rts

spritesplit:
                inc $d019               // acknowledge interrupt

                ldx intindex
                lda setptrlow, x
                sta $fa
                lda setptrhigh, x
                sta $fb

                ldy #0                  // set sprite positions
!loop:
                lda ($fa), y
                sta spritepos, y
                iny
                cpy #16
                bne !loop-

                ldx #0                  // apply sprite colours
!loop:
                lda ($fa), y
                sta spritecolour, x
                iny
                inx
                cpx #8
                bne !loop-

                lda ($fa), y            // apply sprite multi colours
                sta multi1
                iny
                lda ($fa), y
                sta multi2

                iny
                ldx #0                  // set sprite data pointers
!loop:
                lda ($fa), y
                sta spriteptr, x
                iny
                inx
                cpx #8
                bne !loop-

                ldx intindex            // next interrupt in queue
                inx
                lda intqueuelow, x
                sta $0314
                lda intqueuehigh, x
                sta $0315
                lda inttrigger, x       // set trigger scan line
                sta $d012
                stx intindex

                jmp $ea81

update:
                inc $d019               // acknowledge interrupt
                dec smooth              // apply smoothing to colour cycle
                bne endupdate
                lda #2
                sta smooth

                lda colourIndex1        // advance colour indexes for cycling
                adc #1
                and #7
                sta colourIndex1
                lda colourIndex2
                adc #1
                and #7
                sta colourIndex2

                ldx #0                  // cycle colours on right
!loop:
                lda colmapline12+21, x
                sta colmapline12+20, x
                lda colmapline13+21, x
                sta colmapline13+20, x
                inx
                cpx #19
                bne !loop-

                ldx #19                 // cycle colours on left
!loop:
                lda colmapline12-1, x
                sta colmapline12, x
                lda colmapline13-1, x
                sta colmapline13, x
                dex
                bne !loop-

                ldx colourIndex1        // insert new colour on right
                lda colourtable, x
                sta colmapline12
                sta colmapline12+39

                ldx colourIndex2        // insert new colour on left
                lda colourtable, x
                sta colmapline13
                sta colmapline13+39

endupdate:
                ldx #0                  // reset interrupt queue
                lda intqueuelow, x
                sta $0314
                lda intqueuehigh, x
                sta $0315
                lda inttrigger, x       // set trigger scan line
                sta $d012
                stx intindex

                jmp $ea81

smooth:         .byte 2                                         // colour cycle smoothing
colourIndex1:   .byte 0                                         // next colour index row 1
colourIndex2:   .byte 1                                         // next colour index row 2
colourtable:    .byte 3, 5, 13, 7, 1, 7, 13, 5                 // colour cycle table
initcolourmap1: .byte 3, 5, 13, 7, 1, 7, 13, 5                 // pre calculated colour maps
                .byte 3, 5, 13, 7, 1, 7, 13, 5
                .byte 3, 5, 13, 7, 7, 13, 5, 3
                .byte 5, 13, 7, 1, 7, 13, 5, 3
                .byte 5, 13, 7, 1, 7, 13, 5, 3
initcolourmap2: .byte 5, 13, 7, 1, 7, 13, 5, 3
                .byte 5, 13, 7, 1, 7, 13, 5, 3
                .byte 5, 13, 7, 1, 1, 7, 13, 5
                .byte 3, 5, 13, 7, 1, 7, 13, 5
                .byte 3, 5, 13, 7, 1, 7, 13, 5
text1:          .byte 32, 32, 45, 45, 43, 61, 27, 32            // row 1 text string
                .byte 49, 54, 32, 19, 16, 18, 9, 20
                .byte 5, 32, 45, 32, 18, 1, 19, 20
                .byte 5, 18, 32, 19, 16, 12, 9, 20
                .byte 32, 29, 61, 43, 45, 45, 32, 32
text2:          .byte 32, 32, 32, 32, 32, 32, 61, 61            // row 2 text string
                .byte 61, 61, 61, 32, 32, 32, 23, 23
                .byte 23, 46, 48, 24, 3, 54, 52, 46
                .byte 3, 15, 13, 32, 32, 32, 61, 61
                .byte 61, 61, 61, 32, 32, 32, 32, 32
spriteset1:     .byte 89, 50, 113, 60, 137, 70, 161, 80         // sprite positions (x, y)
                .byte 185, 80, 209, 70, 230, 60, 255, 50
                .byte 2, 4, 6, 8, 8, 6, 4, 2                   // sprite colours
                .byte 10, 15                                    // multi colours 1 & 2
                .byte spritedata/64, spritedata2/64, spritedata2/64, spritedata/64, spritedata/64, spritedata2/64, spritedata2/64, spritedata/64    // sprite data pointers
spriteset2:     .byte 89, 208, 113, 198, 137, 188, 161, 178     // sprite positions (x, y)
                .byte 185, 178, 209, 188, 230, 198, 255, 208
                .byte 1, 5, 8, 9, 9, 8, 5, 1                   // sprite colours
                .byte 13, 15                                    // multi colours 1 & 2
                .byte spritedata2/64, spritedata2/64, spritedata/64, spritedata2/64, spritedata2/64, spritedata/64, spritedata2/64, spritedata2/64    // sprite data pointers
intindex:       .byte 0
intqueuelow:    .byte <spritesplit, <spritesplit, <update        // interrupt queue
intqueuehigh:   .byte >spritesplit, >spritesplit, >update
inttrigger:     .byte 0, 140, 250
setptrlow:      .byte <spriteset1, <spriteset2
setptrhigh:     .byte >spriteset1, >spriteset2

// .align 64
* = $2000
spritedata:     .byte $00, $28, $00, $02, $be, $80, $0b, $d7, $e0, $2d, $69, $78, $2d, $be, $78, $b6
                .byte $d7, $9e, $b7, $69, $de, $b6, $d7, $9e, $b7, $69, $de, $b6, $d7, $9e, $b7, $69
                .byte $de, $b6, $d7, $9e, $2d, $be, $78, $2d, $69, $78, $0b, $d7, $e0, $02, $be, $80
                .byte $00, $28, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $82
spritedata2:    .byte $00, $20, $00, $00, $98, $00, $00, $98, $00, $02, $76, $00, $02, $76, $00, $02
                .byte $66, $00, $09, $dd, $80, $09, $ed, $80, $09, $dd, $80, $09, $dd, $80, $27, $77
                .byte $60, $27, $bb, $60, $27, $bb, $60, $27, $67, $60, $09, $fd, $80, $02, $56, $00
                .byte $00, $a8, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $00, $8b
