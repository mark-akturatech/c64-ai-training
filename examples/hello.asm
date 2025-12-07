//----------------------------------------------------------
// Hello World - Bouncing Text + Ball Sprite
// KickAssembler
//----------------------------------------------------------

*= $0801 "Basic Upstart"
BasicUpstart2(start)

*= $0810 "Program"

// VIC-II Constants
.const VIC = $d000
.const SPRITE0_X = VIC + $00
.const SPRITE0_Y = VIC + $01
.const SPRITE_X_MSB = VIC + $10
.const SPRITE_ENABLE = VIC + $15
.const SPRITE_EXPAND_Y = VIC + $17
.const SPRITE_EXPAND_X = VIC + $1d
.const SPRITE_MULTI = VIC + $1c
.const SPRITE0_COLOR = VIC + $27
.const SPRITE_MULTI0 = VIC + $25
.const SPRITE_MULTI1 = VIC + $26

// SID Sound Chip Constants
.const SID = $d400
.const SID_V1_FREQ_LO = SID + $00
.const SID_V1_FREQ_HI = SID + $01
.const SID_V1_PW_LO = SID + $02
.const SID_V1_PW_HI = SID + $03
.const SID_V1_CTRL = SID + $04
.const SID_V1_AD = SID + $05
.const SID_V1_SR = SID + $06
.const SID_V2_FREQ_LO = SID + $07
.const SID_V2_FREQ_HI = SID + $08
.const SID_V2_PW_LO = SID + $09
.const SID_V2_PW_HI = SID + $0a
.const SID_V2_CTRL = SID + $0b
.const SID_V2_AD = SID + $0c
.const SID_V2_SR = SID + $0d
.const SID_V3_FREQ_LO = SID + $0e
.const SID_V3_FREQ_HI = SID + $0f
.const SID_V3_PW_LO = SID + $10
.const SID_V3_PW_HI = SID + $11
.const SID_V3_CTRL = SID + $12
.const SID_V3_AD = SID + $13
.const SID_V3_SR = SID + $14
.const SID_VOLUME = SID + $18

.const SCREEN = $0400
.const COLORRAM = $d800
.const BORDER = $d020
.const BACKGROUND = $d021
.const RASTER = $d012
.const SPRITE_PTR = $07f8

.const MSG_LEN = 12          // "HELLO WORLD!" length
.const SCREEN_WIDTH = 40
.const SCREEN_HEIGHT = 25
.const MELODY_LEN = 48       // Number of notes in melody
.const BASS_LEN = 16         // Number of bass notes

// Zero page variables - text
.const xPos = $02
.const yPos = $03
.const xDir = $04            // 1 = right, $ff = left
.const yDir = $05            // 1 = down, $ff = up
.const colorOffset = $06
.const tempPtr = $fb         // 2 bytes ($fb-$fc)

// Zero page variables - sprite
.const spriteX = $07         // 2 bytes for X (0-319)
.const spriteXHi = $08
.const spriteY = $09
.const spriteDX = $0a        // 1 = right, $ff = left
.const spriteDY = $0b        // 1 = down, $ff = up
.const spriteColor = $0c

// Zero page variables - music
.const musicIndex = $0d
.const noteTimer = $0e
.const bassIndex = $0f
.const bassTimer = $10

// Zero page variables - text timing
.const textFrameCount = $11

start:
        // Set screen colors
        lda #0              // black
        sta BORDER
        sta BACKGROUND

        // Clear screen
        jsr clearScreen

        // Initialize text position (center-ish)
        lda #14
        sta xPos
        lda #12
        sta yPos

        // Initialize text direction (moving right and down)
        lda #1
        sta xDir
        sta yDir

        // Initialize color offset
        lda #0
        sta colorOffset

        // Initialize text frame counter
        lda #0
        sta textFrameCount

        // Initialize sprite
        jsr initSprite

        // Initialize music
        jsr initMusic

mainLoop:
        // Wait for raster at bottom of screen
        jsr waitRaster

        // Only move text every 2nd frame (slower text)
        inc textFrameCount
        lda textFrameCount
        and #$01
        bne !skipTextMove+

        // Clear the old text position
        jsr clearText

        // Update text position (bounce)
        jsr moveText

        // Draw text at new position
        jsr drawText

!skipTextMove:
        // Move and update sprite (every frame - stays fast)
        jsr moveSprite
        jsr updateSpritePos

        // Cycle colors
        inc colorOffset

        // Cycle sprite color
        lda colorOffset
        lsr
        lsr
        and #$0f
        beq !skip+
        sta SPRITE0_COLOR
!skip:

        // Flash border subtly
        lda colorOffset
        lsr
        lsr
        lsr
        and #$0f
        sta BORDER

        // Delay for smooth animation
        jsr shortDelay

        // Play music
        jsr playMusic

        jmp mainLoop

//----------------------------------------------------------
// Clear entire screen
//----------------------------------------------------------
clearScreen:
        lda #$20
        ldx #0
!loop:
        sta SCREEN,x
        sta SCREEN+$100,x
        sta SCREEN+$200,x
        sta SCREEN+$2e8,x
        inx
        bne !loop-
        rts

//----------------------------------------------------------
// Wait for raster line 250 (bottom of visible screen)
//----------------------------------------------------------
waitRaster:
        lda #250
!wait:
        cmp RASTER
        bne !wait-
        rts

//----------------------------------------------------------
// Clear text at current position
//----------------------------------------------------------
clearText:
        // Calculate screen address: SCREEN + yPos*40 + xPos
        jsr calcScreenAddr

        // Clear MSG_LEN characters with spaces
        lda #$20
        ldy #0
!loop:
        sta (tempPtr),y
        iny
        cpy #MSG_LEN
        bne !loop-
        rts

//----------------------------------------------------------
// Move text - bounce off screen edges
//----------------------------------------------------------
moveText:
        // Update X position
        lda xPos
        clc
        adc xDir
        sta xPos

        // Check right boundary (40 - MSG_LEN = 28)
        cmp #(SCREEN_WIDTH - MSG_LEN)
        bcc !checkLeft+
        // Hit right edge - reverse direction
        lda #$ff
        sta xDir
        lda #(SCREEN_WIDTH - MSG_LEN - 1)
        sta xPos
        jmp !xDone+

!checkLeft:
        // Check left boundary
        lda xPos
        bpl !xDone+
        // Hit left edge - reverse direction
        lda #1
        sta xDir
        lda #0
        sta xPos

!xDone:
        // Update Y position
        lda yPos
        clc
        adc yDir
        sta yPos

        // Check bottom boundary
        cmp #(SCREEN_HEIGHT - 1)
        bcc !checkTop+
        // Hit bottom - reverse direction
        lda #$ff
        sta yDir
        lda #(SCREEN_HEIGHT - 2)
        sta yPos
        jmp !yDone+

!checkTop:
        // Check top boundary
        lda yPos
        bpl !yDone+
        // Hit top - reverse direction
        lda #1
        sta yDir
        lda #0
        sta yPos

!yDone:
        rts

//----------------------------------------------------------
// Draw text at current position with rainbow colors
//----------------------------------------------------------
drawText:
        // Calculate screen address
        jsr calcScreenAddr

        // Draw each character
        ldy #0
!charLoop:
        lda message,y
        sta (tempPtr),y
        iny
        cpy #MSG_LEN
        bne !charLoop-

        // Now set colors
        // Add $d800 - $0400 = $d400 to get color RAM address
        lda tempPtr
        clc
        adc #<(COLORRAM - SCREEN)
        sta tempPtr
        lda tempPtr+1
        adc #>(COLORRAM - SCREEN)
        sta tempPtr+1

        // Set rainbow colors
        ldy #0
!colorLoop:
        tya
        clc
        adc colorOffset
        and #$0f
        tax
        lda colorTable,x
        sta (tempPtr),y
        iny
        cpy #MSG_LEN
        bne !colorLoop-

        rts

//----------------------------------------------------------
// Calculate screen address: SCREEN + yPos*40 + xPos
// Result in tempPtr (2 bytes)
//----------------------------------------------------------
calcScreenAddr:
        // Start with yPos * 40
        // 40 = 32 + 8, so yPos*40 = yPos*32 + yPos*8
        lda yPos
        asl             // *2
        asl             // *4
        asl             // *8
        sta tempPtr
        lda #0
        sta tempPtr+1

        // Save yPos*8 and calculate yPos*32
        lda yPos
        asl             // *2
        asl             // *4
        asl             // *8
        asl             // *16
        asl             // *32
        clc
        adc tempPtr     // yPos*32 + yPos*8 = yPos*40
        sta tempPtr
        lda #0
        adc tempPtr+1
        sta tempPtr+1

        // Add xPos
        lda tempPtr
        clc
        adc xPos
        sta tempPtr
        lda tempPtr+1
        adc #0
        sta tempPtr+1

        // Add SCREEN base address
        lda tempPtr
        clc
        adc #<SCREEN
        sta tempPtr
        lda tempPtr+1
        adc #>SCREEN
        sta tempPtr+1

        rts

//----------------------------------------------------------
// Short delay loop
//----------------------------------------------------------
shortDelay:
        ldx #$18            // Moderate delay for smooth animation
delayOuter:
        ldy #$ff
delayInner:
        dey
        bne delayInner
        dex
        bne delayOuter
        rts

//----------------------------------------------------------
// Initialize sprite
//----------------------------------------------------------
initSprite:
        // Set sprite pointer to our sprite data
        // Sprite data at $0c00 = 192 * 64
        lda #(spriteData / 64)
        sta SPRITE_PTR

        // Initial position
        lda #100
        sta spriteX
        lda #0
        sta spriteXHi
        lda #100
        sta spriteY

        // Initial direction
        lda #2              // Move 2 pixels per frame
        sta spriteDX
        sta spriteDY

        // Enable sprite 0
        lda #%00000001
        sta SPRITE_ENABLE

        // Expand sprite (2x size)
        lda #%00000001
        sta SPRITE_EXPAND_X
        sta SPRITE_EXPAND_Y

        // Set sprite color (white)
        lda #1
        sta SPRITE0_COLOR

        // Update VIC with initial position
        jsr updateSpritePos

        rts

//----------------------------------------------------------
// Move sprite - bounce off screen edges
//----------------------------------------------------------
moveSprite:
        // Update X position (16-bit)
        lda spriteX
        clc
        adc spriteDX
        sta spriteX
        lda spriteXHi
        adc #0
        sta spriteXHi

        // Check if direction is negative
        lda spriteDX
        bpl !checkRight+

        // Moving left - check left boundary (X < 24)
        lda spriteXHi
        bne !xOk+           // Hi byte set, we're fine
        lda spriteX
        cmp #24
        bcs !xOk+
        // Hit left edge
        lda #2
        sta spriteDX
        lda #24
        sta spriteX
        lda #0
        sta spriteXHi
        jmp !xOk+

!checkRight:
        // Moving right - check right boundary (X > 320)
        lda spriteXHi
        beq !checkRight2+
        // X >= 256, check if > 296 (320-24 for sprite width)
        lda spriteX
        cmp #40             // 256 + 40 = 296
        bcc !xOk+
        // Hit right edge
        lda #$fe            // -2 in two's complement
        sta spriteDX
        lda #40
        sta spriteX
        lda #1
        sta spriteXHi
        jmp !xOk+

!checkRight2:
        // X < 256, definitely not at right edge yet
        jmp !xOk+

!xOk:
        // Update Y position
        lda spriteY
        clc
        adc spriteDY
        sta spriteY

        // Check if direction is negative
        lda spriteDY
        bpl !checkBottom+

        // Moving up - check top boundary (Y < 50)
        lda spriteY
        cmp #50
        bcs !yOk+
        // Hit top edge
        lda #2
        sta spriteDY
        lda #50
        sta spriteY
        jmp !yOk+

!checkBottom:
        // Moving down - check bottom boundary (Y > 229)
        lda spriteY
        cmp #229
        bcc !yOk+
        // Hit bottom edge
        lda #$fe            // -2
        sta spriteDY
        lda #229
        sta spriteY

!yOk:
        rts

//----------------------------------------------------------
// Update sprite position in VIC registers
//----------------------------------------------------------
updateSpritePos:
        lda spriteX
        sta SPRITE0_X
        lda spriteY
        sta SPRITE0_Y

        // Set X MSB (bit 0 for sprite 0)
        lda SPRITE_X_MSB
        and #%11111110      // Clear bit 0
        ora spriteXHi       // Set if spriteXHi is 1
        sta SPRITE_X_MSB

        rts

//----------------------------------------------------------
// Data
//----------------------------------------------------------
message:
        .text "HELLO WORLD!"

colorTable:
        .byte 1, 13, 3, 14, 6, 4, 2, 10     // white, l.green, cyan, l.blue, blue, purple, red, l.red
        .byte 8, 7, 5, 13, 3, 14, 6, 1      // orange, yellow, green, etc.

//----------------------------------------------------------
// Initialize SID for music
//----------------------------------------------------------
initMusic:
        // Clear all SID registers
        lda #0
        ldx #$18
!clear:
        sta SID,x
        dex
        bpl !clear-

        // Set volume to max
        lda #$0f
        sta SID_VOLUME

        // Set up Voice 1 - lead melody (pulse wave)
        lda #$00
        sta SID_V1_PW_LO
        lda #$08                // 50% duty cycle
        sta SID_V1_PW_HI
        lda #$09                // Attack=0, Decay=9
        sta SID_V1_AD
        lda #$a0                // Sustain=10, Release=0
        sta SID_V1_SR

        // Set up Voice 2 - harmony (pulse wave, different width)
        lda #$00
        sta SID_V2_PW_LO
        lda #$04                // 25% duty cycle - different timbre
        sta SID_V2_PW_HI
        lda #$09                // Attack=0, Decay=9
        sta SID_V2_AD
        lda #$80                // Sustain=8, Release=0
        sta SID_V2_SR

        // Set up Voice 3 - bass (triangle wave for deep bass)
        lda #$00                // Attack=0, Decay=0
        sta SID_V3_AD
        lda #$f0                // Sustain=15, Release=0
        sta SID_V3_SR

        // Initialize music variables
        lda #0
        sta musicIndex
        sta bassIndex
        lda #1
        sta noteTimer
        sta bassTimer

        rts

//----------------------------------------------------------
// Play music - call every frame
//----------------------------------------------------------
playMusic:
        // === VOICE 1 & 2: Melody and harmony ===
        dec noteTimer
        bne !skipMelody+

        // Time for next note - reset timer
        lda #6                  // Note duration (frames)
        sta noteTimer

        // Gate off previous notes to retrigger envelope
        lda #$40                // Pulse waveform, gate off
        sta SID_V1_CTRL
        sta SID_V2_CTRL

        // Get note index
        ldx musicIndex

        // Voice 1 - Lead melody
        lda melodyFreqLo,x
        sta SID_V1_FREQ_LO
        lda melodyFreqHi,x
        sta SID_V1_FREQ_HI

        // Voice 2 - Harmony (offset by 4 notes for interval)
        txa
        clc
        adc #4                  // Play note 4 steps ahead for harmony
        cmp #MELODY_LEN
        bcc !noHarmWrap+
        sec
        sbc #MELODY_LEN
!noHarmWrap:
        tay
        lda melodyFreqLo,y
        sta SID_V2_FREQ_LO
        lda melodyFreqHi,y
        sta SID_V2_FREQ_HI

        // Gate on both voices
        lda #$41                // Gate + Pulse waveform
        sta SID_V1_CTRL
        sta SID_V2_CTRL

        // Advance melody to next note
        inx
        cpx #MELODY_LEN
        bcc !noWrapMelody+
        ldx #0
!noWrapMelody:
        stx musicIndex

!skipMelody:

        // === VOICE 3: Bass line (slower, every 24 frames) ===
        dec bassTimer
        bne !done+

        lda #24                 // Bass note duration (longer)
        sta bassTimer

        // Gate off bass
        lda #$10                // Triangle waveform, gate off
        sta SID_V3_CTRL

        // Get bass note
        ldx bassIndex
        lda bassFreqLo,x
        sta SID_V3_FREQ_LO
        lda bassFreqHi,x
        sta SID_V3_FREQ_HI

        // Gate on bass (triangle wave)
        lda #$11                // Gate + Triangle waveform
        sta SID_V3_CTRL

        // Advance bass
        inx
        cpx #BASS_LEN
        bcc !noWrapBass+
        ldx #0
!noWrapBass:
        stx bassIndex

!done:
        rts

//----------------------------------------------------------
// Music data - Axel F style synth-pop melody
// Frequency values for C64 SID chip
//----------------------------------------------------------

// Catchy synth-pop hook inspired by 80s hits
// Notes: F4 Ab4 C5 F5 Eb5 F4 Bb4 ... (Axel F style)
melodyFreqLo:
        // Main hook - phrase 1
        .byte $8c, $8c, $21, $8c   // F4, F4, Ab4, F4
        .byte $18, $8c, $21, $5d   // Bb4, F4, Ab4, Db5
        .byte $18, $f4, $8c, $8c   // C5, Eb5, F4, F4
        .byte $21, $8c, $18, $8c   // Ab4, F4, Bb4, F4
        // Main hook - phrase 2
        .byte $30, $18, $8c, $8c   // C5, Bb4, F4, F4
        .byte $21, $8c, $18, $5d   // Ab4, F4, Bb4, Db5
        .byte $18, $f4, $30, $18   // C5, Eb5, C5, Bb4
        .byte $8c, $21, $18, $8c   // F4, Ab4, Bb4, F4
        // Variation - phrase 3
        .byte $18, $30, $60, $18   // C5, C5, F5, C5
        .byte $f4, $30, $21, $8c   // Eb5, C5, Ab4, F4
        .byte $8c, $18, $30, $18   // F4, Bb4, C5, Bb4
        .byte $21, $8c, $8c, $8c   // Ab4, F4, F4, F4

melodyFreqHi:
        // Main hook - phrase 1
        .byte $15, $15, $19, $15   // F4, F4, Ab4, F4
        .byte $1c, $15, $19, $24   // Bb4, F4, Ab4, Db5
        .byte $22, $28, $15, $15   // C5, Eb5, F4, F4
        .byte $19, $15, $1c, $15   // Ab4, F4, Bb4, F4
        // Main hook - phrase 2
        .byte $22, $1c, $15, $15   // C5, Bb4, F4, F4
        .byte $19, $15, $1c, $24   // Ab4, F4, Bb4, Db5
        .byte $22, $28, $22, $1c   // C5, Eb5, C5, Bb4
        .byte $15, $19, $1c, $15   // F4, Ab4, Bb4, F4
        // Variation - phrase 3
        .byte $22, $22, $2b, $22   // C5, C5, F5, C5
        .byte $28, $22, $19, $15   // Eb5, C5, Ab4, F4
        .byte $15, $1c, $22, $1c   // F4, Bb4, C5, Bb4
        .byte $19, $15, $15, $15   // Ab4, F4, F4, F4

//----------------------------------------------------------
// Bass line data - funky F minor groove
//----------------------------------------------------------
bassFreqLo:
        .byte $46, $46, $46, $a3   // F2, F2, F2, Bb2
        .byte $46, $46, $09, $46   // F2, F2, Ab2, F2
        .byte $46, $46, $46, $a3   // F2, F2, F2, Bb2
        .byte $10, $09, $46, $46   // C3, Ab2, F2, F2

bassFreqHi:
        .byte $05, $05, $05, $06   // F2, F2, F2, Bb2
        .byte $05, $05, $06, $05   // F2, F2, Ab2, F2
        .byte $05, $05, $05, $06   // F2, F2, F2, Bb2
        .byte $08, $06, $05, $05   // C3, Ab2, F2, F2

//----------------------------------------------------------
// Sprite data - Ball shape (24x21 pixels = 63 bytes)
// Placed at $0c00 (block 192)
//----------------------------------------------------------
*= $0c00 "Sprite Data"
spriteData:
        .byte %00000000, %11111000, %00000000
        .byte %00000011, %11111110, %00000000
        .byte %00001111, %11111111, %10000000
        .byte %00011111, %11111111, %11000000
        .byte %00111111, %11111111, %11100000
        .byte %00111111, %11111111, %11100000
        .byte %01111111, %11111111, %11110000
        .byte %01111111, %11111111, %11110000
        .byte %01111111, %11111111, %11110000
        .byte %11111111, %11111111, %11111000
        .byte %11111111, %11111111, %11111000
        .byte %11111111, %11111111, %11111000
        .byte %01111111, %11111111, %11110000
        .byte %01111111, %11111111, %11110000
        .byte %01111111, %11111111, %11110000
        .byte %00111111, %11111111, %11100000
        .byte %00111111, %11111111, %11100000
        .byte %00011111, %11111111, %11000000
        .byte %00001111, %11111111, %10000000
        .byte %00000011, %11111110, %00000000
        .byte %00000000, %11111000, %00000000
