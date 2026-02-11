# NMOS 6510 — Opcode matrix: layout conventions and unintended opcodes

**Summary:** Observations about the NMOS 6510/6502 opcode matrix layout, addressing-mode conventions, decoding exceptions (JSR, JMP (ind), 9C/9E non-working STY/STX variants), odd NOP #imm decoding, and the general rule that block D yields unintended combined operations (e.g., LAX, ANE). Searchable terms: opcode matrix, JSR, JMP (ind), NOP #imm, 9C, 9E, LAX, ANE, block D, SLO.

**Overview**

- **General rule:** Instructions in the same column of the opcode matrix mostly share the same addressing mode. Several documented exceptions break this convention:

  - **JSR and stack behavior:**
    - `JSR abs` (expected implied) — notable observation: opcodes $00, $20, $40, $60 are all decoded as "stack" operations.

  - **JMP indirect:**
    - `JMP (ind)` (expected abs) — the indirect mapping differs from what one would expect by column.

  - **Specific addressing-mode exceptions:**
    - `STX zp,y` and `LDX zp,y` (instructions that cannot be `zp,x` in these positions).
    - `SHX abs,y` and `LDX abs,y` (cannot be `abs,x`).
    - `SAX zp,y` and `LAX zp,y` (cannot be `zp,x`).
    - `SHA abs,y` and `LAX abs,y` (cannot be `abs,x`).

**Block behavior and peculiarities**

- **JAMs:**
  - All JAM opcodes decode to empty "stack" or "relative" instructions.

- **Blocks A, B, C:**
  - In blocks A, B, and C, unused opcodes turn into NOPs (except for JAMs) and use the expected addressing modes.
  - **Exceptions:** Opcodes $9C and $9E appear to be "non-working" `STY abs,x` and `STX abs,y` respectively (i.e., they do not behave as normal NOPs with the expected addressing mode).

- **Block B oddity:**
  - `NOP #imm` in block B decodes as "STA #imm" (an unexpected decoding which "makes no sense" as the source comments).

- **Block D general rule:**
  - All instructions in block D are unintended instructions. These combine (not necessarily all of) the sub-operations of:
    - The ALU operation at the same column/position, and
    - The RMW (read-modify-write) operation at the same row/position.
  - All unintended ops in block D share the same addressing mode as the corresponding ALU operation in the same column, with the four exceptions listed earlier.

- **Examples of combined unintended opcodes:**
  - `LAX #imm`: Combines `LDA #imm` with `TAX` (explains why LAX can act as load+transfer; source notes unstable behavior and a "magic constant" for some cases).
  - `ANE #imm`: Appears to combine "STA #imm" with `TXA` (the source notes this seems nonsensical at first but may contribute to combining the Accumulator, X register, and immediate value via ANDing).

- **Source observation:** Block D unintended opcodes often implement a subset of two normal instructions’ effects rather than a single canonical opcode — this explains many of the "weird" behaviors of unofficial opcodes.

## Source Code

```text
Unintended Opcodes
Overview
Opc.   imp    imm    zp    zpx   zpy   izx   izy   abs   abx   aby
SLO    $07    $17    $03   $13   $0F   $1F   $1B
```

## References

- "opcode_matrix" — full opcode matrix context (referenced by source)
- "types_intro" — explanation of how unintended opcodes combine sub-operations

## Mnemonics
- LAX
- ANE
- SLO
- SAX
- SHA
- NOP
