# MACHINE — 650x Internal Registers

**Summary:** Describes the 650x internal registers: PC (16-bit program counter), A/X/Y (8-bit data registers), SR (status register / PSW), and SP (stack pointer). Notes these registers are internal (no memory addresses) and that the PC will be examined in detail next.

## Registers Overview
The 650x contains several internal storage registers (not memory-addressable). Six primary registers are:

- PC (16 bits) — Program Counter: holds the address of the next instruction to fetch.
- A (8 bits) — Accumulator: primary data register for arithmetic/logic and many instructions.
- X (8 bits) — Index Register X: general-purpose data/index register.
- Y (8 bits) — Index Register Y: general-purpose data/index register.
- SR — Status Register / Processor Status Word (PSW): holds condition flags and status bits reflecting recent operations.
- SP — Stack Pointer: points into the processor stack (internal stack management).

These registers are shown relative to the address and data buses in the chip block diagram (see Source Code). The PC is the central register for instruction fetching and will be discussed in more detail subsequently.

## Source Code
```text
                         +-------------+
                         |             |
                         | +---------+ | ADDRESS BUS
                         | |   PC    | |-------------
                         | +----+----+ |      ->
                         |      |  A | |-------------
                         |      +----+ |
                         |      |  X | |
                         |      +----+ |
                         |      |  Y | |
                         |      +----+ | DATA BUS
                         |      | SR | |-------------
                         |      +----+ |     <->
                         |      | SP | |-------------
                         |      +----+ |
                         |             |
                         +-------------+
                            650x CHIP
```

## References
- "instruction_execution_fetch_cycle" — expands on how the PC is used to fetch instructions
- "data_registers_a_x_y" — describes usage of A/X/Y for data operations
