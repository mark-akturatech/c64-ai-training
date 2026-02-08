# Example: Raster Interrupt Main Loop

**Project:** dustlayer_intro - Color wash intro with SID music, raster interrupts, and animated text

## Summary
Sets up the C64 interrupt system for raster-based timing. Disables CIA interrupts via $DC0D/$DD0D, configures custom IRQ vector at $0314/$0315, sets raster interrupt trigger at line 0 via $D012, and enables raster interrupts via $D01A. IRQ handler calls color wash and music subroutines synchronized to each frame.

## Key Registers
- $DC0D/$DD0D - CIA interrupt control - disabled with $7F
- $D01A - VIC-II interrupt mask - raster IRQ enabled ($01)
- $D011 - VIC-II control 1 - bit 7 cleared for raster < 256
- $D012 - VIC-II raster line - trigger set to 0
- $0314/$0315 - IRQ vector - points to custom handler
- $D019 - VIC-II interrupt status - acknowledged in handler

## Techniques
- raster interrupt setup
- CIA interrupt disabling
- custom IRQ handler

## Hardware
VIC-II, CIA

## Source Code
```asm
;============================================================
;    some initialization and interrupt redirect setup
;============================================================

           sei         ; set interrupt disable flag
            
           jsr init_screen     ; clear the screen
           jsr init_text       ; write lines of text
           jsr sid_init     ; init music routine now

           ldy #$7f    ; $7f = %01111111
           sty $dc0d   ; Turn off CIAs Timer interrupts ($7f = %01111111)
           sty $dd0d   ; Turn off CIAs Timer interrupts ($7f = %01111111)
           lda $dc0d   ; by reading $dc0d and $dd0d we cancel all CIA-IRQs in queue/unprocessed
           lda $dd0d   ; by reading $dc0d and $dd0d we cancel all CIA-IRQs in queue/unprocessed
          
           lda #$01    ; Set Interrupt Request Mask...
           sta $d01a   ; ...we want IRQ by Rasterbeam (%00000001)

           lda $d011   ; Bit#0 of $d011 indicates if we have passed line 255 on the screen
           and #$7f    ; it is basically the 9th Bit for $d012
           sta $d011   ; we need to make sure it is set to zero for our intro.

           lda #<irq   ; point IRQ Vector to our custom irq routine
           ldx #>irq 
           sta $314    ; store in $314/$315
           stx $315   

           lda #$00    ; trigger first interrupt at row zero
           sta $d012

           cli                  ; clear interrupt disable flag
           jmp *                ; infinite loop


;============================================================
;    custom interrupt routine
;============================================================

irq        dec $d019        ; acknowledge IRQ / clear register for next interrupt

           jsr colwash      ; jump to color cycling routine
           jsr play_music	  ; jump to play music routine


           jmp $ea81        ; return to kernel interrupt routine
```
