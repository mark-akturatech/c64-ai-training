# 6502: JMP / JSR and Load Instructions (LDA, LDX, LDY) — opcode map

**Summary:** Opcode-to-addressing-mode mapping for 6502 control-flow (JMP $4C, JSR $20) and load instructions LDA, LDX, LDY (immediate, zero page, zero-page,X, absolute, absolute,X, absolute,Y, (indirect,X), (indirect),Y). Also lists LSR opcodes ($46,$56,$4E,$5E) that appeared in the raw opcode set.

## JMP / JSR
JMP and JSR are the primary control-flow transfer instructions covered here.

- JMP absolute — opcode $4C (JMP addr)
- JSR absolute — opcode $20 (JSR addr)

(Indirect JMP $6C exists on 6502 but was not listed in the original opcode bytes provided.)

## Load instructions (LDA, LDX, LDY)
Standard 6502 load instructions and their common addressing-mode opcodes. The original raw bytes included a subset; the full canonical opcode mapping is listed here for completeness.

- LDA (Load Accumulator)
  - Immediate: A9 #imm
  - Zero Page: A5 addr
  - Zero Page,X: B5 addr
  - Absolute: AD addr
  - Absolute,X: BD addr
  - Absolute,Y: B9 addr
  - (Indirect,X): A1 addr
  - (Indirect),Y: B1 addr

- LDX (Load X register)
  - Immediate: A2 #imm
  - Zero Page: A6 addr
  - Zero Page,Y: B6 addr
  - Absolute: AE addr
  - Absolute,Y: BE addr

- LDY (Load Y register)
  - Immediate: A0 #imm
  - Zero Page: A4 addr
  - Zero Page,X: B4 addr
  - Absolute: AC addr
  - Absolute,X: BC addr

Notes:
- The raw byte list included many of the above (e.g., $A9, $A5, $B4, $AC, $BC, $A2, $A6, $A0, $A4). This page maps those bytes into their canonical addressing modes and completes the standard set for each load instruction.
- (Indirect,X) and (Indirect),Y forms for LDA are part of the standard LDA set even though their opcodes were not explicitly listed in the raw bytes.

## Source Code
```text
; Opcode map — mnemonic : addressing mode -> opcode (hex)

; Control flow
JMP abs        -> $4C    ; JMP addr
JSR abs        -> $20    ; JSR addr

; LDA
LDA immediate  -> $A9    ; LDA #imm
LDA zp         -> $A5    ; LDA addr
LDA zp,X       -> $B5    ; LDA addr,X
LDA abs        -> $AD    ; LDA addr
LDA abs,X      -> $BD    ; LDA addr,X
LDA abs,Y      -> $B9    ; LDA addr,Y
LDA (ind,X)    -> $A1    ; LDA (addr,X)
LDA (ind),Y    -> $B1    ; LDA (addr),Y

; LDX
LDX immediate  -> $A2    ; LDX #imm
LDX zp         -> $A6    ; LDX addr
LDX zp,Y       -> $B6    ; LDX addr,Y
LDX abs        -> $AE    ; LDX addr
LDX abs,Y      -> $BE    ; LDX addr,Y

; LDY
LDY immediate  -> $A0    ; LDY #imm
LDY zp         -> $A4    ; LDY addr
LDY zp,X       -> $B4    ; LDY addr,X
LDY abs        -> $AC    ; LDY addr
LDY abs,X      -> $BC    ; LDY addr,X

; Logical / shift opcodes that appeared in the raw byte list
LSR zp         -> $46    ; LSR addr
LSR zp,X       -> $56    ; LSR addr,X
LSR abs        -> $4E    ; LSR addr
LSR abs,X      -> $5E    ; LSR addr,X
```

## References
- "eor_inc_and_misc_arithmetic" — expands preceding arithmetic/opcode entries
- "logical_or_nop_and_related" — expands next block containing ORA, NOP and related opcodes

## Mnemonics
- JMP
- JSR
- LDA
- LDX
- LDY
- LSR
