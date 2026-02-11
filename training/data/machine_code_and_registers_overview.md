# Machine language storage, BASIC tokens, and the 6510 registers

**Summary:** How machine-language instructions and operands are stored as bytes; BASIC keywords are stored as single-byte tokens; 6510 internal registers described: Accumulator (A), X and Y index registers, Status register (flags), Program Counter (PC), Stack Pointer (SP), and the 6510 I/O port at $0000 (DDR) and $0001 (PORT) used for C64 memory management.

## Overview: instructions, operands, and tokens
- Machine-language programs are sequences of instructions encoded as bytes. Each instruction opcode occupies one memory location (one byte). Some instructions are followed by operand bytes (one or two bytes) that supply parameters (addresses, immediate values, offsets).
- BASIC keywords (PRINT, GOTO, etc.) are stored as single-byte tokens in a BASIC program; the token value occupies one memory location rather than one per character.
- In machine language, opcodes function like tokens: each opcode byte represents a single instruction. Operands, if required, are placed in the subsequent memory locations.

## 6510 internal registers (summary)
- Accumulator (A)
  - Primary register for arithmetic and logical operations. Many instructions move data to/from memory and the accumulator; arithmetic and logical operations (ADD, AND, OR, etc.) operate on A.
- X index register (X)
  - General-purpose index register. Used for indexed addressing modes, copying to/from memory, and specific instructions that only operate on X.
- Y index register (Y)
  - Another general-purpose index register. Similar role to X; used for indexed addressing and instructions specific to Y.
- Status register (Processor Status)
  - An 8-bit register of flags that reflect results of operations and control certain CPU behavior (e.g., Negative, Zero, Carry, Interrupt disable, Decimal mode, Overflow, etc.). (This chunk does not list the individual flag bits.)
- Program Counter (PC)
  - Holds the address of the current (next-to-execute) machine-language instruction. The PC advances during normal execution and is altered by branch/jump/call/return instructions.
- Stack Pointer (SP)
  - Points to the first empty location on the stack (stack grows downward in memory). Used for temporary storage by programs and for return addresses/interrupt handling.
- Input/Output port at $0000/$0001 (6510 port used for memory management)
  - $0000: Data Direction Register (DDR) — configures port lines as inputs/outputs.
  - $0001: PORT — read/write register for the 8-bit I/O lines.
  - On the C64, these two locations are used by the 6510's built-in I/O port to control memory configuration (bank switching of RAM/ROM/IO), allowing the system to map more than 64K of logical memory.

## Key Registers
- $0000 - 6510 - Data Direction Register (DDR) for the 6510 I/O port (memory management)
- $0001 - 6510 - PORT register for the 6510 I/O port (memory management / bank-switching)

## References
- "simple_memory_map_overview" — expands on where registers and memory areas are mapped
- "lda_immediate_absolute_and_address_representation" — example of an instruction that uses the accumulator and addressing modes
- "the_stack" — expands on Stack Pointer and stack usage

## Labels
- DDR
- PORT
