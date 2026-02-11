# 6502 — Status flag change instructions (implied, 1 byte)

**Summary:** 6502 implied addressing instructions that set or clear individual processor status flags (C, D, I, V). Each opcode is 1 byte: CLC $18, SEC $38, CLI $58, SEI $78, CLV $B8, CLD $D8, SED $F8.

## Description
Seven 6502 instructions use implied addressing and occupy one byte each. Each instruction changes exactly one processor status flag (listed below). They do not have operand bytes.

Mapping (mnemonic — opcode — affected flag):
- CLC — $18 — C (carry) cleared
- SEC — $38 — C (carry) set
- CLI — $58 — I (interrupt disable) cleared
- SEI — $78 — I (interrupt disable) set
- CLV — $B8 — V (overflow) cleared
- CLD — $D8 — D (decimal) cleared
- SED — $F8 — D (decimal) set

## Source Code
```asm
; 6502 Instructions summary - Status flag change instructions (implied addressing, 1 byte each):
; CLC (Clear carry)     Implied   CLC  $18  1  C
; CLD (Clear decimal)   Implied   CLD  $D8  1  D
; CLI (Clear interrupt) Implied   CLI  $58  1  I
; CLV (Clear overflow)  Implied   CLV  $B8  1  V
; SEC (Set carry)       Implied   SEC  $38  1  C
; SED (Set decimal)     Implied   SED  $F8  1  D
; SEI (Set interrupt)   Implied   SEI  $78  1  I

CLC	Clear carry flag	Implied	CLC	$18	1	C
CLD	Clear decimal mode flag	Implied	CLD	$D8	1	D
CLI	Clear interrupt disable flag	Implied	CLI	$58	1	I
CLV	Clear overflow flag	Implied	CLV	$B8	1	V
SEC	Set carry flag	Implied	SEC	$38	1	C
SED	Set decimal mode flag	Implied	SED	$F8	1	D
SEI	Set interrupt disable flag	Implied	SEI	$78	1	I
```

## References
- "branch_instructions" — expands on SEI/CLI effects on interrupt-driven branching and IRQ behavior

## Mnemonics
- CLC
- SEC
- CLI
- SEI
- CLV
- CLD
- SED
