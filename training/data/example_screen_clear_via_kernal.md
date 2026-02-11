# Example: Screen Clear via KERNAL

## Summary
Clears the screen using KERNAL ROM routine $FFD2 (CHROUT) to output space characters. Implements nested loop with X register for columns (0-39) and Y register for rows (0-24). Cursor position is set using the PLOT routine before each character output.

## Key Registers
- $FFD2 - KERNAL CHROUT - character output routine
- $FFF0 - KERNAL PLOT - cursor positioning routine

## Techniques
- KERNAL routine calls
- nested loops
- character output

## Hardware
KERNAL ROM

## Source Code
```asm
; Program: Screen clear example v1
; Author: andrew burch
; Assembler: win2c64
; Notes: Use chrout kernal routine to fill
;		screen with spaces
;

chrout  .equ $ffd2  ; kernal addresss
plot    .equ $fff0

        .org $c000  ; begin (49512)

init    clc         ; init cursor position
        ldx #00
        ldy #00
        jsr plot
        lda #$20    ; space chracter
        ldy #25
yloop   ldx #40
xloop   jsr chrout
        dex
        bne xloop
        dey
        bne yloop
        rts         ; return to BASIC
```

## Labels
- CHROUT
- PLOT
