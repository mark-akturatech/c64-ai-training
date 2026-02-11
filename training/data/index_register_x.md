# 6502 Index Register X

**Summary:** Index Register X — an 8-bit CPU register used as a counter or memory offset; supports compare, increment, and decrement operations and can be used to read or change a copy of the stack pointer.

## Overview
Index Register X is an 8-bit register typically used to hold loop counters or offsets for indexed memory addressing. Its contents can be:
- Compared with memory values.
- Incremented or decremented for counting/loop control.

## Stack pointer interaction
Unlike the Y register (and other general-purpose registers), X can be used to obtain a copy of the stack pointer or to change that copy. (See the referenced "stack_pointer" chunk for details on instructions and behavior related to copying or modifying the stack pointer.)

## References
- "stack_pointer" — expands on interaction: X can get or set a copy of the stack pointer
