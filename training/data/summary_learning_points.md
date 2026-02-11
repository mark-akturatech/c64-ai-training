# MACHINE — Chapter 1 concise summary

**Summary:** Introduces binary and hexadecimal as representations, the 650x memory bus and little-endian address ordering, the 650x internal registers (PC, A, X, Y, SR, SP) and their basic roles, and the machine language monitor as a hexadecimal interface to inspect and modify memory.

## Concepts
- Binary is the machine-level value system; hexadecimal is a human shorthand for binary bytes/nibbles.
- The 650x chip communicates with memory by placing addresses onto its memory bus to read/write memory.
- The processor has internal registers used as fast work storage: Program Counter (PC), Accumulator (A), Index registers (X and Y), Status Register (SR), and Stack Pointer (SP).
- Program Counter (PC) contains the address from which the CPU will fetch the next instruction.
- A, X, and Y are used to hold and manipulate data; they can be loaded from memory and stored back to memory.
- The 650x uses little-endian ordering for multi-byte addresses: the low byte is stored/encoded first, followed by the high byte (low-byte, high-byte).
- The machine language monitor provides a direct hexadecimal interface to the machine, allowing inspection and modification of memory in hex and other low-level interactions.

## Key Registers
- PC - Program Counter: address of next instruction to fetch
- A - Accumulator: primary data register for arithmetic/logic
- X - Index Register X: used for indexing and data manipulation
- Y - Index Register Y: used for indexing and data manipulation
- SR - Status Register (flags): processor condition flags
- SP - Stack Pointer: points to top of hardware stack

## References
- "microprocessor_registers" — expands on register roles and details
- "monitors_overview" — expands on machine language monitor concepts
