# 6502 Instructions — Status Flag Change Group

**Summary:** This group comprises 6502 instructions that directly set or clear specific processor status flags: CLC, CLD, CLI, CLV, SEC, SED, and SEI. Each instruction affects a single bit in the Processor Status (P) register without modifying other flags.

**Description**

These instructions are single-byte, implied-addressing operations that alter individual bits in the 6502 Processor Status (P) register:

- **CLC** — Clear Carry Flag (C = 0)
- **SEC** — Set Carry Flag (C = 1)
- **CLD** — Clear Decimal Mode Flag (D = 0)
- **SED** — Set Decimal Mode Flag (D = 1)
- **CLI** — Clear Interrupt Disable Flag (I = 0)
- **SEI** — Set Interrupt Disable Flag (I = 1)
- **CLV** — Clear Overflow Flag (V = 0)

Each instruction has the following characteristics:

- **Opcode (Hex)**: Unique hexadecimal value representing the instruction.
- **Bytes**: Instruction length in bytes.
- **Cycles**: Number of clock cycles required for execution.
- **Flags Affected**: Processor status flags modified by the instruction.

| Instruction | Opcode (Hex) | Bytes | Cycles | Flags Affected |
|-------------|--------------|-------|--------|----------------|
| CLC         | 18           | 1     | 2      | C=0            |
| SEC         | 38           | 1     | 2      | C=1            |
| CLD         | D8           | 1     | 2      | D=0            |
| SED         | F8           | 1     | 2      | D=1            |
| CLI         | 58           | 1     | 2      | I=0            |
| SEI         | 78           | 1     | 2      | I=1            |
| CLV         | B8           | 1     | 2      | V=0            |

*Note: These instructions do not affect other flags in the Processor Status register.*

## Source Code

```assembly
; Example usage of status flag change instructions

CLC     ; Clear Carry Flag
SEC     ; Set Carry Flag
CLD     ; Clear Decimal Mode Flag
SED     ; Set Decimal Mode Flag
CLI     ; Clear Interrupt Disable Flag
SEI     ; Set Interrupt Disable Flag
CLV     ; Clear Overflow Flag
```

## References

- "6502 Instruction Set" — Detailed information on 6502 instructions and their effects.
- "6502 Instruction Tables" — Comprehensive opcode tables and instruction details.
- "6502 Instruction Set Quick Reference" — Quick reference guide for 6502 instructions.

## Mnemonics
- CLC
- SEC
- CLD
- SED
- CLI
- SEI
- CLV
