# 6502 AND — bitwise AND (AC &= src)

**Summary:** The 6502 `AND` instruction performs a bitwise AND between the accumulator (AC) and a source operand (memory or immediate), sets the Negative (N) and Zero (Z) flags based on the result, and stores the result back into AC. Searchable terms: AND, AC, N flag, Z flag, SET_SIGN, SET_ZERO.

**Operation**

The accumulator is ANDed with the source operand, and the result becomes the new accumulator value. The processor updates the sign (negative) and zero flags according to the result:

- **Effect:** AC := AC & src
- **Flags updated:**
  - **N (Negative):** Set if bit 7 of the result is 1; cleared otherwise.
  - **Z (Zero):** Set if the result is 0; cleared otherwise.

The source operand (src) is typically an immediate value or a value from memory, depending on the addressing mode.

## Source Code

```asm
/* AND */
    src &= AC;
    SET_SIGN(src);
    SET_ZERO(src);
    AC = src;
```

**Addressing Modes and Opcodes**

The `AND` instruction supports various addressing modes, each with a specific opcode, instruction length (in bytes), and execution time (in clock cycles):

| Addressing Mode           | Opcode | Bytes | Cycles | Description                                                                                   |
|---------------------------|--------|-------|--------|-----------------------------------------------------------------------------------------------|
| Immediate                 | $29    | 2     | 2      | Operand is a constant value.                                                                  |
| Zero Page                 | $25    | 2     | 3      | Operand is located at a zero-page address.                                                    |
| Zero Page,X               | $35    | 2     | 4      | Operand is located at a zero-page address offset by the X register.                           |
| Absolute                  | $2D    | 3     | 4      | Operand is located at a 16-bit absolute address.                                              |
| Absolute,X                | $3D    | 3     | 4*     | Operand is located at an absolute address offset by the X register.                           |
| Absolute,Y                | $39    | 3     | 4*     | Operand is located at an absolute address offset by the Y register.                           |
| Indexed Indirect (X)      | $21    | 2     | 6      | Operand address is found at a zero-page address offset by the X register.                     |
| Indirect Indexed (Y)      | $31    | 2     | 5*     | Operand address is found at a zero-page address and offset by the Y register.                 |

\* Add 1 cycle if a page boundary is crossed.

For example, the `AND` instruction with immediate addressing mode (`AND #$nn`) has the opcode `$29`, requires 2 bytes, and executes in 2 cycles.

## Key Registers

- **Accumulator (AC):** Stores the result of the AND operation.
- **Processor Status Register:**
  - **N (Negative) Flag:** Indicates if the result is negative.
  - **Z (Zero) Flag:** Indicates if the result is zero.

## References

- "6502 Instruction Set" by Masswerk.at
- "6502 Instruction Set" by Dusted.dk
- "6502 Instruction Set" by Einarvalur.co

## Mnemonics
- AND
