# NMOS 6510 — Opcode Matrix Row $20–$3F

**Summary:** This section details the NMOS 6510 opcodes from $20 to $3F, including both official and undocumented instructions. It provides opcode mnemonics, addressing modes, byte lengths, cycle counts, and operational semantics.

**Opcode Row Overview**

This chunk covers the 32 sequential opcodes from $20 to $3F. Entries include:

- **JSR** — Jump to Subroutine.
- **AND** — Logical AND with Accumulator.
- **ROL** — Rotate Left.
- **BIT** — Test Bits.
- **PLP** — Pull Processor Status from Stack.
- **SEC** — Set Carry Flag.
- **BMI** — Branch if Minus.
- **JAM** — Illegal instruction that locks the CPU (halt).
- **RLA** — Undocumented opcode combining ROL and AND operations.
- **ANC** — Undocumented opcode combining AND operation with setting Carry flag based on bit 7 of the result.
- **NOP** — No Operation.

Addressing-mode shorthand used below:

- **(zp,x)** — Zero Page Indexed Indirect.
- **zp** — Zero Page.
- **#imm** — Immediate.
- **abs** — Absolute.
- **(zp),y** — Zero Page Indirect Indexed.
- **zp,x** — Zero Page Indexed by X.
- **abs,y** — Absolute Indexed by Y.
- **abs,x** — Absolute Indexed by X.

Note: Undocumented opcodes are marked with an asterisk (*) and are not officially supported.

## Source Code

```text
Opcode matrix entries for $20–$3F:

$20  JSR abs       ; 3 bytes, 6 cycles
$21  AND (zp,x)    ; 2 bytes, 6 cycles
$22  JAM           ; 1 byte, locks CPU
$23  RLA (zp,x)*   ; 2 bytes, 8 cycles
$24  BIT zp        ; 2 bytes, 3 cycles
$25  AND zp        ; 2 bytes, 3 cycles
$26  ROL zp        ; 2 bytes, 5 cycles
$27  RLA zp*       ; 2 bytes, 5 cycles
$28  PLP           ; 1 byte, 4 cycles
$29  AND #imm      ; 2 bytes, 2 cycles
$2A  ROL A         ; 1 byte, 2 cycles
$2B  ANC #imm*     ; 2 bytes, 2 cycles
$2C  BIT abs       ; 3 bytes, 4 cycles
$2D  AND abs       ; 3 bytes, 4 cycles
$2E  ROL abs       ; 3 bytes, 6 cycles
$2F  RLA abs*      ; 3 bytes, 6 cycles
$30  BMI rel       ; 2 bytes, 2 cycles (+1 if branch taken, +1 if page crossed)
$31  AND (zp),y    ; 2 bytes, 5 cycles (+1 if page crossed)
$32  JAM           ; 1 byte, locks CPU
$33  RLA (zp),y*   ; 2 bytes, 8 cycles
$34  NOP zp,x*     ; 2 bytes, 4 cycles
$35  AND zp,x      ; 2 bytes, 4 cycles
$36  ROL zp,x      ; 2 bytes, 6 cycles
$37  RLA zp,x*     ; 2 bytes, 6 cycles
$38  SEC           ; 1 byte, 2 cycles
$39  AND abs,y     ; 3 bytes, 4 cycles (+1 if page crossed)
$3A  NOP*          ; 1 byte, 2 cycles
$3B  RLA abs,y*    ; 3 bytes, 7 cycles
$3C  NOP abs,x*    ; 3 bytes, 4 cycles (+1 if page crossed)
$3D  AND abs,x     ; 3 bytes, 4 cycles (+1 if page crossed)
$3E  ROL abs,x     ; 3 bytes, 7 cycles
$3F  RLA abs,x*    ; 3 bytes, 7 cycles
```

**Operational Semantics**

- **RLA (Rotate Left and AND) [Undocumented]:** Performs a ROL operation on the memory location, then ANDs the result with the Accumulator.
  - Memory ← (Memory << 1) + Carry
  - Accumulator ← Accumulator AND Memory
  - Flags affected: N, Z, C

- **ANC (AND with Carry) [Undocumented]:** Performs an AND operation between the Accumulator and an immediate value, then sets the Carry flag to the value of bit 7 of the result.
  - Accumulator ← Accumulator AND Immediate
  - Carry ← Bit 7 of Accumulator
  - Flags affected: N, Z, C

- **JAM (Illegal Opcode):** Halts the CPU, requiring a reset to recover.

## Key Registers

- **Accumulator (A):** Used in AND, ROL, RLA, and ANC operations.
- **Program Counter (PC):** Affected by JSR, BMI, and JAM instructions.
- **Processor Status Register (P):** Flags affected include Negative (N), Zero (Z), and Carry (C).

## References

- "opcode_matrix_row_00" — expands on previous opcode row ($00–$1F) with ASL/SLO/ANC
- "opcode_matrix_row_40" — expands on next opcode row ($40–$5F) with LSR/SRE/ALR
- "opcode_matrix_notes_and_labels" — expands on block labels and concluding note about variant grouping

*Note: Undocumented opcodes are not officially supported and may behave differently on various hardware implementations.*

## Mnemonics
- JSR
- AND
- ROL
- BIT
- PLP
- SEC
- BMI
- JAM
- RLA
- ANC
- NOP
