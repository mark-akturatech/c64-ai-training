# NMOS 6510 — Blackmail FLI per-nibble variants c–f (absolute fetch → $D021)

**Summary:** Four per-nibble code tails (variants c–f) used in the Blackmail FLI trick that load a background-colour byte from an absolute address ($03B0 + <background colour>) and write it to $D021 (VIC-II border). Shows opcode bytes, addressing form, and cycle counts for LDY/LDX/LDA/LAX loads and STY/STX/STA/SAX stores followed by NOP padding.

## Description
This chunk enumerates four absolute-addressing variants that complete the per-nibble tails (c–f) used in the Blackmail FLI. Each tail:

- Loads a byte from an absolute address whose high byte is $03 and low byte is $B0 plus the 4-bit background colour index: address = $03B0 + <background colour>.
- Writes that byte to $D021 (VIC-II border color register).
- Executes a single NOP (2 cycles) as padding.

Variants:
- c — mid-grey: LDY abs; STY $D021; NOP. (LDY loads Y from absolute memory, STY stores Y into $D021.)
- d — light green: LDA abs; STA $D021; NOP.
- e — light blue: LDX abs; STX $D021; NOP.
- f — light grey: LAX abs; SAX $D021; NOP. (LAX and SAX are unofficial/illegal opcodes: LAX loads A and X; SAX stores A & X.)

Cycle counts per instruction as used here: load abs (4), store abs to $D021 (4), NOP (2) — total 10 cycles per tail. The absolute operand bytes are little-endian (low byte first, high byte $03).

## Source Code
```asm
; Variant c: mid-grey as colour-ram colour
; (4)  AC xx 03      LDY $03xx       ; low byte = $B0 + <bg colour>
; (4)  8C 21 D0      STY $D021       ; write to VIC-II border
; (2)  EA            NOP
; ; $03B0 + <background colour>

; Variant d: light green as colour-ram colour
; (4)  AD xx 03      LDA $03xx
; (4)  8D 21 D0      STA $D021
; (2)  EA            NOP
; ; $03B0 + <background colour>

; Variant e: light blue as colour-ram colour
; (4)  AE xx 03      LDX $03xx
; (4)  8E 21 D0      STX $D021
; (2)  EA            NOP
; ; $03B0 + <background colour>

; Variant f: light grey as colour-ram colour
; (4)  AF xx 03      LAX $03xx       ; unofficial opcode: load A and X
; (4)  8F 21 D0      SAX $D021       ; unofficial opcode: store A & X
; (2)  EA            NOP
; ; $03B0 + <background colour>
```

## Key Registers
- $D021 - VIC-II - Border colour register (written by STA/ STX/ STY/ SAX)
- $03B0-$03BF - RAM range (data table): background-colour bytes indexed by nibble (absolute loads use $03B0 + <background colour>)

## References
- "blackmail_fli_variants_a_lred_to_b_dgrey" — expands on variants a–b and the LAX#imm note/fix
- "blackmail_fli_overview_and_common_prologue" — overview and common prologue preceding these per-opcode tails

## Mnemonics
- LDY
- STY
- LDA
- STA
- LDX
- STX
- LAX
- SAX
- NOP
