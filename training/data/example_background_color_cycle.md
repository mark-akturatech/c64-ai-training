# Example: Background Color Cycle

## Summary
Simplest possible demo effect: an infinite loop that continuously increments the background color register $D021, cycling through all 16 VIC-II colors. No timing synchronization or interrupts are used.

## Key Registers
- $D021 - VIC-II background color - incremented each loop iteration

## Techniques
- simple loop
- register increment

## Hardware
VIC-II

## Source Code
```asm
; Program: Cycle screen colour
; Author: andrew burch
; Assembler: DASM
; Notes: First C64 assembly code for 20 years
;

; target processor
 processor 6502

; code origin
 org $1000

; main
loop:	inc $d021
		jmp loop
```
