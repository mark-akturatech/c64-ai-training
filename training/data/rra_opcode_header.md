# NMOS 6510 — RRA (RRD) Undocumented Opcode

**Summary:** The RRA (also known as RRD) is an undocumented instruction on the NMOS 6510 processor. It performs a right rotate (ROR) operation on a memory location, followed by an add with carry (ADC) operation between the accumulator and the rotated memory value.

**Description**

The RRA instruction combines two operations sharing the same addressing mode:

1. **ROR {addr}**: Rotates the bits of the memory location at {addr} one position to the right. The least significant bit is shifted into the carry flag, and the carry flag is shifted into the most significant bit.

2. **ADC A, {addr}**: Adds the rotated value at {addr} to the accumulator, including the carry flag.

This sequence effectively performs a combined rotate and add operation.

**Addressing Modes and Opcodes**

The RRA instruction supports multiple addressing modes, each with specific opcodes, instruction sizes, and cycle counts:

| Addressing Mode       | Opcode | Bytes | Cycles |
|-----------------------|--------|-------|--------|
| Zero Page             | $67    | 2     | 5      |
| Zero Page,X           | $77    | 2     | 6      |
| Absolute              | $6F    | 3     | 6      |
| Absolute,X            | $7F    | 3     | 7      |
| Absolute,Y            | $7B    | 3     | 7      |
| (Indirect,X)          | $63    | 2     | 8      |
| (Indirect),Y          | $73    | 2     | 8      |

*Note: The cycle counts are based on standard operation; additional cycles may be required if a page boundary is crossed during indexed addressing modes.*

**Flag Effects**

The RRA instruction affects the following processor status flags:

- **Negative (N):** Set if the result of the ADC operation is negative (bit 7 is set).

- **Overflow (V):** Set if the ADC operation results in a signed overflow.

- **Zero (Z):** Set if the result of the ADC operation is zero.

- **Carry (C):** Set if the ADC operation results in a carry out.

*Note: The Decimal (D) flag influences the ADC operation if set, causing it to perform binary-coded decimal addition. The Interrupt (I) and Break (B) flags are unaffected by this instruction.*

## References

- "NMOS 6510 Unintended Opcodes - No More Secrets v0.99" by groepaz, December 24, 2024.

- "RRA - C64-Wiki"

- "6502 Instruction Set" by masswerk.at

## Mnemonics
- RRA
- RRD
