# Index Register Y (6502)

**Summary:** Index register Y — an 8-bit CPU register used as a counter or memory offset; supports compare, increment and decrement operations (CPY, INY, DEY). Similar role to X but without the stack-pointer interaction.

## Description
Y is an 8-bit index register on the 6502. It typically holds loop counters or memory offsets for indexed addressing. Its contents can be compared with memory locations and adjusted by increment and decrement instructions.

Behavioral notes:
- Common operations: compare (CPY), increment (INY), decrement (DEY).
- Used for indexed addressing/offsets when an index register is required.
- Unlike the X register, Y has no special interaction with the stack pointer (X can be transferred to/from the stack pointer via TXS/TSX).

## References
- "index_register_x" — expands on comparison of X and Y typical uses
