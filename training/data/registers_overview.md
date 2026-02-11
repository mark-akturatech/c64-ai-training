# 6502 Register Set Overview

**Summary:** The 6502 has six CPU registers: five 8-bit registers (A accumulator, X and Y index registers, S stack pointer, P processor status) and one 16-bit Program Counter (PC, exposed as PCH/PCL). Searchable terms: A, accumulator, X, Y, S, stack pointer, P, processor status, PC, PCH, PCL.

## Registers
A — Accumulator (8-bit): primary operand and arithmetic/logical result register.

X — Index Register X (8-bit): used for indexed addressing, loops, and shifting operations.

Y — Index Register Y (8-bit): second index register for addressing and counters.

PCH / PCL — Program Counter (16-bit): 16-bit instruction pointer split into high (PCH) and low (PCL) bytes for incrementing and branching.

S — Stack Pointer (8-bit): 8-bit stack offset; stack resides on page $01 (high byte fixed at $01).

P — Processor Status (8-bit): flags register (negative, overflow, decimal, interrupt disable, zero, carry, etc.).

## References
- "accumulator" — expands on Accumulator (A) details  
- "index_register_x" — expands on Index register X details  
- "index_register_y" — expands on Index register Y details  
- "program_counter" — expands on Program Counter (PC) details  
- "stack_pointer" — expands on Stack Pointer (S) details  
- "processor_status_register" — expands on Processor status flags (P)
