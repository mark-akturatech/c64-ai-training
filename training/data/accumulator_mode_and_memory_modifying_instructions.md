# Accumulator Addressing (No Address)

**Summary:** Describes accumulator addressing for shift/rotate instructions (ASL A, ROL A, LSR A, ROR A), the one-byte implied-like form, and the distinction that INC/DEC modify memory (affecting N and Z) while INX/INY/DEX/DEY operate on index registers.

## Accumulator mode
Shift and rotate instructions (ASL, ROL, LSR, ROR) may operate either on the accumulator (A) or on a memory location. When they operate on the accumulator the instruction is written with the A operand (e.g., ASL A). Accumulator-mode has the same characteristics as implied addressing: the entire instruction encodes into one byte.

When the shift/rotate instructions refer to a memory location they require an address and a memory-reference addressing mode (not implied/accumulator). Those memory addressing modes and formats are handled separately.

## INC / DEC vs INX/INY/DEX/DEY
- INX, INY, DEX, DEY increment/decrement the X/Y index registers.
- INC (increment memory) and DEC (decrement memory) modify a memory location (not the accumulator or implied). Both INC and DEC affect the Negative (N) and Zero (Z) flags.

When an instruction modifies memory, its addressing mode is a memory-reference form (neither implied nor accumulator); those memory-reference addressing modes are documented elsewhere.

## References
- "shift_rotate_comments" — expands on flag effects when shifting memory vs A (N, Z, C behavior)