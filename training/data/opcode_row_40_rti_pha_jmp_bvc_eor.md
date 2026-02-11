# NMOS 6510 — Opcode decode row (base $40)

**Summary:** Opcode decode row for base $40 on NMOS 6510 (opcodes $40–$4F). Lists RTI, several NOP/placeholder positions (zero page / zero page,X / absolute,X), PHA, JMP (absolute), BVC, CLI, and the EOR family across addressing modes: (zp,X), zp, #imm, abs, (zp),Y, zp,X, abs,Y, abs,X.

**Decode / instruction mapping**

The following is the decode row for base $40 (low nibble $0..$F). The entries are given in sequence for opcodes $40 through $4F. Each entry shows the mnemonic, addressing mode, byte length, and cycle count.

- $40 — RTI — Implied — 1 byte — 6 cycles
- $41 — EOR — (Indirect,X) — 2 bytes — 6 cycles
- $42 — KIL — Implied — 1 byte — 1 cycle (halts CPU)
- $43 — SRE — (Indirect,X) — 2 bytes — 8 cycles
- $44 — NOP — Zero Page — 2 bytes — 3 cycles
- $45 — EOR — Zero Page — 2 bytes — 3 cycles
- $46 — LSR — Zero Page — 2 bytes — 5 cycles
- $47 — SRE — Zero Page — 2 bytes — 5 cycles
- $48 — PHA — Implied — 1 byte — 3 cycles
- $49 — EOR — Immediate — 2 bytes — 2 cycles
- $4A — LSR — Accumulator — 1 byte — 2 cycles
- $4B — ALR — Immediate — 2 bytes — 2 cycles
- $4C — JMP — Absolute — 3 bytes — 3 cycles
- $4D — EOR — Absolute — 3 bytes — 4 cycles
- $4E — LSR — Absolute — 3 bytes — 6 cycles
- $4F — SRE — Absolute — 3 bytes — 6 cycles

**Notes:**

- **KIL ($42):** This undocumented opcode halts the CPU by locking it in an infinite loop.
- **SRE ($43, $47, $4F):** An undocumented opcode that performs a logical shift right on the addressed memory location and then EORs the result with the accumulator.
- **ALR ($4B):** An undocumented opcode that ANDs the accumulator with an immediate value and then performs a logical shift right on the result.
- **NOP ($44):** An undocumented opcode that acts as a no-operation but may have side effects on timing or memory, depending on the specific implementation.

## Source Code

```asm
; Decode row base $40 — source listing (opcodes $40..$4F)
; Listed in the sequence provided by the source.

.org $0040
.byte $40 ; RTI
.byte $41 ; EOR (Indirect,X)
.byte $42 ; KIL (halts CPU)
.byte $43 ; SRE (Indirect,X)
.byte $44 ; NOP (Zero Page)
.byte $45 ; EOR Zero Page
.byte $46 ; LSR Zero Page
.byte $47 ; SRE Zero Page

.byte $48 ; PHA
.byte $49 ; EOR Immediate
.byte $4A ; LSR Accumulator
.byte $4B ; ALR Immediate
.byte $4C ; JMP Absolute
.byte $4D ; EOR Absolute
.byte $4E ; LSR Absolute
.byte $4F ; SRE Absolute
```

## References

- "opcode_row_00_brk_php_bpl_ora" — BRK / PHP / BPL / ORA group (base $00)
- "opcode_row_20_jsr_plp_bit_and" — JSR / PLP / BIT / AND group (base $20)
- "opcode_row_60_rts_jmpind_adc" — RTS / JMP (indirect) / ADC group (base $60)
- "opcode_row_80_nop_sty_sta" — NOP / STY / STA group (base $80)
- "opcode_row_a0_ldy_tya_lda" — LDY / TAY / LDA group (base $A0)
- "opcode_row_c0_cpy_cmp" — CPY / INY / CMP group (base $C0)
- "opcode_row_e0_cpx_sbc" — CPX / INX / SBC group (base $E0)

## Mnemonics
- RTI
- EOR
- SRE
- LSE
- NOP
- LSR
- PHA
- ALR
- ASR
- JMP
- KIL
- JAM
