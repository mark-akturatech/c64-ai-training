# Compare instructions: CMP / CPX / CPY (6502)

**Summary:** Lists 6502 compare-family mnemonics CMP, CPX, CPY with their addressing-mode opcode bytes (immediate, zero page, absolute, indexed and indirect where applicable), cycle counts, and a concise overview of behavior and flags (C, Z, N).

**Overview**
CMP, CPX, and CPY perform a subtraction-like comparison between a register and a memory operand without changing the operands; they set processor flags based on (Register - Memory):

- **CMP**: Compares Accumulator (A) with memory.
- **CPX**: Compares X register with memory.
- **CPY**: Compares Y register with memory.

**Flags affected:**
- **C (Carry)**: Set if Register ≥ Memory (no borrow).
- **Z (Zero)**: Set if Register = Memory.
- **N (Negative)**: Set to bit 7 of (Register - Memory) result.

**Addressing modes:**
- **CPX/CPY** support Immediate, Zero Page, and Absolute only.
- **CMP** supports Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X), and (Indirect),Y.

## Source Code
```text
Opcode table (6502) — compare-family

Instruction | Addressing Mode | Opcode | Bytes | Cycles | Notes
----------- | --------------- | ------ | ----- | ------ | -----
CMP         | Immediate       | $C9    | 2     | 2      |
CMP         | Zero Page       | $C5    | 2     | 3      |
CMP         | Zero Page,X     | $D5    | 2     | 4      |
CMP         | Absolute        | $CD    | 3     | 4      |
CMP         | Absolute,X      | $DD    | 3     | 4      | +1 cycle if page boundary crossed
CMP         | Absolute,Y      | $D9    | 3     | 4      | +1 cycle if page boundary crossed
CMP         | (Indirect,X)    | $C1    | 2     | 6      |
CMP         | (Indirect),Y    | $D1    | 2     | 5      | +1 cycle if page boundary crossed
CPX         | Immediate       | $E0    | 2     | 2      |
CPX         | Zero Page       | $E4    | 2     | 3      |
CPX         | Absolute        | $EC    | 3     | 4      |
CPY         | Immediate       | $C0    | 2     | 2      |
CPY         | Zero Page       | $C4    | 2     | 3      |
CPY         | Absolute        | $CC    | 3     | 4      |
```

**Notes:**
- The table lists opcode bytes in hexadecimal with a leading `$` as in common 6502 notation.
- For addressing modes marked with "+1 cycle if page boundary crossed," an additional cycle is required if the effective address calculation crosses a page boundary. ([nesdev.org](https://www.nesdev.org/obelisk-6502-guide/reference.html?utm_source=openai))

## References
- "standard_table_header_addressing_modes" — expands on addressing-mode column usage in the mnemonic table
- "decrement_instructions" — follows with decrement instructions (DEC/DEX/DEY)

## Mnemonics
- CMP
- CPX
- CPY
