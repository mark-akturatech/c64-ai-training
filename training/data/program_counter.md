# 6502 Program Counter (PC)

**Summary:** The 6502 Program Counter (PC) is a 16-bit internal register containing the address of the next instruction. It is automatically incremented by the CPU; control-flow instructions (JMP, JSR, RTS/RTI, conditional branches) and interrupt/reset vectors load or modify it.

## Overview
The Program Counter (PC) is a 16-bit internal register that always holds the address of the next byte to be fetched as an instruction or operand. The hardware increments the PC as instructions and their operands are read. Control-flow operations and processor events alter the PC:

- Jumps (JMP) and subroutine calls (JSR) load a new address into the PC so execution continues at that address.
- Returns from subroutines (RTS) and from interrupts (RTI) restore the PC from the value saved on the stack.
- Conditional branches (Bxx) use a signed 8-bit relative offset which is added to the PC (relative to the address following the branch instruction) when the condition is true.
- Interrupts and reset cause the CPU to load the PC from fixed vectors in memory (see References).

Operational notes:
- The PC is 16 bits and wraps naturally (e.g., increment past $FFFF goes to $0000).
- The PC is an internal CPU register, not memory-mapped; it cannot be directly read or written by ordinary load/store instructions (it is affected only by control-flow instructions, stack operations during interrupts/subroutines, or vectors on reset/interrupt).
- Branch offsets are signed 8-bit values; the offset is applied relative to the address of the instruction following the branch.

## References
- "interrupt_and_reset_vectors" — covers the NMI/RESET/IRQ vectors that load addresses into PC on reset or interrupt (vector addresses: NMI $FFFA/$FFFB, RESET $FFFC/$FFFD, IRQ/BRK $FFFE/$FFFF)

## Labels
- NMI
- RESET
- IRQ
- BRK
