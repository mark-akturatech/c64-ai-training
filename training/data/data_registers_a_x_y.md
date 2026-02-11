# Data Registers: A, X, and Y

**Summary:** Describes the 650x CPU data registers A, X, and Y (8-bit), their load/store (LDA, STY) semantics, and the requirement to use a register as an intermediary because the 650x cannot move memory-to-memory directly.

## Data Registers: A, X, and Y
Any of the three CPU registers (A, X, Y) hold and manipulate 8-bit values. They can be loaded from memory and stored back to memory; both load and store are copying actions.

- Load example: LDA $2345 — copies the byte at $2345 into A; $2345 is unchanged.
- Store example: store Y into $3456 (STY $3456) — copies Y into memory; Y is unchanged.

The 650x has no instruction that copies directly from one memory location to another. To move data between addresses you must:
1. Load from the source address into A, X, or Y.
2. Store from that register to the destination address.

At this stage the three registers may be treated as interchangeable for load/store operations. Later material assigns special roles (for example, A is the accumulator used for arithmetic), but the above intermediary/copying behavior applies to all three.

## References
- "first_program_exchange_example" — demonstrates using A and X to swap two memory bytes  
- "instruction_execution_fetch_cycle" — explains how registers receive data during instruction execution

## Mnemonics
- LDA
- LDX
- LDY
- STA
- STX
- STY
