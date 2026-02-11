# NMOS 6510 — Opcode matrix row $00..$1F (00-row, columns +02,+06,+0A,+0E,+12,+16,+1A,+1E and +03,+07,+0B,+0F,+13,+17,+1B,+1F)

**Summary:** NMOS 6510 opcode matrix row for $00-$1F showing legal ASL variants, single-byte NOP ($1A), illegal JAM lockups, and undocumented combined/illegal opcodes (SLO, ANC) with their addressing modes (accumulator, zp, abs, zp,x, abs,x, #imm, (zp,x), (zp),y, abs,y, abs,x).

## Overview
This chunk lists the mnemonics found in the 00-row of the NMOS 6510 opcode matrix for the specified column offsets. It includes:
- Legal instructions: ASL (Accumulator, Zero Page, Absolute, ZP,X, ABS,X) and the one-byte NOP at $1A (immediate-format unofficial NOP).
- Illegal/undocumented instructions: JAM (illegal lockup), SLO, ANC and their addressing modes as shown.
- The table covers only the columns explicitly listed (+02,+06,+0A,+0E,+12,+16,+1A,+1E and +03,+07,+0B,+0F,+13,+17,+1B,+1F); other offsets in $00-$1F are not provided here.

Short notes:
- JAM — illegal lockup (CPU hung / opcode causes freeze)
- SLO — undocumented opcode combining ASL then ORA (accumulator affected)

Explicit opcode bytes from the provided columns (base row = $00):
- $02 — JAM
- $06 — ASL (zp)
- $0A — ASL (accumulator)
- $0E — ASL (abs)
- $12 — JAM
- $16 — ASL (zp,X)
- $1A — NOP (#imm)  ; unofficial single-byte NOP
- $1E — ASL (abs,X)

- $03 — SLO ((zp,X))
- $07 — SLO (zp)
- $0B — ANC (#imm)  ; undocumented/combined opcode
- $0F — SLO (abs)
- $13 — SLO ((zp),Y)
- $17 — SLO (zp,X)
- $1B — SLO (abs,Y)
- $1F — SLO (abs,X)

## Source Code
```text
+02 +06 +0A +0E +12 +16 +1A +1E +03 +07 +0B +0F +13 +17 +1B +1F
00

JAM

ASL
zp

ASL

ASL
abs

JAM

ASL
zp,x

NOP

ASL
abs,x

SLO
(zp,x)

SLO
zp

ANC
#imm

SLO
abs

SLO
(zp),y

SLO
zp,x

SLO
abs,y

SLO
abs,x
```

## References
- "opcode_matrix_row_20" — expands the next opcode row (20..3F) with ROL/RLA variants
- "opcode_matrix_notes_and_labels" — expands block labels and concluding notes about variant grouping

## Mnemonics
- ASL
- NOP
- SLO
- ASO
- ANC
- ANC2
