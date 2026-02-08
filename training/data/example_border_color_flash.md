# Example: Border Color Flash

## Summary
Continuously cycles the VIC-II border color through all 16 colors by incrementing register $D020 in a tight infinite loop. No timing synchronization or interrupts are used. This is the simplest possible VIC-II hardware register demonstration.

## Key Registers
- $D020 - VIC-II border color - incremented each loop iteration

## Techniques
- infinite loop
- memory-mapped I/O

## Hardware
VIC-II

## Source Code
```asm
; ============================================================================
; Border Flash - Simplest VIC-II Effect
; From: "An Introduction to Programming C-64 Demos" by Puterman (Linus Åkerlund)
; Source: https://www.antimon.org/code/Linus/
;
; Demonstrates: Memory-mapped I/O, infinite loops
; The border color register at $D020 is continuously incremented,
; causing the border to flash through all 16 C64 colors.
; ============================================================================

           * = $1000

loop:      inc $d020       ; increment border color register
           jmp loop        ; jump back - infinite loop
```
