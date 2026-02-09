# NMOS 6510 - Detailed code sequences for variants a and b

**Summary:** Two 10-cycle tail code sequences for NMOS 6510: variant a uses TAX / LDX #imm / STX $D021 (legal opcodes); variant b uses undocumented LAX #imm (AB) + SAX $D021 (8F) with NOP padding. Includes opcode bytes, per-instruction cycle counts, and the fix (use A=$0F,$1F...$7F) to make LAX #imm work for all 16 colours. Mentions $D011 interaction and the 10-cycle timing requirement.

## Description
This chunk documents two compact sequences that meet a 10-cycle "tail" requirement by loading a colour into the CPU registers and writing it to VIC-II border ($D021). Both sequences produce the same overall timing (10 cycles) but use different instruction sets:

- Variant a (light red colour): uses only documented/legal opcodes.
  - Sequence: TAX ; LDX #<bg> ; STX $D021 ; NOP
  - Cycles: 2 + 2 + 4 + 2 = 10 cycles.

- Variant b (dark grey colour): uses undocumented opcodes to combine loads and stores into shorter instruction counts.
  - Sequence: LAX #<bg> ; SAX $D021 ; NOP ; NOP
  - Cycles: 2 + 4 + 2 + 2 = 10 cycles.
  - Note: LAX #imm (opcode $AB) loads the immediate into both A and X (undocumented). SAX (opcode $8F absolute) stores A AND X into memory (undocumented).
  - The original implementation relied on values A=$08,$18...$78, which interacted with bits of a previously written "magic constant" (values written to $D011). Changing the immediate values to A=$0F,$1F...$7F removes dependence on those bits and makes the LAX #imm method reliable across all 16 colours.

The code below shows opcode bytes and explicit NOP padding used to meet the exact 10-cycle requirement.

## Source Code
```asm
; Variant a: light red as colour RAM colour
; cycles: (2) TAX  (2) LDX #<bg>  (4) STX $D021  (2) NOP  => total 10
(2)  AA           TAX
(2)  A2 xx        LDX #<background colour>
(4)  8E 21 D0     STX $D021
(2)  EA           NOP

; Variant b: dark grey as colour RAM colour
; cycles: (2) LAX #<bg>  (4) SAX $D021  (2) NOP  (2) NOP  => total 10
(2)  AB xx        LAX #<background colour>    ; original used A=$08,$18...$78
                                          ; fix: use A=$0F,$1F...$7F so LAX#imm works
(4)  8F 21 D0     SAX $D021
(2)  EA           NOP
(2)  EA           NOP
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register range (includes $D011 and $D021)
- $D011 - VIC-II - control register 1 (raster high / horizontal scroll) (mentioned)
- $D021 - VIC-II - border colour (written by these sequences)

## References
- "blackmail_fli_variants_8_orange_to_9_brown" — expands on Previous variants 8-9 (orange, brown)
- "blackmail_fli_variants_c_mgrey_to_f_lgrey" — expands on Following variants c-f which use absolute addressing for background table lookups