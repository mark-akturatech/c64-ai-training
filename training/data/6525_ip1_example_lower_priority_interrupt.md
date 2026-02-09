# 6525 — IP=1: lower-priority interrupt during servicing of a higher-priority interrupt (I1 → I0)

**Summary:** Describes 6525 interrupt behavior when a higher-priority interrupt I1 is being serviced and a lower-priority interrupt I0 is latched (terms: 6525, AIR, ILR, /IRQ, interrupt priority, I1, I0).

## Behavior
Sequence for the case when a lower-priority interrupt occurs while a higher-priority interrupt is being serviced (IP = 1 implies priority ordering; AIR = Active Interrupt Register, ILR = Interrupt Latch Register):

1. Interrupt I1 is received and latched in the ILR.
2. /IRQ is asserted (pulled low) and the AIR reflects A1 set high.
3. The processor recognizes /IRQ and reads AIR to determine that I1 occurred.
4. The processor begins servicing I1; during this service, a lower-priority interrupt I0 is received and latched (ILR).
5. Upon completion of the I1 interrupt routine the processor writes AIR to clear A1, signaling the 6525 that service of I1 is complete.
6. The latched I0 is transferred from the ILR to the AIR and /IRQ is asserted again (pulled low), beginning a new interrupt sequence for I0.

This preserves the priority: a latched lower-priority interrupt waits until the higher-priority service is explicitly cleared (by writing AIR) before being promoted to AIR and reasserting /IRQ.

## References
- "6525_functional_description_IP1_intro_priority_order" — expands on priority ordering I4..I0  
- "6525_active_interrupt_register_AIR" — expands on transfer of latched interrupts from ILR to AIR