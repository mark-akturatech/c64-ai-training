# NMOS 6510 — Opcode variants 0..3: 10-cycle tails to set colour and $D021 background

**Summary:** Ten-cycle tail code sequences for NMOS 6510 opcode variants 0–3 that set a colour fetched into colour-ram for the first 3 screen columns and write the background colour to $D021 (VIC-II). Includes exact opcodes, cycle counts, and the arithmetic comments showing how the fetched value is derived; uses A* row load opcodes to control the open-bus colour fetch.

## Description
This chunk contains four 10-cycle opcode-tail variants that follow a common prologue (see referenced chunk). Each variant intentionally uses an A* row load opcode (LDA/LAX/LDX/LDY) or stores immediate register values to create a controlled open-bus read that yields a colour value for colour-ram; the tails then write a background colour to $D021 (VIC-II background colour). Cycle counts are provided for each instruction in the sequence.

- Variant 0 (black): uses LDY #<bg> then STY $D021, with two NOPs to form a 10-cycle tail.
- Variant 1 (white): uses LDA (zp,X) to perform an open-bus colour fetch (commented arithmetic) then STA $D021.
- Variant 2 (red): uses LDX #<bg> then STX $D021, with two NOPs.
- Variant 3 (cyan): uses LAX (zp,X) to perform the open-bus colour fetch (same arithmetic comment) then SAX $D021.

The arithmetic comment for the fetched colour (used in variants 1 and 3) is preserved exactly:
- ((background colour << 1) + $59) - ((line & 7) | $b8)

(“open-bus” here: reading the data bus without a defined memory source to obtain the last valid bus value.)

## Source Code
```asm
; Variant 0: black as colour ram colour
; (2) a0 xx
ldy # <background colour>

; (4) 8c 21 d0
sty $d021

; (2) ea
nop

; (2) ea
nop


; Variant 1: white as colour ram colour
; (6) a1 xx
lda (zp,x)

; ((background colour << 1) + $59)
; - ((line & 7) | $b8)

; (4) 8d 21 d0
sta $d021


; Variant 2: red as colour ram colour
; (2) a2 xx
ldx # <background colour>

; (4) 8e 21 d0
stx $d021

; (2) ea
nop

; (2) ea
nop


; Variant 3: cyan as colour ram colour
; (6) a3 xx
lax (zp,x)

; ((background colour << 1) + $59)
; - ((line & 7) | $b8)

; (4) 8f 21 d0
sax $d021
```

## Key Registers
- $D021 - VIC-II - Background colour register

## References
- "blackmail_fli_overview_and_common_prologue" — Overview and common prologue that precede these 10-cycle opcode variants
- "blackmail_fli_variants_4_violet_to_7_yellow" — Next set of opcode variants (4–7) continuing the per-nibble organisation

## Mnemonics
- LAX
- SAX
