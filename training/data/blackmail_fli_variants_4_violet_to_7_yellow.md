# NMOS 6510 — Opcode variants 4..7: force colour-ram fetch opcodes and write background colour to $D021

**Summary:** Assembly sequences for NMOS 6510 opcode variants 4..7 (A4/A5/A6/A7) using zero-page loads and absolute STY/STA/STX/SAX to write $D021 (VIC-II border colour), with an extra BIT $24 used to force the desired open-bus value for the VIC-II colour fetch. Includes opcode bytes, addressing modes (zero-page/absolute), cycle counts, and the computed open-bus value comment (<(background colour << 1) + $59>).

## Sequences and intent
These four sequences use zero-page loads from the A* row opcodes (A4/A5/A6/A7 variants) followed immediately by an absolute store to $D021 to set the border/background colour, and a BIT $24 instruction to shape the open-bus value fetched by the VIC-II during its colour-ram access. Each listing shows the opcode bytes and the implied cycle counts in parentheses. The goal is to place a specific value on the CPU open bus (controlled by the last A* load) so that when the VIC-II samples the bus during its colour RAM fetch, it sees the intended opcode/value.

- Variant 4 (violet): LDY zp followed by STY $D021, then BIT $24. Uses A4 zp.
- Variant 5 (green): LDA zp followed by STA $D021, then BIT $24. Uses A5 zp.
- Variant 6 (blue): LDX zp followed by STX $D021, then BIT $24. Uses A6 zp.
- Variant 7 (yellow): LAX zp (undocumented LAX = LDA+LDX) followed by SAX $D021 (undocumented SAX = A & X store), then BIT $24. Uses A7 zp / 8F abs.

Cycle counts in the source are shown as (3)/(4)/(3) etc and correspond to the individual instructions as noted in the Source Code block. The comment "<(background colour << 1) + $59>" is preserved from the source and denotes the computed value expected on the bus for the VIC-II colour fetch.

Do not assume additional timings, raster alignment, or exact VIC-II sampling cycle; this chunk documents the opcode sequences and bytes only.

## Source Code
```asm
; 4: violet as colour ram colour
(3) a4 xx
ldy zp

(4) 8c 21 d0
sty $d021

(3) 24 24
bit $24

; <(background colour << 1) + $59>

; 5: green as colour ram colour
(3) a5 xx
lda zp

(4) 8d 21 d0
sta $d021

(3) 24 24
bit $24

; <(background colour << 1) + $59>

; 6: blue as colour ram colour
(3) a6 xx
ldx zp

(4) 8e 21 d0
stx $d021

(3) 24 24
bit $24

; <(background colour << 1) + $59>

; 7: yellow as colour ram colour
(3) a7 xx
lax zp

(4) 8f 21 d0
sax $d021

(3) 24 24
bit $24

; <(background colour << 1) + $59>
```

## Key Registers
- $D021 - VIC-II - border colour register (border/background colour)

## References
- "blackmail_fli_variants_0_black_to_3_cyan" — expands on opcode variants 0–3 (black through cyan) with the same structure
- "blackmail_fli_variants_8_orange_to_9_brown" — expands on variants 8–9 which switch addressing/loads but retain the same pattern

## Mnemonics
- LDY
- STY
- LDA
- STA
- LDX
- STX
- BIT
- LAX
- SAX
