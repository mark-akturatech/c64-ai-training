# Relative Addressing

**Summary:** Relative addressing (used by 6510/6502 branch instructions) encodes the branch destination as a signed one-byte offset from the current instruction (assembler computes offsets when labels are used).

## Overview
All branch instructions on the 6510/6502 use the relative addressing mode. Instead of embedding an absolute address, the instruction operand is an 8‑bit signed offset that specifies how many bytes to move from the current instruction to the branch target. In practice you supply a label as the branch destination and the assembler computes the required offset.

(The offset is applied relative to the address of the next instruction — i.e., the program counter after the branch opcode and its operand.)

## Range and limits
- The operand is a signed 8‑bit value, so the mathematical range is -128 to +127 bytes from the next-instruction address.
- [Note: source text states a range of “+127 to —127”; **[Note: Source may contain an error — the correct signed range is -128..+127.]**]

## References
- "assembly_syntax_labels_comments" — assembler computation of branch offsets when labels are used
