# 6525 — IP=1 Single Interrupt Example (I1)

**Summary:** Sequence for a single interrupt I1 on the 6525 in IP=1 priority mode, showing ILR (Interrupt Latch Register) latching, /IRQ assertion, AIR (Active Interrupt Register) A1 bit setting/clearing, CPU read/acknowledge, and completion by writing AIR.

## Sequence (IP = 1, single interrupt I1)
1. Interrupt I1 is received by the 6525.
2. Bit I1 is set high in the Interrupt Latch Register (ILR).
3. /IRQ is pulled low (external interrupt line asserted).
4. A1 bit in the Active Interrupt Register (AIR) is set high (A1 = AIR bit for I1).
5. CPU detects /IRQ and reads AIR to determine which interrupt occurred.
6. Reading AIR resets the I1 bit in ILR and allows /IRQ to be released (pulled high).
7. CPU executes the interrupt service routine.
8. CPU signals completion by writing to AIR; writing AIR clears A1.
9. A1 is reset low and the interrupt sequence is complete.

## References
- "6525_functional_description_IP1_intro_priority_order" — expands on IP=1 priority mode overview  
- "6525_active_interrupt_register_AIR" — details AIR behavior, bits (A1) set/cleared during this sequence