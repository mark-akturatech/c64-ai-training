# 6510 processor (C64)

**Summary:** Description of the 6510 CPU used in the Commodore 64: 8-bit data bus, 16-bit address bus, two-phase clock φ2 (NTSC 1022.7 kHz, PAL 985.248 kHz), important signals (φ2, R/W, IRQ, RDY, AEC) and the built-in 6-bit I/O port mapped at $0000/$0001 (P0–P5). Notes on RDY/AEC bus arbitration with the VIC-II.

## 6510 processor
The 6510 is a 6502-family CPU with an 8-bit data bus and a 16-bit address bus; it is object-code compatible with the 6502. In the C64 it is clocked at ~1 MHz and provides a built-in 6-bit bidirectional I/O port (P0–P5). It has two external interrupt inputs: maskable IRQ and non-maskable NMI.

The 6-bit I/O port lines (P0–P5) can be individually programmed as inputs or outputs. A data direction register and a data register are internally mapped to addresses $0000 and $0001 respectively.

## Important signals
- φ2 (phase 2)
  - Processor clock output; reference for bus timing.
  - Frequency: NTSC 1022.7 kHz, PAL 985.248 kHz.
  - One clock cycle = two phases: φ2 is low in phase 1 and high in phase 2.
  - 6510 accesses the bus in phase 2; the VIC-II normally accesses the bus in phase 1.

- R/W
  - High = read cycle, Low = write cycle.

- IRQ
  - Active low maskable interrupt input. When asserted, an interrupt sequence starts after two or more clock cycles at the start of the next instruction (if interrupts are not masked).
  - The VIC-II can assert IRQ to request CPU service.
  - Interrupts are only recognized when RDY is high.

- RDY
  - When low during a read access, the processor halts with the address lines holding the current fetch address. RDY is ignored during write accesses.
  - In the C64 RDY is used to pause the CPU when the VIC-II needs extra bus cycles (bus arbitration); it is connected to the VIC-II BA (Bus Available) signal.

- AEC
  - When asserted, AEC tri-states the CPU address lines to allow the VIC-II to drive them. In the C64 AEC is driven by the VIC-II AEC output.

## Bus arbitration (RDY / AEC interaction with VIC-II)
- Phase division: CPU normally uses φ2 (phase 2) for bus accesses; VIC-II takes most of its accesses in phase 1. This phase separation reduces contention.
- RDY is used to insert wait states on CPU read cycles when the VIC-II requires additional cycles (e.g., fetching character pointers or sprite data). While RDY is low (during a read), the CPU stops with the current address present on the bus.
- AEC tri-states the CPU address bus so the VIC-II can drive addresses directly during its DMA cycles. Together, AEC (tri-stating addresses) and RDY (inserting CPU wait states) implement bus arbitration between CPU and VIC-II.

## Source Code
(omitted — no code/listings in source)

## Key Registers
- $0000-$0001 - 6510 (CPU) - Built-in 6-bit I/O port (P0–P5): Data Direction Register ($0000) and Data Register ($0001).

## References
- "memory_access_timing" — expands on Bus phase division between VIC and CPU  
- "addresses_0_1_and_de00_area" — expands on special behavior of addresses $0000/$0001 when VIC drives bus