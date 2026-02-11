# VIC-II IRQ Enable — General introduction to interrupts

**Summary:** Describes what an interrupt is and states that the VIC-II has an interrupt-enable register which allows selected VIC-II conditions to request a CPU IRQ; explains the CPU temporarily stops the main program to run an interrupt routine and then returns.

**Interrupts — brief overview**

An interrupt is an external or peripheral-generated signal that causes the CPU to suspend the currently running program, execute a short interrupt routine, then resume the original program as if no permanent detour had occurred. The interrupt routine (also called an interrupt service routine, ISR) runs only while the interrupt condition is being serviced.

The VIC-II chip provides several internal conditions that can generate IRQ requests. Those conditions are gated by the VIC-II Interrupt Enable Register at address $D01A (53274 decimal). When a particular bit in that register is set, the corresponding VIC-II condition can trigger an IRQ request to the CPU. Clearing the bit prevents that condition from asserting an IRQ.

This mechanism lets VIC-II-timed events, such as raster line matches, sprite collisions, and light pen signals, interrupt program flow so code may run with precise timing or respond to VIC-II events.

## Key Registers

- **Interrupt Enable Register** ($D01A / 53274): Controls which VIC-II interrupt sources can generate IRQ requests. Each bit corresponds to a specific interrupt source:
  - Bit 0: Raster Compare Interrupt Enable
  - Bit 1: Sprite-Background Collision Interrupt Enable
  - Bit 2: Sprite-Sprite Collision Interrupt Enable
  - Bit 3: Light Pen Interrupt Enable

- **Interrupt Status Register** ($D019 / 53273): Indicates which interrupt sources have triggered. Each bit corresponds to a specific interrupt source:
  - Bit 0: Raster Compare Interrupt Flag
  - Bit 1: Sprite-Background Collision Interrupt Flag
  - Bit 2: Sprite-Sprite Collision Interrupt Flag
  - Bit 3: Light Pen Interrupt Flag
  - Bit 7: IRQ Flag (set when any enabled interrupt occurs)

## References

- "irqmask_register_overview" — expands on which IRQ sources can be enabled
- "installing_raster_irq_steps" — expands on how to install an interrupt routine safely

## Labels
- VIC_IRQ_ENABLE
- VIC_IRQ_STATUS
