# 6502 Carry Flag (C)

**Summary:** The Carry Flag (C) is a bit in the processor status register (P) set when an operation produces a carry out of the most significant bit (bit 7) or a borrow underflow from bit 0. It is affected by arithmetic, comparison, and logical shift instructions and can be changed explicitly with SEC and CLC.

## Description
- Name: Carry Flag (C)
- Location: bit C of the processor status register P (P: processor status register).
- Set when:
  - an operation produces a carry out of the most significant bit (bit 7) of the result, or
  - an operation produces a borrow/underflow from the least significant bit (bit 0) of the result.
- Affected by: arithmetic instructions, comparison instructions, and logical shift instructions.
- Explicit instructions:
  - SEC — Set Carry Flag
  - CLC — Clear Carry Flag

## References
- "accumulator" — expands on how arithmetic operations in A affect the carry flag
- "processor_status_register" — expands on flag P containing the C bit