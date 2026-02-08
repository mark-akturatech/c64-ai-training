# Example: Screen Clear via Control Code

## Summary
Minimal screen clear using single CHROUT call with control code $93 (CLR). KERNAL interprets this as a full screen clear instruction, providing the most efficient clear method with minimal code.

## Key Registers
- $FFD2 - KERNAL CHROUT - receives $93 control code for screen clear

## Techniques
- KERNAL control codes
- minimal code footprint

## Hardware
KERNAL ROM

## Source Code
```asm
; Program: Screen clear example v2
; Author: andrew burch
; Assembler: win2c64
; Notes: Use chrout kernal routine to output
;		clear home character code to clear
;		screen
;

chrout  .equ $ffd2      ; kernal addresss

        .org $c000      ; begin (49512)

main    lda #$93        ; clear screen char
        jsr chrout
        rts             ; return to BASIC
```
