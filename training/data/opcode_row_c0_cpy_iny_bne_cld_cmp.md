# NMOS 6510 — Opcode row 0xC0

**Summary:** Opcode decode row for base 0xC0 on NMOS 6510 / 6502: CPY (immediate, zero page, absolute), INY, BNE (relative), CLD, NOP placeholders, and the CMP family across addressing modes ((zp,X), zp, #imm, abs, (zp),Y, zp,X, abs,Y, abs,X). CPY compares Y, CMP compares A (both set N/Z/C).

**Description**
This chunk documents the 16-entry opcode decode row whose base opcode is 0xC0 (range 0xC0..0xCF). The row groups CPY variants for Y, the INY (increment Y) and CLD (clear decimal) control opcodes, a BNE relative branch, two NOP placeholder slots, and a full set of CMP (compare accumulator) addressing-mode variants.

- Order corresponds to sequential opcodes starting at base 0xC0.
- CPY and CMP are compare instructions: CPY compares the Y register, CMP compares the A register (both affect Negative, Zero and Carry flags).
- NOP entries in this row are listed as placeholders (these may be official single-byte NOPs or undocumented/illegal opcodes depending on implementation and variant; source does not specify).

## Source Code
```text
Base: C0

C0  CPY    #imm
C1  CMP    (zp,X)
C2  NOP    (undocumented)
C3  DCP    (zp,X) (undocumented)
C4  CPY    zp
C5  CMP    zp
C6  DEC    zp
C7  DCP    zp (undocumented)

C8  INY
C9  CMP    #imm
CA  DEX
CB  AXS    #imm (undocumented)
CC  CPY    abs
CD  CMP    abs
CE  DEC    abs
CF  DCP    abs (undocumented)
```

## References
- "opcode_row_00_brk_php_bpl_ora" — BRK / PHP / BPL / ORA group (base 0x00)
- "opcode_row_20_jsr_plp_bit_and" — JSR / PLP / BIT / AND group (base 0x20)
- "opcode_row_40_rti_pha_jmp_bvc_eor" — RTI / PHA / JMP / EOR group (base 0x40)
- "opcode_row_60_rts_pla_jmpind_bvs_adc" — RTS / PLA / JMP (ind) / ADC group (base 0x60)
- "opcode_row_80_nop_sty_dey_tya_shy_sta" — NOP / STY / STA group (base 0x80)
- "opcode_row_a0_ldy_tay_bcs_clv_lday_lda" — LDY / TAY / LDA group (base 0xA0)
- "opcode_row_e0_cpx_sbc" — CPX / INX / SBC group (base 0xE0)

## Mnemonics
- CPY
- CMP
- NOP
- DCP
- DEC
- INY
- DEX
- AXS
