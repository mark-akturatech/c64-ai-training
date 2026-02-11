# NMOS 6510 — Opcode decode row (base $A0)

**Summary:** NMOS 6502/6510 opcode decode row for base $A0 (opcodes $A0–$AF and $B0–$BF interleaved by column); covers LDY (immediate/zero page/absolute/zero page,X/absolute,X), TAY, BCS (relative), CLV, and the LDA family across (zp,X), zp, #imm, abs, (zp),Y, zp,X, abs,Y, abs,X addressing modes. Includes opcode hex, addressing mode, byte length, cycle counts and flag effects.

## Overview
This decode row groups transfers and loads for Y plus the A (accumulator) load family, arranged by column pattern (low nybble columns 0x0/0x4/0x8/0xC and 0x1/0x5/0x9/0xD across $A* and $B*). Key behaviors:

- LDY: Loads into Y, sets Z and N flags.
- LDA: Loads into A, sets Z and N flags.
- TAY: Transfer A -> Y, sets Z and N flags.
- CLV: Clears the V (overflow) flag.
- BCS: Branch on Carry Set (relative). Timing: 2 cycles base; +1 if branch taken; +2 if branch taken to a different page (i.e., page crossing).
- Addressing-mode timing notes: absolute,X / absolute,Y / (zp),Y variants may add 1 cycle on page-cross (when effective address crosses a 256-byte page boundary).

All opcodes listed are the documented NMOS 6502/6510 official instructions for these mnemonics and addressing modes.

## Source Code
```text
Opcode map (hex -> mnemonic / addressing / bytes / cycles / flags affected / notes)

$A0  - LDY #imm    - Immediate    - 2 bytes - 2 cycles  - sets Z,N
$A1  - LDA (zp,X)  - (ZeroPage,X) - 2 bytes - 6 cycles  - sets Z,N
$A2  - LDX #imm    - Immediate    - 2 bytes - 2 cycles  - (not in this row's description)
$A3  - *illegal*   - (varies)     -          -            - (NMOS undocumented)
$A4  - LDY zp      - ZeroPage     - 2 bytes - 3 cycles  - sets Z,N
$A5  - LDA zp      - ZeroPage     - 2 bytes - 3 cycles  - sets Z,N
$A6  - LDX zp      - ZeroPage     - 2 bytes - 3 cycles  - (not in this row's description)
$A7  - *illegal*   - (varies)     -          -            -
$A8  - TAY         - Implied      - 1 byte  - 2 cycles  - sets Z,N (A -> Y)
$A9  - LDA #imm    - Immediate    - 2 bytes - 2 cycles  - sets Z,N
$AA  - TAX         - Implied      - 1 byte  - 2 cycles  - (not in this row's description)
$AB  - *illegal*   - (varies)     -          -            -
$AC  - LDY abs     - Absolute     - 3 bytes - 4 cycles  - sets Z,N
$AD  - LDA abs     - Absolute     - 3 bytes - 4 cycles  - sets Z,N
$AE  - LDX abs     - Absolute     - 3 bytes - 4 cycles  - (not in this row's description)
$AF  - *illegal*   - (varies)     -          -            -

$B0  - BCS rel     - Relative     - 2 bytes - 2 cycles  - branch on C=1; +1 if taken; +2 if page crossed
$B1  - LDA (zp),Y  - (ZeroPage),Y - 2 bytes - 5 cycles  - sets Z,N; +1 if page crossed
$B2  - *illegal*   - (varies)     -          -            -
$B3  - *illegal*   - (varies)     -          -            -
$B4  - LDY zp,X    - ZeroPage,X   - 2 bytes - 4 cycles  - sets Z,N
$B5  - LDA zp,X    - ZeroPage,X   - 2 bytes - 4 cycles  - sets Z,N
$B6  - LDX zp,Y    - ZeroPage,Y   - 2 bytes - 4 cycles  - (not in this row's description)
$B7  - *illegal*   - (varies)     -          -            -
$B8  - CLV         - Implied      - 1 byte  - 2 cycles  - clears V (overflow) flag
$B9  - LDA abs,Y   - Absolute,Y   - 3 bytes - 4 cycles  - sets Z,N; +1 if page crossed
$BA  - TSX         - Implied      - 1 byte  - 2 cycles  - (not in this row's description)
$BB  - *illegal*   - (varies)     -          -            -
$BC  - LDY abs,X   - Absolute,X   - 3 bytes - 4 cycles  - sets Z,N; +1 if page crossed
$BD  - LDA abs,X   - Absolute,X   - 3 bytes - 4 cycles  - sets Z,N; +1 if page crossed
$BE  - LDX abs,Y   - Absolute,Y   - 3 bytes - 4 cycles  - (not in this row's description)
$BF  - *illegal*   - (varies)     -          -            -

Notes:
- "bytes" counts operand bytes including opcode.
- Page-cross extra cycle applies when indexed effective address crosses a 256-byte boundary.
- Undocumented/illegal opcodes are listed where relevant but are not part of the documented NMOS 6502 instruction set.
```

## References
- "opcode_row_00_brk_php_bpl_ora" — BRK / PHP / BPL / ORA group (base $00)
- "opcode_row_20_jsr_plp_bit_and" — JSR / PLP / BIT / AND group (base $20)
- "opcode_row_40_rti_pha_jmp_bvc_eor" — RTI / PHA / JMP / BVC / EOR group (base $40)
- "opcode_row_60_rts_pla_jmpind_bvs_adc" — RTS / PLA / JMP (ind) / BVS / ADC group (base $60)
- "opcode_row_80_nop_sty_dey_tya_shy_sta" — NOP / STY / STA group (base $80)
- "opcode_row_c0_cpy_cmp" — CPY / INY / CMP group (base $C0)
- "opcode_row_e0_cpx_sbc" — CPX / INX / SBC group (base $E0)

## Mnemonics
- LDY
- LDA
- LDX
- TAY
- TAX
- TSX
- CLV
- BCS
