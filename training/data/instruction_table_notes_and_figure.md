# MACHINE - Instruction timing/opcode table notes (Figure A.4)

**Summary:** Notes for interpreting the instruction-timing/opcode table (Figure A.4). Defines symbols used in the timing columns: page-boundary penalty ('!'), branch-cycle variants ('@'), memory-bit labels (M6/M7), borrow flag notation ('#'), and decimal-mode/Z-flag caveat ('$').

## Notes
- ! = Add 1 to "N" if a page boundary is crossed (page‑cross penalty).
- @ = Branch timing variants:
  - 2 cycles if the branch does not occur.
  - 3 cycles if the branch occurs to an address on the same 256‑byte page.
  - 4 cycles if the branch occurs to an address on a different page (page‑cross).
- M6 = memory bit 6 (label used in the table to note behavior dependent on bit 6).
- M7 = memory bit 7 (label used in the table to note behavior dependent on bit 7).
- # = Borrow = Not Carry (the notation indicates borrow semantics; i.e., borrow is the inverse of the carry flag).
- $ = Decimal-mode caveat:
  - If in decimal mode, the Z (zero) flag is invalid for some operations.
  - The accumulator must be explicitly checked for a zero result when decimal mode applies.
- x = modified (indicates that the referenced flag or memory is modified).
- - = not modified (indicates no modification).
- N = number of cycles (base cycle count given in the table).

Figure A.4

## References
- "instruction_timing_table_part1" — expands on interpreting timing/opcode rows (part 1)
- "instruction_timing_table_part2" — expands on interpreting timing/opcode rows (part 2)
- "instruction_table_header" — defines the columns and OP/N layout that these notes annotate