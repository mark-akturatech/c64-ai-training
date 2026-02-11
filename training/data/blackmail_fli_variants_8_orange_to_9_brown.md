# NMOS 6510 — Opcode variants 8 (orange) and 9 (brown): 10-cycle tail using STY/STA $D021 with NOP padding

**Summary:** Two NMOS 6510 opcode-tail variants (8 and 9) that produce a 10-cycle tail by writing to VIC-II border color $D021 (STY/STA $D021), using TAY+LDY# / LDA# sequences and NOP padding to select the open-bus opcode-driven border colour. Includes opcode bytes, per-instruction cycle counts, and original page marker.

## Description
This chunk documents two opcode variants (numbered 8 and 9 in the original listing) used to force a 10-cycle tail while writing the VIC-II border colour ($D021). The technique places the colour value in a register or accumulator, performs an absolute store to $D021, and then pads with NOPs so the sequence totals 10 cycles. The opcode byte placed immediately after the preceding $D011 store (not shown here) is used to select the open-bus colour. Both sequences are self-contained tails suitable for timing-sensitive raster effects.

Variant 8 (labelled "orange as colour ram colour")
- Uses TAY to transfer A into Y, then LDY #<background colour>, then STY $D021.
- Instruction cycle counts: TAY (2), LDY immediate (2), STY absolute (4), NOP (2) -> total 10 cycles.
- Opcode bytes: A8, A0 bb, 8C 21 D0, EA
- Typical use: colour value supplied in the immediate of LDY; one NOP follows the store to pad to 10 cycles.

Variant 9 (labelled "brown as colour ram colour")
- Uses LDA #<background colour>, then STA $D021.
- Instruction cycle counts: LDA immediate (2), STA absolute (4), NOP (2), NOP (2) -> total 10 cycles.
- Opcode bytes: A9 bb, 8D 21 D0, EA, EA
- Two NOPs follow the STA to reach the 10-cycle tail.

Notes
- All cycle counts are standard NMOS 6502/6510 values for the listed addressing modes.
- Colour selection here denotes which colour value (orange / brown) is supplied in the immediate operand (bb) or via transfer to Y.
- The technique depends on the opcode placed immediately after a prior $D011 store: that opcode on the open bus influences final visual result (see related variants in References).

- 103 -

## Source Code
```asm
; Variant 8 — "orange as colour ram colour"
; bytes / cycles:
; (2) A8           ; TAY
; (2) A0 bb        ; LDY #<bg>         ; bb = background colour immediate
; (4) 8C 21 D0     ; STY $D021         ; write border colour
; (2) EA           ; NOP               ; padding -> total 10 cycles
; assembled byte sequence: A8 A0 bb 8C 21 D0 EA

; Variant 9 — "brown as colour ram colour"
; bytes / cycles:
; (2) A9 bb        ; LDA #<bg>         ; bb = background colour immediate
; (4) 8D 21 D0     ; STA $D021         ; write border colour
; (2) EA           ; NOP
; (2) EA           ; NOP               ; padding -> total 10 cycles
; assembled byte sequence: A9 bb 8D 21 D0 EA EA

; Original listing spacing / page marker preserved:
; - 103 -
```

## Key Registers
- $D021 - VIC-II - Border color (store target)
- $D011 - VIC-II - Control register 1 (referenced in surrounding technique; store prior to open-bus selection)

## References
- "blackmail_fli_variants_4_violet_to_7_yellow" — expands on previous variants 4–7 (violet through yellow)
- "blackmail_fli_variants_a_lred_to_b_dgrey" — expands on next variants a and b (register transfers and immediate LAX)

## Labels
- $D021
- $D011

## Mnemonics
- TAY
- LDY
- STY
- NOP
- LDA
- STA
