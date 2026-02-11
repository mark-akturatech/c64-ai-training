# Grouped illegal mnemonics: DCP/DCM and LAX/LXA (opcode bytes)

**Summary:** List of unofficial 6502/C64 illegal mnemonics DCP/DCM (DEC then CMP) and LAX/LXA (load A and X) with their opcode-byte encodings, addressing modes, cycle counts, and flag effects.

**Description**

- **DCP (also known as DCM):** An undocumented opcode that decrements a memory location and then compares the result with the accumulator. It affects the processor flags similarly to a combination of DEC and CMP.

- **LAX (and variant LXA):** An undocumented opcode that loads a value from memory into both the accumulator (A) and the X register simultaneously, effectively performing LDA and LDX in one operation.

These unofficial opcodes are present in many NMOS 6502 implementations. Their behavior and exact timing may vary between silicon revisions and CMOS-based 6502-compatible CPUs.

**Opcode Details**

Below is a table listing the opcode bytes, corresponding addressing modes, cycle counts, and flag effects for the DCP/DCM and LAX/LXA instructions:

| Mnemonic | Opcode | Addressing Mode | Bytes | Cycles | Flags Affected | Notes |
|----------|--------|-----------------|-------|--------|----------------|-------|
| DCP      | $C7   | Zero Page       | 2     | 5      | N, Z, C        |       |
| DCP      | $D7   | Zero Page,X     | 2     | 6      | N, Z, C        |       |
| DCP      | $CF   | Absolute        | 3     | 6      | N, Z, C        |       |
| DCP      | $DF   | Absolute,X      | 3     | 7      | N, Z, C        |       |
| DCP      | $DB   | Absolute,Y      | 3     | 7      | N, Z, C        |       |
| DCP      | $C3   | (Indirect,X)    | 2     | 8      | N, Z, C        |       |
| DCP      | $D3   | (Indirect),Y    | 2     | 8      | N, Z, C        |       |
| LAX      | $A7   | Zero Page       | 2     | 3      | N, Z           |       |
| LAX      | $B7   | Zero Page,Y     | 2     | 4      | N, Z           |       |
| LAX      | $AF   | Absolute        | 3     | 4      | N, Z           |       |
| LAX      | $BF   | Absolute,Y      | 3     | 4*     | N, Z           | *Add 1 cycle if page boundary is crossed |
| LAX      | $A3   | (Indirect,X)    | 2     | 6      | N, Z           |       |
| LAX      | $B3   | (Indirect),Y    | 2     | 5*     | N, Z           | *Add 1 cycle if page boundary is crossed |
| LXA      | $AB   | Immediate       | 2     | 2      | N, Z           | Highly unstable |

*Note: The LXA instruction is highly unstable and involves a 'magic' constant. Its behavior is not consistent across different 6502 implementations.*

## References

- "6502 Instruction Set" by Masswerk.at
- "6502 'Illegal' Opcodes Demystified" by Masswerk.at
- "6502 Instruction Tables" by Masswerk.at
- "6502 Opcodes" by Atarimax.com

## Mnemonics
- DCP
- DCM
- LAX
- LXA
