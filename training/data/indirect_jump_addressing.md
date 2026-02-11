# Indirect addressing for JMP (addr)

**Summary:** JMP (addr) — indirect addressing on the 6510/6502 — reads a 16-bit address (two bytes) from the given operand location and jumps to that target. This is the only instruction using indirect addressing; the operand location may be anywhere in memory (not restricted to zero page) and the X and Y registers are not involved in address generation.

## Indirect Addressing
JMP (addr) treats its operand as the address of a 16-bit pointer. The CPU reads two bytes from that operand location (low byte and high byte) to form the effective jump vector, then transfers control to that vector. Unlike other 6502 addressing modes, the pointer source can be any absolute memory location (not limited to $00-$FF), and the index registers X and Y are not used in calculating the final jump address.

## References
- "addressing_modes_overview" — expands on JMP's special indirect mode

## Mnemonics
- JMP
