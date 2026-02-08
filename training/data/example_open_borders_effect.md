# Example: Open Borders Effect

## Summary
Removes top/bottom screen borders by toggling $D011 bit 3 (25-row/24-row mode) at precise scanlines. Sets 24-row mode at line 249 to trick VIC-II into not drawing the border, then restores 25-row mode at line 252. This creates the illusion of an extended screen area.

## Key Registers
- $D012 - VIC-II raster line - triggers at 249 and 252
- $D019 - VIC-II interrupt status - acknowledged
- $D011 - VIC-II control 1 - bit 3 toggled for 24/25 row switching
- $D01A - VIC-II interrupt mask - raster interrupt enabled
- $DC0D/$DD0D - CIA interrupt control - disabled

## Techniques
- border removal
- timing-critical register switching
- raster interrupts

## Hardware
VIC-II, CIA

## Source Code
```asm
; Open Top/Bottom Borders
;
; Platform: C64
; Code: Jesder / 0xc64
; Site: http://www.0xc64.com
; Compiler: win2c64 (http://www.aartbik.com)
;

                        ; common register definitions

REG_INTSERVICE_LOW      .equ $0314              ; interrupt service routine low byte
REG_INTSERVICE_HIGH     .equ $0315              ; interrupt service routine high byte
REG_SCREENCTL_1         .equ $d011              ; screen control register #1
REG_RASTERLINE          .equ $d012              ; raster line position 
REG_INTFLAG             .equ $d019              ; interrupt flag register
REG_INTCONTROL          .equ $d01a              ; interrupt control register
REG_INTSTATUS_1         .equ $dc0d              ; interrupt control and status register #1
REG_INTSTATUS_2         .equ $dd0d              ; interrupt control and status register #2

                
                        ; program start

                        .org $0801              ; begin (2049)

                        .byte $0b, $08, $01, $00, $9e, $32, $30, $36
                        .byte $31, $00, $00, $00 ;= SYS 2061


                        ; clear border garbage

                        lda #00
                        sta $3fff


                        ; register first interrupt

                        sei

                        lda #$7f
                        sta REG_INTSTATUS_1     ; turn off the CIA interrupts
                        sta REG_INTSTATUS_2
                        and REG_SCREENCTL_1     ; clear high bit of raster line
                        sta REG_SCREENCTL_1

                        ldy #249
                        sty REG_RASTERLINE
                        lda #<switch_border_off
                        ldx #>switch_border_off
                        sta REG_INTSERVICE_LOW
                        stx REG_INTSERVICE_HIGH

                        lda #$01                ; enable raster interrupts
                        sta REG_INTCONTROL
                        cli

forever                 bne forever


                        ; border control routines -----------------------------------------------------------------------------------------]
                        ; -----------------------------------------------------------------------------------------------------------------]

switch_border_off       inc REG_INTFLAG

                        lda REG_SCREENCTL_1     ; switch to 24 row mode
                        and #247
                        sta REG_SCREENCTL_1

                        ldy #252
                        sty REG_RASTERLINE
                        lda #<reset_screen_mode
                        ldx #>reset_screen_mode
                        sta REG_INTSERVICE_LOW
                        stx REG_INTSERVICE_HIGH

                        jmp $ea81


reset_screen_mode       inc REG_INTFLAG

                        lda REG_SCREENCTL_1     ; restore 25 row mode
                        ora #08
                        sta REG_SCREENCTL_1

                        ldy #249
                        sty REG_RASTERLINE
                        lda #<switch_border_off
                        ldx #>switch_border_off
                        sta REG_INTSERVICE_LOW
                        stx REG_INTSERVICE_HIGH
        
                        jmp $ea81
```
