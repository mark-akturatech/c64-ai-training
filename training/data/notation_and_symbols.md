# 6502 Instruction Table Notation

**Summary:** Notation used in 6502/MCS6500 instruction tables: register mnemonics (A, X, Y, P, S), memory/operand symbols (M, OPER, #), transfer arrows (`->`, `<-`), change indicators (`/` change, `_` no change), arithmetic/logic symbols (`+`, `-`, `/\`, `V`, EOR). Also notes on table reference numbers (Ref: XX) pointing to the MCS6500 Programming Manual.

## Symbols and Notation
- A — Accumulator
- X, Y — Index registers
- M — Memory
- P — Processor Status register
- S — Stack Pointer
- PC — Program Counter
- PCH — Program Counter High byte
- PCL — Program Counter Low byte
- OPER — OPERAND (the memory operand for an instruction)
- # — Immediate addressing mode (immediate operand)
- -> — Transfer to (destination follows)
- <- — Transfer from (source follows)
- fromS — Transfer from Stack
- toS — Transfer to Stack
- / — Change (the indicated register/flag is changed by the instruction)
- _ — No change (register/flag remains unchanged)
- + — Add (arithmetic)
- - — Subtract (arithmetic)
- /\ — Logical AND
- V — Logical OR
- EOR — Logical exclusive OR

## Reference Notes
- At the top of each instruction table the parenthesized text "(Ref: XX)" is a reference number that directs the reader to the corresponding section in the MCS6500 Microcomputer Family Programming Manual where the instruction is defined and discussed.
- The notation above is the summary convention used in the instruction/timing tables; timing tables expand on how these notations map to cycle counts and affected flags.

## References
- "MCS6500 Microcomputer Family Programming Manual" — section reference numbers (Ref: XX) used in instruction tables
- "instruction_timing_tables" — expands on timing tables and use of the notation