# DEY (Decrement Y) — 6502

**Summary:** DEY (opcode $88) is an implied 6502 instruction that decrements the Y index register, affects the N and Z flags, uses 1 byte and 2 cycles. Searchable terms: $88, DEY, implied, Y register, N flag, Z flag.

## Description
DEY subtracts one from the Y index register and stores the result back in Y. It updates the Zero (Z) and Negative (N) processor status flags based on the resulting 8-bit value; Carry (C), Interrupt Disable (I), Decimal (D), and Overflow (V) are not affected.

**[Note: Source may contain an error — original text showed "X - 1 -> Y"; the correct operation is Y - 1 -> Y.]**

## Behavior
- Operation: Y <- (Y - 1) & $FF (wraps at 8 bits)
- Flags affected:
  - Z = 1 if Y == 0, else Z = 0
  - N = 1 if bit 7 of Y is set (Y & $80 != 0), else N = 0
  - C, I, D, V unchanged
- Addressing mode: Implied
- Typical use: index decrement in loops and array traversals

## Source Code
```text
Opcode summary:
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   DEY                 |   $88   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
```

```asm
; Example assembly and machine code
        DEY         ; opcode $88
; Machine code byte:
        .byte $88
```

```text
Pseudocode:
    A = Y              ; (A shown only for clarity, actual CPU uses Y)
    Y = (Y - 1) & $FF
    Z = (Y == 0) ? 1 : 0
    N = (Y & $80) ? 1 : 0
    ; C, I, D, V unchanged
```

## References
- "instruction_operation_dey" — expands on DEY pseudocode (reference mentioned in source)
- (Ref: 7.7) — original cross-reference number from the source material

## Mnemonics
- DEY
