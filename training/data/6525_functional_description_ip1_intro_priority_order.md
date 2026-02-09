# MACHINE - IP = 1 (Interrupts Prioritized)

**Summary:** Describes IP = 1 interrupt mode (6525): prioritized interrupts with priority I4 > I3 > I2 > I1 > I0; interrupts are latched into the ILR, /IRQ is asserted, and the corresponding AIR bit is set (only one AIR bit may be set at a time).

## Description
IP = 1 selects a prioritized interrupt scheme where the five interrupt inputs are ordered:

- I4 > I3 > I2 > I1 > I0

In this mode at most one bit of the AIR is set at any time. When an interrupt occurs it is latched into the interrupt latch register (ILR) and the /IRQ output is driven low. The appropriate bit in the AIR (Active Interrupt Register) is then set to indicate which interrupt is active.

## Operation (high-level flow)
1. An interrupt input becomes active.
2. The interrupt is latched into the ILR (Interrupt Latch Register).  
3. The /IRQ line is pulled low (interrupt request asserted).
4. The AIR (Active Interrupt Register) sets the bit corresponding to the highest-priority pending interrupt (only one AIR bit will be set under IP = 1).
5. Software or hardware that services /IRQ examines AIR/ILR to determine the source and handle the interrupt.

For detailed step-by-step scenarios (single interrupt, arrival of a higher-priority interrupt, arrival of a lower-priority interrupt) see the example cross-references below.

## References
- "6525_IP1_example_single_interrupt" — example: single interrupt under IP = 1  
- "6525_IP1_example_higher_priority_interrupt" — example: a higher-priority interrupt arrives while another is pending  
- "6525_IP1_example_lower_priority_interrupt" — example: a lower-priority interrupt arrives while a higher one is pending