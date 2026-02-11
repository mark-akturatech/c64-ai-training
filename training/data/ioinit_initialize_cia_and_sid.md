# IOINIT ($FDA3)

**Summary:** IOINIT is the Kernal entry at $FDA3 (jump table entry at 65412 / $FF84) that initializes the C64 Complex Interface Adapters (CIA1 @ $DC00 and CIA2 @ $DD00), turns the SID master volume off, and programs CIA1 Timer A to generate IRQs at 1/60 second intervals.

## Description
IOINIT is a documented Kernal routine invoked during reset (see power_on_reset_routine). Its responsibilities are limited to hardware initialization required by the OS before handing control to higher-level code:

- Initialize both CIA chips (CIA1 and CIA2) to their Kernal-default states.
- Program CIA1 Timer A so that it will generate periodic IRQs at a rate of 1/60 second (used by the system IRQ timing).
- Turn the SID chip volume off (write to the SID master volume / filter register) as part of powering up the audio subsystem.
- IOINIT is reachable via the Kernal vector/jump table entry at 65412 decimal ($FF84), which points to $FDA3.

The routine is part of the standard power-on/reset sequence and works together with the IRQ vector table and other Kernal initialization code to establish system timing and interrupt behavior.

## Key Registers
- $DC00-$DC0F - CIA 1 - Port/Timer/ICR/Control registers (Timer A registers at $DC04-$DC05)
- $DD00-$DD0F - CIA 2 - Port/Timer/ICR/Control registers
- $D400-$D41F - SID - Chip registers (master volume / filter control located within this range, typically referenced by Kernal during initialization)

## References
- "power_on_reset_routine" — expands on when IOINIT is called during RESET
- "irq_vector_table" — expands on IRQ vectors used together with CIA timer interrupts

## Labels
- IOINIT
