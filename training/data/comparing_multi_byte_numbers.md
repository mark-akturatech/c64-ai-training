# Comparing multi-byte unsigned numbers (subtract & check carry)

**Summary:** Use subtraction (SBC across bytes) and inspect the carry flag to compare multi-byte unsigned values on the 6502; CMP/CPX/CPY are suitable only for single-byte compares.

## Description
For unsigned multi-byte comparisons, subtract one number from the other and examine the carry flag when the subtraction is complete. If the carry (C) is set, the minuend (the value being subtracted from) was greater than or equal to the subtrahend; if the carry is clear, the minuend was less than the subtrahend. This works because a set carry after subtraction indicates the unsigned result was non‑negative (no borrow across the most significant byte), while a clear carry indicates an overall borrow (the true unsigned result would be negative and therefore the minuend < subtrahend).

Note: CMP/CPX/CPY perform single-byte compares only; for multi-byte values the subtraction must be carried out over all bytes (least significant byte first), with carries/borrows propagated between bytes. You do not need to preserve the numeric result — only the final carry matters.

## Source Code
(omitted — no code listing present in source)

## Key Registers
(omitted — not applicable)

## References
- "subtraction_and_multi_byte_subtraction" — expands on using subtraction and the C flag to compare multi-byte unsigned values