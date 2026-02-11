# 6502 Opcode Map — Ranges $80-$9F and $A0-$BF (Commodore 64)

**Summary:** Opcode map for 6502 machine code ranges $80-$9F and $A0-$BF showing mnemonics and addressing modes (STA/STX/STY, LDA/LDX/LDY immediate/zero page/absolute/indexed, transfers, stack ops, branches). Includes "Future Expansion" placeholders for undefined/unused opcodes.

## Description
This chunk documents the opcode assignments for 6502 opcodes in the hex ranges $80-$9F and $A0-$BF. It emphasizes store instructions (STA/STX/STY), load instructions (LDA/LDX/LDY) across immediate, zero page, absolute and indexed addressing modes, CPU transfer/stack/index operations (TAX/TXA/TSX/TXS/TAY/TYA), and branch tests (BCC/BCS). Many undefined or undocumented opcodes are labeled "Future Expansion" per the original source.

Note: the original source contained an OCR artifact reading "BS - LDA - Zero Page,X"; this has been corrected to "B5 - LDA - Zero Page,X" to match the documented 6502 opcode map.

## Source Code
```text
80 - Future Expansion           A0 - LDY - Immediate
81 - STA - (Indirect,X)         A1 - LDA - (Indirect,X)
82 - Future Expansion           A2 - LDX - Immediate
83 - Future Expansion           A3 - Future Expansion
84 - STY - Zero Page            A4 - LDY - Zero Page
85 - STA - Zero Page            A5 - LDA - Zero Page
86 - STX - Zero Page            A6 - LDX - Zero Page
87 - Future Expansion           A7 - Future Expansion
88 - DEY                        A8 - TAY
89 - Future Expansion           A9 - LDA - Immediate
8A - TXA                        AA - TAX
8B - Future Expansion           AB - Future Expansion
8C - STY - Absolute             AC - LDY - Absolute
8D - STA - Absolute             AD - LDA - Absolute
8E - STX - Absolute             AE - LDX - Absolute
8F - Future Expansion           AF - Future Expansion

90 - BCC                        B0 - BCS
91 - STA - (Indirect),Y         B1 - LDA - (Indirect),Y
92 - Future Expansion           B2 - Future Expansion
93 - Future Expansion           B3 - Future Expansion
94 - STY - Zero Page,X          B4 - LDY - Zero Page,X
95 - STA - Zero Page,X          B5 - LDA - Zero Page,X
96 - STX - Zero Page,Y          B6 - LDX - Zero Page,Y
97 - Future Expansion           B7 - Future Expansion
98 - TYA                        B8 - CLV
99 - STA - Absolute,Y           B9 - LDA - Absolute,Y
9A - TXS                        BA - TSX
9B - Future Expansion           BB - Future Expansion
9C - Future Expansion           BC - LDY - Absolute,X
9D - STA - Absolute,X           BD - LDA - Absolute,X
9E - Future Expansion           BE - LDX - Absolute,Y
9F - Future Expansion           BF - Future Expansion
```

## References
- "opcode_map_00_1f_and_20_3f" — covers opcodes $00-$3F (BRK/JSR, ORA/AND, ASL/ROL, BIT, branches)
- "opcode_map_40_5f_and_60_7f" — covers opcodes $40-$7F (EOR/ADC, LSR/ROR, JMP, stack ops, branches)
- "opcode_map_c0_df_and_e0_ff" — covers opcodes $C0-$FF (CMP/CPY/INC/DEC/SBC and remaining branches)

## Mnemonics
- LDY
- LDA
- LDX
- STA
- STY
- STX
- DEY
- TAY
- TXA
- TAX
- TYA
- TXS
- TSX
- BCC
- BCS
- CLV
