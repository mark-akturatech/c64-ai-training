# Commodore 64 / 6502 — Instruction-table notation and symbol key

**Summary:** Symbol key for 6502 instruction tables: register symbols (A, X, Y, M, P, S), transfer markers (->, <-, fromS, toS), flag-change notation (/, +, -, _, /\ , V), immediate-mode indicator (#), and the "(Ref: XX)" reference pointing to sections of the MCS6500 Programming Manual.

## Symbols and notation
The following notation is used in the instruction-summary tables:

- A — Accumulator  
- X, Y — Index registers  
- M — Memory  
- P — Processor Status register (flags)  
- S — Stack Pointer

- EOR — Logical exclusive OR (mnemonic)  
- V — Logical OR (symbol used in tables)

- fromS — Transfer from Stack  
- toS — Transfer to Stack  
- -> — Transfer to (arrow notation used in tables)  
- <- — Transfer from (arrow notation used in tables)

- / — Change (flag change indicator)  
- _ — No change (flag unchanged)  
- + — Add (used to denote add effect on flags/result)  
- - — Subtract (used to denote subtract effect on flags/result)  
- /\ — Logical AND (flag/operation indicator)

- PC — Program Counter  
- PCH — Program Counter High (high byte)  
- PCL — Program Counter Low (low byte)

- OPER — Operand (named operand field in tables)  
- # — Immediate addressing mode indicator (immediate operand)

Note: At the top of each instruction table a parenthesized reference number "(Ref: XX)" appears; this points to the section in the MCS6500 Microcomputer Family Programming Manual where that instruction is defined and discussed.

## References
- "alphabetic_instruction_list_jsr_to_tya" — alphabetic mnemonic summary using this notation  
- "adc_add_with_carry_instruction" — detailed ADC instruction table that follows this notation