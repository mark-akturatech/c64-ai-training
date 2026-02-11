# X Index Register (X)

**Summary:** The X index register is used for indexed addressing modes and for instructions that specifically operate on X; it can be loaded from memory, stored to memory, and otherwise modified by machine-language instructions.

## Overview
The X register is the CPU index register used alongside the accumulator and Y register. It participates in addressing calculations (indexed addressing) and supports instructions that are specific to X. While many operations exist for the accumulator, there are distinct instructions that operate only on X.

## Operations
- Loading and storing: machine-language instructions allow copying a memory location into X and copying X back into memory.
- Modification: instructions exist that directly modify the X register (e.g., increment/decrement) and instructions that can use or affect X while operating on other registers.

## References
- "addressing_modes_indexed" — expands on indexed addressing uses X