# 6502 BIT — flag behavior (copy bit7->N, bit6->V, Z from A&M)

**Summary:** Describes the 6502 BIT instruction behavior: copy bit 7 of the memory operand into the Negative (N) flag, copy bit 6 into the Overflow (V) flag, and set the Zero (Z) flag based on A AND memory (A & M). Uses masks $80 and $40 for N and V.

## Operation
BIT performs a bitwise test between the accumulator (A) and a memory operand (M) without changing A. It updates three status flags:

- Negative (N) — set from bit 7 of the memory operand (M7).
- Overflow (V) — set from bit 6 of the memory operand (M6).
- Zero (Z) — set if (A & M) == 0, cleared otherwise.

The instruction does not modify the accumulator or other flags (Carry, Decimal, Interrupt disable, Break, or Carry are unaffected by BIT).

## Source Code
```asm
/* BIT */
    SET_SIGN(src);                 ; copy bit 7 of src to Negative flag (N)
    SET_OVERFLOW(0x40 & src);      ; copy bit 6 to Overflow flag (V)
    SET_ZERO(src & AC);            ; set Zero if (A & src) == 0
```

Alternate explicit pseudocode:
```asm
; M = memory operand
; A = accumulator
; P = processor status flags

P.N = (M & $80) != 0        ; Negative = bit 7 of M
P.V = (M & $40) != 0        ; Overflow = bit 6 of M
P.Z = ((A & M) == 0)        ; Zero = result of A AND M is zero
; A unchanged
```

## References
- "instruction_tables_bit" — expands on BIT opcodes and addressing modes

## Mnemonics
- BIT
