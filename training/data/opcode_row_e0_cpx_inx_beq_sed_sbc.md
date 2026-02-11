# NMOS 6510 — Opcode decode row 0xE0 (E0–EF)

**Summary:** Opcode row 0xE0 (E0–EF) on the NMOS 6510/6502 contains the CPX family (immediate/zero-page/absolute), the INX instruction, several official SBC (Subtract with Carry) opcodes across addressing modes ((zp,X), zp, #imm, abs, (zp),y, zp,X, abs,Y, abs,X), plus official and undocumented NOP / illegal opcodes commonly encountered on the E-row.

**Description**
This chunk documents the 16 opcodes at addresses $E0–$EF on a NMOS 6510 (6502-core). The row groups:

- **CPX (Compare X register):** Immediate ($E0), zero page ($E4), absolute ($EC). Affects N, Z, C flags.
- **INX (Increment X):** Implied ($E8). Affects N, Z flags.
- **SBC (Subtract with Carry):** Official opcodes distributed across the row:
  - (Indirect,X) addressing: $E1
  - Zero page: $E5
  - Immediate: $E9
  - Absolute: $ED
  - Absolute,X: $FD
  - Absolute,Y: $F9
  - Zero page,X: $F5
  - (Indirect),Y: $F1
- **INC (Increment memory):** Zero page ($E6), absolute ($EE). Affects N, Z flags.
- **Undocumented opcodes:**
  - **ISC (ISB):** Combines INC and SBC. Appears in (Indirect,X) ($E3), zero page ($E7), absolute ($EF) addressing modes.
  - **NOP (SKB):** Immediate ($E2). Affects no flags.

Behavioral notes:
- **CPX:** Performs (X - operand), sets Carry if X ≥ operand, sets Zero if equal, sets Negative from bit 7 of result.
- **SBC:** Performs A := A - operand - (1 - C) with two's-complement arithmetic; affects N, V (overflow), Z, C.
- **INX:** Increments X and sets N, Z (does not affect C).
- **INC:** Increments memory (affects N, Z only).
- **ISC (ISB):** Undocumented; performs an INC on memory then SBC with that memory. Affects N, V, Z, C.

## Source Code
```text
Opcode table for $E0-$EF (NMOS 6502 / 6510)

Hex  Mnemonic    AddrMode       Bytes  Cycles  Flags affected   Notes
--------------------------------------------------------------------------------
$E0  CPX #imm    Immediate      2      2       N,Z,C            Compare X with immediate
$E1  SBC (zp,X)  (Indirect,X)   2      6       N,V,Z,C          Subtract with carry, (zp,X)
$E2  NOP (SKB)   Immediate*     2      2       -                Undocumented 2-byte NOP (SKB)
$E3  ISC (ISB)   (Indirect,X)   2      8       N,V,Z,C          Undocumented: INC then SBC ((zp,X))
$E4  CPX zp      Zero Page      2      3       N,Z,C            Compare X with zero page
$E5  SBC zp      Zero Page      2      3       N,V,Z,C          SBC zero page
$E6  INC zp      Zero Page      2      5       N,Z              Increment memory (zero page)
$E7  ISC (ISB)   Zero Page      2      5       N,V,Z,C          Undocumented: INC then SBC (zero page)
$E8  INX         Implied        1      2       N,Z              Increment X
$E9  SBC #imm    Immediate      2      2       N,V,Z,C          SBC immediate (official)
$EA  NOP         Implied        1      2       -                Official single-byte NOP
$EB  SBC #imm    Immediate*     2      2       N,V,Z,C          Undocumented variant (SBC immediate, unofficial)
$EC  CPX abs     Absolute       3      4       N,Z,C            Compare X with absolute
$ED  SBC abs     Absolute       3      4       N,V,Z,C          SBC absolute
$EE  INC abs     Absolute       3      6       N,Z              Increment memory (absolute)
$EF  ISC (ISB)   Absolute       3      6       N,V,Z,C          Undocumented: INC then SBC (absolute)

Notes:
- Addressing/Timing conventions: Immediate/ZeroPage/Absolute/Indirect,X/(Indirect),Y follow standard 6502 cycle rules.
- (Indirect,X) opcodes typically cost 6 cycles; (Indirect),Y typically cost 5 (+1 if page crossed), zero page,X cost 4, absolute,X cost 4 (+1 if page crossed).
- Undocumented opcodes (E2, E3, E7, EB, EF) are implementation-defined on some 6502-family chips; names like ISC/ISB or SKB are community conventions.
- Flags: CPX sets N, Z, C; SBC sets N, V, Z, C; INX/INC set N, Z only.
```

## References
- "opcode_row_00_brk_php_bpl_ora" — BRK / PHP / BPL / ORA group (base 0x00)
- "opcode_row_20_jsr_plp_bit_and" — JSR / PLP / BIT / AND group (base 0x20)
- "opcode_row_40_rti_pha_jmp_bvc_eor" — RTI / PHA / JMP / EOR group (base 0x40)
- "opcode_row_60_rts_pla_jmpind_bvs_adc" — RTS / PLA / JMP (ind) / ADC group (base 0x60)
- "opcode_row_80_nop_sty_dey_tya_shy_sta" — NOP / STY / STA group (base 0x80)
- "opcode_row_a0_ldy_tay_bcs_clv_lday_lda" — LDY / TAY / LDA group (base 0xA0)
- "opcode_row_c0_cpy_iny_bne_cld_cmp" — CPY / INY / CMP group (base 0xC0)
- (General) 6502 opcode references / undocumented opcode tables used for ISC/ISB, SKB naming conventions.

## Mnemonics
- CPX
- INX
- SBC
- INC
- ISC
- ISB
- NOP
- SKB
