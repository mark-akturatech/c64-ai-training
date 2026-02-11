# 6525 — Functional description when IP = 0 (No Priority)

**Summary:** Describes 6525 interrupt flow with IP = 0: ILR → AIR immediate transfer, /IRQ asserted, reading AIR resets /IRQ and clears ILR via ILR xor AIR, writing AIR clears AIR and may start a new interrupt sequence; multiple simultaneous interrupts may appear in AIR.

## Functional Description (IP = 0 — No Priority)
- When IP = 0 (no priority), any interrupt latched into the Interrupt Latch Register (ILR) is immediately copied into the Active Interrupt Register (AIR) and the /IRQ output is driven low.
- A read of the AIR resets /IRQ high and clears the corresponding bit(s) in the ILR by performing ILR := ILR XOR AIR (exclusive OR).
- After servicing the interrupt(s), a write to the AIR clears the AIR. If interrupts arrived while servicing, clearing AIR by the write will initiate a new interrupt sequence (those pending interrupts will be transferred into AIR and /IRQ will be asserted again).
- In this non-prioritized mode multiple interrupts can be transferred into AIR simultaneously; software must detect and handle multiple set bits in AIR (i.e., multiple active interrupts) as no hardware priority resolution occurs.

## References
- "6525_interrupt_latch_register_ILR" — expands on ILR → AIR transfer and ILR xor AIR clearing
- "6525_interrupt_stack_note" — cautions about reading/writing AIR and interrupt sequencing

## Labels
- ILR
- AIR
- IRQ
