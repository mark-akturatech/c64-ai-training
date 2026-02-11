# Kick Assembler — addressing-mode column labels: "ind" and "rel"

**Summary:** Explains the Kick Assembler quick-reference table column labels "ind" (indirect addressing) and "rel" (relative addressing) and that those columns correspond to indirect and relative-mode opcode entries in each table row.

## Addressing-mode columns
The two short column labels in Kick Assembler's quick-reference table — "ind" and "rel" — denote the indirect and relative addressing-mode opcode entries for the instruction shown on that table row. In other words:
- "ind" = the opcode(s) for the instruction when using an indirect addressing mode (indirect addressing).
- "rel" = the opcode for the instruction when using a relative addressing mode (relative addressing).

These columns simply map each row's instruction to the opcode bytes used for that addressing mode in the table.

## References
- "arithmetic_and_processor_status_and_transfers" — expands on processor-status and transfer instruction entries
- "illegal_mnemonics_intro" — introduces illegal 6502 mnemonics (A.3.2)
