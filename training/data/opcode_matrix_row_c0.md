# NMOS 6510 — Opcode matrix row (C0..DF) — NOP #imm, DEC, DEX, DCP, SBX

**Summary:** Opcode matrix row for high-nibble C/D (C0..DF) showing NOP #imm, DEC (zp/abs/zp,X/abs,X), DEX, undocumented DCP (DEC+CMP) variants with addressing modes (zp,X / zp / abs / (zp),Y / zp,X / abs,Y / abs,X), JAM, and the undocumented immediate SBX. Searchable terms: DCP, SBX, DEC, DEX, NOP #imm, JAM, opcode row C0..DF, NMOS 6510.

**Description**

This chunk lists the mnemonics encountered in the NMOS 6510 opcode matrix row for the C/D high-nibble range. It includes both official instructions (DEC, DEX, NOP immediate) and undocumented/illegal opcodes observed on NMOS 6502-family chips:

- **NOP #imm** — Immediate-mode NOP (opcode consumes an immediate byte; no official effect).
- **DEC** — Decrement memory. Supported addressing modes include zero page, absolute, zero page,X, and absolute,X.
- **DEX** — Decrement X register.
- **DCP (undocumented, also seen as DCM)** — A combined illegal opcode that performs DEC on memory then CMP between A and that memory; multiple addressing modes appear in this row (zp,X; zp; abs; (zp),Y; zp,X; abs,Y; abs,X).
- **SBX (undocumented immediate)** — Present as an undocumented immediate-mode opcode in this row (listed as SBX #imm in the source).
- **JAM** — Illegal opcode that halts/locks the CPU on many NMOS 6502 variants.

The following table provides the opcode byte values, mnemonics, addressing modes, cycle counts, and flag effects for the C0..DF range:

| Opcode | Mnemonic | Addressing Mode | Cycles | N | V | B | D | I | Z | C |
|--------|----------|-----------------|--------|---|---|---|---|---|---|---|
| $C0    | CPY      | Immediate       | 2      | X |   |   |   |   | X | X |
| $C1    | CMP      | (Indirect,X)    | 6      | X |   |   |   |   | X | X |
| $C2    | NOP      | Immediate       | 2      |   |   |   |   |   |   |   |
| $C3    | DCP      | (Indirect,X)    | 8      | X |   |   |   |   | X | X |
| $C4    | CPY      | Zero Page       | 3      | X |   |   |   |   | X | X |
| $C5    | CMP      | Zero Page       | 3      | X |   |   |   |   | X | X |
| $C6    | DEC      | Zero Page       | 5      | X |   |   |   |   | X |   |
| $C7    | DCP      | Zero Page       | 5      | X |   |   |   |   | X | X |
| $C8    | INY      | Implied         | 2      | X |   |   |   |   | X |   |
| $C9    | CMP      | Immediate       | 2      | X |   |   |   |   | X | X |
| $CA    | DEX      | Implied         | 2      | X |   |   |   |   | X |   |
| $CB    | SBX      | Immediate       | 2      | X |   |   |   |   | X | X |
| $CC    | CPY      | Absolute        | 4      | X |   |   |   |   | X | X |
| $CD    | CMP      | Absolute        | 4      | X |   |   |   |   | X | X |
| $CE    | DEC      | Absolute        | 6      | X |   |   |   |   | X |   |
| $CF    | DCP      | Absolute        | 6      | X |   |   |   |   | X | X |
| $D0    | BNE      | Relative        | 2*     |   |   |   |   |   |   |   |
| $D1    | CMP      | (Indirect),Y    | 5*     | X |   |   |   |   | X | X |
| $D2    | JAM      | Implied         | 1      |   |   |   |   |   |   |   |
| $D3    | DCP      | (Indirect),Y    | 8      | X |   |   |   |   | X | X |
| $D4    | NOP      | Zero Page,X     | 4      |   |   |   |   |   |   |   |
| $D5    | CMP      | Zero Page,X     | 4      | X |   |   |   |   | X | X |
| $D6    | DEC      | Zero Page,X     | 6      | X |   |   |   |   | X |   |
| $D7    | DCP      | Zero Page,X     | 6      | X |   |   |   |   | X | X |
| $D8    | CLD      | Implied         | 2      |   |   |   |   |   |   |   |
| $D9    | CMP      | Absolute,Y      | 4*     | X |   |   |   |   | X | X |
| $DA    | NOP      | Implied         | 2      |   |   |   |   |   |   |   |
| $DB    | DCP      | Absolute,Y      | 7      | X |   |   |   |   | X | X |
| $DC    | NOP      | Absolute,X      | 4*     |   |   |   |   |   |   |   |
| $DD    | CMP      | Absolute,X      | 4*     | X |   |   |   |   | X | X |
| $DE    | DEC      | Absolute,X      | 7      | X |   |   |   |   | X |   |
| $DF    | DCP      | Absolute,X      | 7      | X |   |   |   |   | X | X |

**Notes:**

- *Cycles marked with an asterisk (*) indicate an additional cycle if a page boundary is crossed.
- **Flag Effects:**
  - **N**: Negative
  - **V**: Overflow
  - **B**: Break
  - **D**: Decimal
  - **I**: Interrupt Disable
  - **Z**: Zero
  - **C**: Carry
  - "X" denotes the flag is affected by the instruction.

**Undocumented Opcodes:**

- **DCP**: Decrements the memory location by one and then compares the result with the accumulator. Affects the Negative, Zero, and Carry flags based on the comparison.
- **SBX**: ANDs the accumulator and X register, subtracts the immediate value, and stores the result in X. Affects the Negative, Zero, and Carry flags based on the result.
- **JAM**: Halts the CPU, effectively locking it up.

## Source Code

```text
Opcode matrix row (C0..DF):

C0  - CPY    #imm
C1  - CMP    (zp,X)
C2  - NOP    #imm
C3  - DCP    (zp,X)
C4  - CPY    zp
C5  - CMP    zp
C6  - DEC    zp
C7  - DCP    zp
C8  - INY
C9  - CMP    #imm
CA  - DEX
CB  - SBX    #imm
CC  - CPY    abs
CD  - CMP    abs
CE  - DEC    abs
CF  - DCP    abs
D0  - BNE    rel
D1  - CMP    (zp),Y
D2  - JAM
D3  - DCP    (zp),Y
D4  - NOP    zp,X
D5  - CMP    zp,X
D6  - DEC    zp,X
D7  - DCP    zp,X
D8  - CLD
D9  - CMP    abs,Y
DA  - NOP
DB  - DCP    abs,Y
DC  - NOP    abs,X
DD  - CMP    abs,X
DE  - DEC    abs,X
DF  - DCP    abs,X
```

## References

- "opcode_matrix_row_a0" — expands on previous opcode row (A0..BF) with LDX/LAX
- "opcode_matrix_row_e0" — expands on next opcode row (E0..FF) with INC/ISC/SBC
- "opcode_matrix_notes_and_labels" — expands on block labels and concluding note about variant grouping

## Mnemonics
- NOP
- DEC
- DEX
- DCP
- DCM
- SBX
- JAM
