# 6502 Two's-Complement Negation (Accumulator and Multi-byte)

**Summary:** Two's-complement negation on 6502: use EOR #$FF / CLC / ADC #1 to negate a value in A, and use subtraction-from-zero with SEC / SBC to negate memory-held multi-byte numbers; check the high bit (sign bit) first to decide whether to negate.

## Overview
For signed 8/16-bit (or larger) values stored on a 6502, convert negative operands to positive (for unsigned routines) by negating them when the high bit (sign bit) is set. Two practical and efficient methods are:

- Accumulator (8-bit) negation: complement then add 1 (two's complement) using EOR #$FF; CLC; ADC #1. CLC clears carry so ADC adds the +1 correctly.
- Memory multi-byte negation: compute 0 - N across bytes using SEC before the first SBC so the borrow chain propagates correctly; the carry flag left by the low-byte SBC is used by the subsequent high-byte SBC.

(If you need to test the sign before negating: test the high bit — e.g., BIT mem or LDA mem / BMI — to branch on N.)

## Details
- Accumulator negation:
  - EOR #$FF flips all bits (bitwise NOT).
  - CLC ensures ADC #1 performs an addition of 1 with no incoming carry.
  - The sequence produces the two's-complement negative of A.

- Multi-byte negation (example: 16-bit value at NUM = low, NUM+1 = high):
  - Load 0 into A, SEC, SBC low byte — this computes 0 - low, sets/clears carry depending on borrow.
  - Store resulting low byte.
  - Load 0 into A again and SBC high byte — this subtracts high plus the borrow from the previous step (carry is used automatically).
  - Store resulting high byte.
  - This correctly produces the two's-complement negation of a little-endian multi-byte value.

- Use these negations to make operands positive before calling unsigned multiply/divide routines or other unsigned math code.

## Source Code
```asm
; Negate an 8-bit value in A (fastest)
EOR #$FF      ; A = ~A
CLC           ; clear carry for ADC
ADC #$01      ; A = A + 1       ; now A = -originalA (two's complement)

; Negate a 16-bit little-endian number at label NUM (NUM = low, NUM+1 = high)
        LDA #$00
        SEC
        SBC NUM        ; A = 0 - NUM_low    (carry reflects borrow)
        STA NUM        ; store negated low byte
        LDA #$00
        SBC NUM+1      ; A = 0 - NUM_high - borrow_from_low
        STA NUM+1      ; store negated high byte
```

## References
- "signed_multiply_wrapper" — expands on uses of these negation techniques in signed/unsigned multiplication wrappers.