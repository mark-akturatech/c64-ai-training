# add (AY) to FAC1 — JSR $BA8C (unpack memory (AY) into FAC2) (ROM $B867)

**Summary:** Entry point at $B867 (6502 JSR) calls $BA8C to unpack the memory operand addressed by (AY) into FAC2, used when adding a memory operand to FAC1 (FAC = floating accumulator in C64 BASIC ROM).

## Description
This small ROM entry prepares FAC2 by unpacking a floating-point value from memory using the (AY) indirect-indexed addressing mode (6502 (zp),Y). It is the entry used when an addition operation must add a memory operand to the current FAC1 value; after unpacking, FAC2 is handed to the add-routine that aligns and operates on mantissas.

- Purpose: dispatch to the unpack routine that loads FAC2 from the memory operand pointed to by (AY).
- Control flow: JSR $BA8C — after the unpack completes, execution continues with the add FAC2->FAC1 routine (see referenced chunk).

## Source Code
```asm
; *** add (AY) to FAC1
.,B867  20 8C BA   JSR $BA8C     ; unpack memory (AY) into FAC2
```

## References
- "add_fac2_to_fac1_alignment_and_mantissa_operations" — expands on how the unpacked FAC2 is then processed by the add FAC2->FAC1 routine
