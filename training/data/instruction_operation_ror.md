# ROR (Rotate Right) — 6502

**Summary:** ROR rotates an 8-bit operand right through the Carry flag (carry-in becomes bit7, bit0 becomes new Carry). Affects Carry, Negative (Sign), and Zero flags; operates on the accumulator or memory depending on addressing mode.

**Behavior**

ROR performs a right rotate through the processor Carry flag:

- Take the current Carry (C) and insert it as the new bit7 of the 8-bit operand.
- The original bit0 of the operand becomes the new Carry.
- The operand is shifted right one bit; the resulting 8-bit value is written back to the accumulator or memory.
- Flags updated:
  - Carry (C) := original bit0
  - Negative / Sign (N) := bit7 of result
  - Zero (Z) := set if result == 0
- No other flags (e.g., Overflow, Decimal, Interrupt) are affected by ROR.

This description applies to the accumulator form (ROR A) and to memory forms (ROR addr). The effective operand (A or memory byte) is the 8-bit value that is rotated; implementation typically composes a 9-bit value by OR'ing the operand with (C << 8), then shifts right, captures low bit for Carry, and stores the low 8 bits back.

**Addressing Modes, Opcodes, and Cycle Counts**

| Addressing Mode | Syntax     | Opcode | Bytes | Cycles |
|-----------------|------------|--------|-------|--------|
| Accumulator     | ROR A      | $6A    | 1     | 2      |
| Zero Page       | ROR $44    | $66    | 2     | 5      |
| Zero Page,X     | ROR $44,X  | $76    | 2     | 6      |
| Absolute        | ROR $4400  | $6E    | 3     | 6      |
| Absolute,X      | ROR $4400,X| $7E    | 3     | 7      |

*Note: For Absolute,X addressing mode, if the indexing crosses a page boundary, an additional cycle is required.*

**Examples**

### Accumulator Mode

### Zero Page Mode

### Zero Page,X Mode

### Absolute Mode

### Absolute,X Mode

## Source Code

```assembly
; Initial state: A = %11001010, C = 1
ROR A
; Result: A = %11100101, C = 0
; Flags: N = 1, Z = 0, C = 0
```

```assembly
; Memory at $44: %11001010, C = 1
ROR $44
; Memory at $44: %11100101, C = 0
; Flags: N = 1, Z = 0, C = 0
```

```assembly
; X = $01
; Memory at $45: %11001010, C = 1
ROR $44,X
; Memory at $45: %11100101, C = 0
; Flags: N = 1, Z = 0, C = 0
```

```assembly
; Memory at $4400: %11001010, C = 1
ROR $4400
; Memory at $4400: %11100101, C = 0
; Flags: N = 1, Z = 0, C = 0
```

```assembly
; X = $01
; Memory at $4401: %11001010, C = 1
ROR $4400,X
; Memory at $4401: %11100101, C = 0
; Flags: N = 1, Z = 0, C = 0
```

```text
/* ROR pseudocode */
    if (IF_CARRY()) src |= 0x100;      ; set bit8 from Carry (carry-in)
    SET_CARRY(src & 0x01);             ; new Carry = original bit0
    src >>= 1;                         ; shift right, bit7 becomes previous Carry
    SET_SIGN(src);                     ; N = bit7 of result
    SET_ZERO(src);                     ; Z = (result == 0)
    STORE src in memory or accumulator depending on addressing mode.
```

## References

- "instruction_tables_ror" — expands on ROR opcodes and addressing-mode tables.

## Mnemonics
- ROR
