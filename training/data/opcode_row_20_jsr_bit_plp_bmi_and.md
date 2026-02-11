# NMOS 6510 — Opcode row 0x20 (JSR / BIT / PLP / BMI / SEC / AND)

**Summary:** Opcode decode row for base 0x20 (opcodes 0x20–0x3D): JSR (abs), BIT (zp/abs), PLP, BMI (relative), SEC, undocumented NOP placeholders (zp,X and abs,X), and the AND family across addressing modes: (zp,X), zp, #imm, abs, (zp),Y, zp,X, abs,Y, abs,X.

## Overview
This chunk lists the official (and documented undocumented-NOP) opcodes located in the 0x20 decode row of the NMOS 6510/6502 opcode matrix. It shows which mnemonic and addressing mode occupy each canonical slot in that row:

- JSR abs — subroutine call (push return address, jump to absolute address).
- BIT zp / BIT abs — bit test (sets Z from A & M; copies bits 6 and 7 from memory into V and N respectively).
- PLP — pull processor status from stack (restores P from value popped from stack).
- BMI rel — branch if negative (branch relative when N = 1).
- SEC — set carry flag (C = 1).
- AND family — logical AND between accumulator and memory, addressing modes: (zp,X), zp, #imm, abs, (zp),Y, zp,X, abs,Y, abs,X. Affected flags: Z and N updated from result; C and V unaffected.
- NOP placeholders — undocumented NOPs occupying the zero page,X and absolute,X slots in this row; they perform no changes to processor state other than consuming the instruction's fetch/addressing cycles.

No hardware register addresses are involved in this chunk — these are CPU opcodes and addressing modes only.

## Source Code
```text
Opcode map (row base 0x20) — opcodes and addressing modes shown in this chunk:

0x20  JSR   abs
0x21  AND   (zp,X)
0x24  BIT   zp
0x25  AND   zp
0x28  PLP   implied (pull P from stack)
0x29  AND   #imm
0x2C  BIT   abs
0x2D  AND   abs

0x30  BMI   rel
0x31  AND   (zp),Y
0x34  NOP   zp,X    ; undocumented NOP placeholder (uses zp,X addressing)
0x35  AND   zp,X
0x38  SEC   implied (set C)
0x39  AND   abs,Y
0x3C  NOP   abs,X   ; undocumented NOP placeholder (uses abs,X addressing)
0x3D  AND   abs,X
```

## References
- "opcode_row_00_brk_php_bpl_ora" — expands on BRK / PHP / BPL / ORA group (base 0x00)
- "opcode_row_40_rti_jmp_eor" — expands on RTI / JMP / EOR group (base 0x40)
- "opcode_row_60_rts_jmpind_adc" — expands on RTS / JMP (indirect) / ADC group (base 0x60)
- "opcode_row_80_nop_sty_sta" — expands on NOP / STY / STA group (base 0x80)
- "opcode_row_a0_ldy_tya_lda" — expands on LDY / TAY / LDA group (base 0xA0)
- "opcode_row_c0_cpy_cmp" — expands on CPY / INY / CMP group (base 0xC0)
- "opcode_row_e0_cpx_sbc" — expands on CPX / INX / SBC group (base 0xE0)

## Mnemonics
- JSR
- BIT
- PLP
- BMI
- SEC
- AND
- NOP
