# Opcode row — base 0x00 (NMOS 6510 / 6502)

**Summary:** Opcode decode row for base 0x00 (opcodes $00–$1F) showing BRK, PHP, BPL, CLC, the ORA family across addressing modes, and several official/undocumented NOP variants used as fillers (zero page, absolute, zp,X, abs,X).

## Description
This chunk documents the 6502 / NMOS 6510 opcode row whose base is 0x00 (covering opcodes $00 through $1F). The row splits into two interleaved groups:

- Even offsets ($00, $04, $08, $0C, $10, $14, $18, $1C) contain BRK, the PHP/PLP pair (PHP appears in this row), BPL (relative), CLC, and multiple NOP variants used as fillers (zero-page, absolute, zp,X and abs,X variants). Many of those NOPs are undocumented single-byte or multi-byte operations often used as fillers in opcode tables.
- Odd offsets ($01, $05, $09, $0D, $11, $15, $19, $1D) are the ORA family across the canonical addressing modes: (zp,X), zp, #immediate, abs, (zp),Y, zp,X, abs,Y, abs,X.

This row therefore groups a control/flag-manipulation and branch cluster on even opcodes, and the bitwise OR accumulator instruction (ORA) across all its addressing modes on odd opcodes. PHP is shown here (0x08); the complementary PLP exists elsewhere in the full opcode map. The NOP entries listed are placeholders/fillers and include both official NOP ($EA is the canonical official NOP, not in this row) and undocumented variants (zero page/absolute variants shown in the table below).

## Source Code
```text
Header columns:
+00  +04  +08  +0C  +10  +14  +18  +1C   +01  +05  +09  +0D  +11  +15  +19  +1D
Base row (0x00):
$00  $04  $08  $0C  $10  $14  $18  $1C    $01  $05  $09  $0D  $11  $15  $19  $1D

Mapping (opcodes $00-$1F):
$00  BRK
$04  NOP (zero page)            ; undocumented NOP variant used as filler
$08  PHP
$0C  NOP (absolute)             ; undocumented NOP variant
$10  BPL (relative)
$14  NOP (zp,X)                 ; undocumented NOP variant
$18  CLC
$1C  NOP (abs,X)                ; undocumented NOP variant

$01  ORA (zp,X)
$05  ORA zp
$09  ORA #immediate
$0D  ORA absolute
$11  ORA (zp),Y
$15  ORA zp,X
$19  ORA abs,Y
$1D  ORA abs,X
```

## References
- "opcode_row_20_jsr_bit_and" — expands on JSR / BIT / PLP / AND group (base 0x20)
- "opcode_row_40_rti_jmp_eor" — expands on RTI / JMP / EOR group (base 0x40)
- "opcode_row_60_rts_jmpind_adc" — expands on RTS / JMP (indirect) / ADC group (base 0x60)
- "opcode_row_80_nop_sty_sta" — expands on NOP / STY / STA group (base 0x80)
- "opcode_row_a0_ldy_tya_lda" — expands on LDY / TAY / LDA group (base 0xA0)
- "opcode_row_c0_cpy_cmp" — expands on CPY / INY / CMP group (base 0xC0)
- "opcode_row_e0_cpx_sbc" — expands on CPX / INX / SBC group (base 0xE0)

## Mnemonics
- BRK
- PHP
- BPL
- CLC
- ORA
- NOP
