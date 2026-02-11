# NMOS 6510 — opcode decode row (base $80)

**Summary:** Decode row covering the $80-range opcodes (NOP immediate variants, STY variants, DEY, BCC, TYA, undocumented SHY (abs,X), and the STA family across addressing modes). Includes explicit opcode byte values, cycle counts, instruction lengths, and details on undocumented opcodes.

**Decode row details**

This section lists the instruction slots decoded in the $80 area of the NMOS 6510/6502 opcode matrix. Each entry includes the mnemonic, addressing mode, opcode byte value, instruction length (in bytes), cycle count, and a brief description. Undocumented opcodes are marked accordingly.

- **NOP #imm (undocumented immediate NOP / SKB)**
  - **Opcode:** $80
  - **Length:** 2 bytes
  - **Cycles:** 2
  - **Description:** A two-byte instruction that consumes an immediate operand and acts as a no-operation. Commonly used as a filler in illegal opcode space.

- **STY zp (official)**
  - **Opcode:** $84
  - **Length:** 2 bytes
  - **Cycles:** 3
  - **Description:** Stores the Y register into a zero-page memory location.

- **DEY (official)**
  - **Opcode:** $88
  - **Length:** 1 byte
  - **Cycles:** 2
  - **Description:** Decrements the Y register by one and sets the Negative (N) and Zero (Z) flags accordingly.

- **STY abs (official)**
  - **Opcode:** $8C
  - **Length:** 3 bytes
  - **Cycles:** 4
  - **Description:** Stores the Y register into an absolute memory address.

- **BCC rel (official)**
  - **Opcode:** $90
  - **Length:** 2 bytes
  - **Cycles:** 2 (plus 1 if branch is taken, plus 1 more if branch crosses a page boundary)
  - **Description:** Branches to a relative address if the Carry (C) flag is clear.

- **STY zp,X (official)**
  - **Opcode:** $94
  - **Length:** 2 bytes
  - **Cycles:** 4
  - **Description:** Stores the Y register into a zero-page address offset by the X register.

- **TYA (official)**
  - **Opcode:** $98
  - **Length:** 1 byte
  - **Cycles:** 2
  - **Description:** Transfers the Y register to the Accumulator and sets the Z and N flags accordingly.

- **SHY abs,X (undocumented)**
  - **Opcode:** $9C
  - **Length:** 3 bytes
  - **Cycles:** 5
  - **Description:** An undocumented store instruction that writes the Y register ANDed with the high byte of the target address plus one. Behavior can vary across implementations; use with caution.

- **STA (zp,X) (official)**
  - **Opcode:** $81
  - **Length:** 2 bytes
  - **Cycles:** 6
  - **Description:** Stores the Accumulator into the memory location pointed to by the zero-page address offset by the X register.

- **STA zp (official)**
  - **Opcode:** $85
  - **Length:** 2 bytes
  - **Cycles:** 3
  - **Description:** Stores the Accumulator into a zero-page memory location.

- **NOP #imm (undocumented placeholder)**
  - **Opcode:** $89
  - **Length:** 2 bytes
  - **Cycles:** 2
  - **Description:** Another immediate NOP placeholder slot, often used as a filler in illegal opcode space.

- **STA abs (official)**
  - **Opcode:** $8D
  - **Length:** 3 bytes
  - **Cycles:** 4
  - **Description:** Stores the Accumulator into an absolute memory address.

- **STA (zp),Y (official)**
  - **Opcode:** $91
  - **Length:** 2 bytes
  - **Cycles:** 6
  - **Description:** Stores the Accumulator into the memory location pointed to by the zero-page address offset by the Y register.

- **STA zp,X (official)**
  - **Opcode:** $95
  - **Length:** 2 bytes
  - **Cycles:** 4
  - **Description:** Stores the Accumulator into a zero-page address offset by the X register.

- **STA abs,Y (official)**
  - **Opcode:** $99
  - **Length:** 3 bytes
  - **Cycles:** 5
  - **Description:** Stores the Accumulator into an absolute address offset by the Y register.

- **STA abs,X (official)**
  - **Opcode:** $9D
  - **Length:** 3 bytes
  - **Cycles:** 5
  - **Description:** Stores the Accumulator into an absolute address offset by the X register.

**Notes:**

- The source lists multiple immediate NOP (SKB) fillers and undocumented store-related opcodes (SHY). These illegal instructions are present in NMOS 6502 behavior and are used by some software, but they are not part of the official instruction set and can behave differently on CMOS/65C02-family chips.
- Exact runtime effects for undocumented opcodes (timing, memory mask) should be tested on the target hardware; the descriptions above reflect commonly observed NMOS behavior.

## Source Code

```text
Original slot list (as provided):

80

NOP
#imm

STY
zp

DEY

STY
abs

BCC
rel

STY
zp,x

TYA

SHY
abs,x

STA
(zp,x)

STA
zp

NOP
#imm

STA
abs

STA
(zp),y

STA
zp,x

STA
abs,y

STA
abs,x
```

(Reference: this block lists the decode slots / mnemonics + addressing modes in sequence for the $80 band as supplied by the source. It does not include explicit opcode hex bytes, cycle counts, or operand sizes in the original text.)

## References

- "opcode_row_00_brk_php_bpl_ora" — BRK / PHP / BPL / ORA group (base $00)
- "opcode_row_20_jsr_plp_bit_and" — JSR / PLP / BIT / AND group (base $20)
- "opcode_row_40_rti_pha_jmp_bvc_eor" — RTI / PHA / JMP / EOR group (base $40)
- "opcode_row_60_rts_pla_jmpind_bvs_adc" — RTS / PLA / JMP (ind) / ADC group (base $60)
- "opcode_row_a0_ldy_tya_lda" — LDY / TAY / LDA group (base $A0)
- "opcode_row_c0_cpy_cmp" — CPY / INY / CMP group (base $C0)
- "opcode_row_e0_cpx_sbc" — CPX / INX / SBC group (base $E0)

## Mnemonics
- NOP
- SKB
- STY
- DEY
- BCC
- TYA
- SHY
- STA
