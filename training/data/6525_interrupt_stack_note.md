# 6525 — Interrupt Stack behavior for AIR

**Summary:** Describes the 6525's Interrupt Stack behavior: a read of AIR (AIR = Active Interrupt Register) pushes the interrupt stack and a write to AIR pops it; avoid extraneous reads/writes to AIR to preserve priority interrupt information.

## Interrupt Stack and AIR behavior
The 6525 maintains Priority Interrupt information using an Interrupt Stack. Behavior:

- A read of AIR pushes the current interrupt information onto the Interrupt Stack.
- A write to AIR pops the Interrupt Stack (removing the top entry).
- Because reads and writes modify the stack, extraneous reads or writes to AIR will create unwanted stack operations and corrupt the stored priority information.
- The only time to read AIR is to respond to an interrupt request.
- The only time to write AIR is to signal the 6525 that the interrupt service is complete.

(For clarity: AIR = Active Interrupt Register.)

## References
- "6525_active_interrupt_register_AIR" — expands on how read/write operations affect AIR and the Interrupt Stack  
- "6525_IP1_example_higher_priority_interrupt" — example of stack usage when nested/higher-priority interrupts occur

## Labels
- AIR
