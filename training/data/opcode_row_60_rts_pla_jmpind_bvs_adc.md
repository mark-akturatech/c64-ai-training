# NMOS 6510 — Opcode Decode Row (Base $60)

**Summary:** This document details the NMOS 6510 opcode decode row for addresses $60–$6F, including mnemonics, addressing modes, instruction lengths, cycle counts, status flag effects, and classifications as official or undocumented opcodes. Notably, the ordering of ADC variants and NOP placeholders in this row differs from standard NMOS 6502 opcode tables.

**Decode Row Description**

The following table presents the opcodes from $60 to $6F, detailing their mnemonics, addressing modes, instruction lengths (in bytes), cycle counts, status flag effects, and classifications:

| Opcode | Mnemonic | Addressing Mode | Bytes | Cycles | Status Flags Affected | Classification |
|--------|----------|-----------------|-------|--------|-----------------------|----------------|
| $60    | RTS      | Implied         | 1     | 6      | None                  | Official       |
| $61    | ADC      | (Indirect,X)    | 2     | 6      | N, V, Z, C            | Official       |
| $62    | KIL      | Implied         | 1     | -      | -                     | Undocumented   |
| $63    | RRA      | (Indirect,X)    | 2     | 8      | N, V, Z, C            | Undocumented   |
| $64    | NOP      | Zero Page       | 2     | 3      | None                  | Undocumented   |
| $65    | ADC      | Zero Page       | 2     | 3      | N, V, Z, C            | Official       |
| $66    | ROR      | Zero Page       | 2     | 5      | N, Z, C               | Official       |
| $67    | RRA      | Zero Page       | 2     | 5      | N, V, Z, C            | Undocumented   |
| $68    | PLA      | Implied         | 1     | 4      | N, Z                  | Official       |
| $69    | ADC      | Immediate       | 2     | 2      | N, V, Z, C            | Official       |
| $6A    | ROR      | Accumulator     | 1     | 2      | N, Z, C               | Official       |
| $6B    | ARR      | Immediate       | 2     | 2      | N, V, Z, C            | Undocumented   |
| $6C    | JMP      | Indirect        | 3     | 5      | None                  | Official       |
| $6D    | ADC      | Absolute        | 3     | 4      | N, V, Z, C            | Official       |
| $6E    | ROR      | Absolute        | 3     | 6      | N, Z, C               | Official       |
| $6F    | RRA      | Absolute        | 3     | 6      | N, V, Z, C            | Undocumented   |

**Notes:**

- **KIL ($62):** This opcode halts the processor, leading to a locked state. It is an undocumented instruction and should be avoided in standard programming. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Opcode?utm_source=openai))

- **RRA ($63, $67, $6F):** This undocumented instruction combines ROR and ADC operations. It rotates the memory location right and adds the result to the accumulator, including the carry. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Opcode?utm_source=openai))

- **NOP ($64):** While labeled as NOP, this undocumented instruction performs a read operation on the specified zero-page address without storing the result. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Opcode?utm_source=openai))

- **ARR ($6B):** This undocumented instruction performs an AND between the accumulator and an immediate value, followed by a ROR. It affects the N, V, Z, and C flags. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Opcode?utm_source=openai))

- **JMP (Indirect) ($6C):** Be aware of the well-documented bug in this instruction: if the indirect vector points to an address ending in $FF, the processor will read from $xxFF and $xx00 instead of $xxFF and $xxFF+1. ([liquisearch.com](https://www.liquisearch.com/mos_technology_6502/bugs_and_quirks?utm_source=openai))

## Key Registers

- **Accumulator (A):** Used in ADC, RRA, and ARR operations.
- **Program Counter (PC):** Affected by RTS and JMP instructions.
- **Stack Pointer (SP):** Utilized by RTS and PLA instructions.
- **Status Register (P):** Flags affected as detailed in the table above.

## References

- "opcode_row_00_brk_php_bpl_ora" — BRK / PHP / BPL / ORA group (base $00)
- "opcode_row_20_jsr_plp_bit_and" — JSR / PLP / BIT / AND group (base $20)
- "opcode_row_40_rti_pha_jmp_bvc_eor" — RTI / PHA / JMP / EOR group (base $40)
- "opcode_row_80_nop_sty_sta" — NOP / STY / STA group (base $80)
- "opcode_row_a0_ldy_tya_lda" — LDY / TAY / LDA group (base $A0)
- "opcode_row_c0_cpy_cmp" — CPY / INY / CMP group (base $C0)
- "opcode_row_e0_cpx_sbc" — CPX / INX / SBC group (base $E0)

**[Note: The placement and order of ADC variants and NOP placeholders in this row differ from standard NMOS 6502 opcode maps. Verify against authoritative opcode tables before use.]**

## Mnemonics
- RTS
- ADC
- KIL
- RRA
- NOP
- ROR
- PLA
- ARR
- JMP
