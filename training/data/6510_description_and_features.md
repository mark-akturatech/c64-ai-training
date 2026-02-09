# MOS 6510 MICROPROCESSOR (Commodore 64)

**Summary:** MOS 6510 (C64 CPU) — MOS 6502-compatible microprocessor with on-chip 8-bit bidirectional I/O port (Output Register at $0000, Data-Direction Register at $0001), three-state 16-bit address bus for DMA/multiprocessor memory sharing, pipeline architecture, and selectable 1 MHz / 2 MHz operation.

## Description
The 6510 is a low-cost microcomputer CPU functionally identical to the MOS 6502 core (software-compatible) with an added on-chip 8-bit bidirectional I/O port and a three-state 16-bit address bus to allow direct memory access (DMA) and shared-memory multiprocessor configurations. The on-chip I/O port is byte-addressable and bit-programmable via:
- Output Register at $0000 (writes set output levels),
- Data-Direction Register at $0001 (configures each bit as input or output).

The device uses a single +5 V supply and N-channel silicon-gate, depletion-load technology. It supports a standard 8-bit data bus, a 16-bit address bus (addressable up to 64K), and is bus-compatible with the Motorola M6800 family. The internal pipeline provides improved throughput; two clock speed options are supported (1 MHz and 2 MHz operation, depending on system design and memory speed). The three-state address bus enables DMA and shared-memory arrangements.

## Features
- Eight-bit bi-directional I/O port (bit-by-bit programmable)
- Single +5-volt supply
- N-channel, silicon-gate, depletion-load technology
- Eight-bit parallel processing (8-bit data path)
- 56 instructions (6502 instruction set)
- Decimal and binary arithmetic
- Thirteen addressing modes
- True indexing capability
- Programmable stack pointer
- Variable-length stack
- Interrupt capability (IRQ/NMI compatible with 6502 behavior)
- Eight-bit bi-directional data bus
- Addressable memory range up to 64K bytes
- Direct memory access (DMA) capability via three-state address bus
- Bus compatible with M6800
- Pipeline architecture
- 1-MHz and 2-MHz operation
- Usable with any memory type/speed (subject to system timing)

## Key Registers
- $0000 - 6510 - I/O Port Output Register (writes drive port outputs)
- $0001 - 6510 - I/O Port Data Direction Register (DDR: 1=output, 0=input)

## References
- "pin_configuration_and_pinout" — ASCII pinout diagram and pin labels (P0–P7, A0–A15, D0–D7, control pins)
- "6510_characteristics_maximum_ratings" — electrical and timing characteristics, maximum ratings