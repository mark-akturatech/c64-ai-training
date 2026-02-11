# NMOS 6510 - Opcode Matrix Row A0..BF

**Summary:** This section details the NMOS 6510 opcodes for the range $A0 to $BF, encompassing both documented and undocumented instructions. It includes load and transfer operations such as LDX, TAX, TSX, and LDY, as well as undocumented opcodes like LAX and LAS across various addressing modes. Additionally, it covers the BCS (Branch on Carry Set) instruction and its associated addressing mode.

**Opcode Row Overview**

This section provides a sequential mapping of opcodes from $A0 through $BF. It lists both documented instructions (LDX, TAX, TSX, LDY, BCS) and undocumented ones (LAX, LAS) across multiple addressing modes. The opcodes are presented with their hexadecimal values, mnemonics, addressing modes, and cycle counts.

## Source Code

```text
$A0  LDY  #imm    ; 2 cycles
$A1  LAX  (zp,x)  ; 6 cycles
$A2  LDX  #imm    ; 2 cycles
$A3  LAX  #imm    ; 2 cycles
$A4  LDY  zp      ; 3 cycles
$A5  LDA  zp      ; 3 cycles
$A6  LDX  zp      ; 3 cycles
$A7  LAX  zp      ; 3 cycles
$A8  TAY          ; 2 cycles
$A9  LDA  #imm    ; 2 cycles
$AA  TAX          ; 2 cycles
$AB  LAX  #imm    ; 2 cycles
$AC  LDY  abs     ; 4 cycles
$AD  LDA  abs     ; 4 cycles
$AE  LDX  abs     ; 4 cycles
$AF  LAX  abs     ; 4 cycles
$B0  BCS  rel     ; 2 cycles (+1 if branch taken, +1 if page crossed)
$B1  LAX  (zp),y  ; 5 cycles (+1 if page crossed)
$B2  KIL          ; 1 cycle (illegal opcode)
$B3  LAX  (zp),y  ; 5 cycles (+1 if page crossed)
$B4  LDY  zp,x    ; 4 cycles
$B5  LDA  zp,x    ; 4 cycles
$B6  LDX  zp,y    ; 4 cycles
$B7  LAX  zp,y    ; 4 cycles
$B8  CLV          ; 2 cycles
$B9  LDA  abs,y   ; 4 cycles (+1 if page crossed)
$BA  TSX          ; 2 cycles
$BB  LAS  abs,y   ; 4 cycles (+1 if page crossed)
$BC  LDY  abs,x   ; 4 cycles (+1 if page crossed)
$BD  LDA  abs,x   ; 4 cycles (+1 if page crossed)
$BE  LDX  abs,y   ; 4 cycles (+1 if page crossed)
$BF  LAX  abs,y   ; 4 cycles (+1 if page crossed)
```

## Key Registers

- **Accumulator (A):** Used in LDA, LAX, LAS instructions.
- **X Register (X):** Used in LDX, TAX, TSX instructions.
- **Y Register (Y):** Used in LDY, TAY instructions.
- **Program Counter (PC):** Used in BCS instruction for branching.
- **Stack Pointer (SP):** Used in TSX instruction.
- **Processor Status Register (P):** Affected by various instructions, notably BCS (Carry Flag) and CLV (Overflow Flag).

## References

- "opcode_matrix_row_80" — expands on previous opcode row (80..9F) with store/transfer variants
- "opcode_matrix_row_c0" — expands on next opcode row (C0..DF) with DEC/DEX/DCP/SBX
- "opcode_matrix_notes_and_labels" — expands on block labels and concluding note about variant grouping

*Note: The cycle counts and addressing modes are sourced from authoritative references on the 6510 processor's instruction set.*

## Mnemonics
- LDY
- LAX
- LDX
- TAX
- TAY
- LDA
- BCS
- KIL
- CLV
- TSX
- LAS
