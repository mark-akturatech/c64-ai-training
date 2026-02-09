# CIA #2 overview ($DD00-$DD0F)

**Summary:** CIA #2 is mapped at $DD00-$DD0F (decimal 56576–56591) and is functionally identical to CIA #1 (see CIA #1 entries); its interrupt output is wired to the 6510 NMI instead of IRQ, so use the NMI vector and the CIA interrupt mask to control its interrupts.

## Overview
Locations $DD00-$DD0F address the Complex Interface Adapter chip #2 (CIA #2). The internal registers and functionality are the same as CIA #1; for detailed register layouts and per-register descriptions, refer to the CIA #1 documentation.

The crucial hardware difference for the Commodore 64 is the interrupt routing: CIA #1 drives the 6510 IRQ line, while CIA #2 drives the 6510 NMI line. Because CIA #2 asserts NMI, its interrupts are not masked by the 6510 Interrupt Disable flag (SEI). To disable CIA #2 interrupts you must use the CIA interrupt mask (the chip's Interrupt Control/Mask register).

When installing interrupt-driven routines that rely on CIA #2 events, set up and return through the NMI vector (the system's NMI handler), not the IRQ vector.

## Key Registers
- $DD00-$DD0F - CIA 2 - full CIA register block (timers, time-of-day clock, serial port, port A/B, control registers, interrupt control/mask) — identical in layout and function to CIA #1

## References
- "nmi_isr" — expands on NMI handler used in the IRQ-based loader example  
- "irq_loader_setup_part2_disassembly" — example configuration of CIA#2 to generate an NMI