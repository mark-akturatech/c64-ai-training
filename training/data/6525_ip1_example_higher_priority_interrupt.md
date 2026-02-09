# MACHINE - IP = 1 example B: handling of a lower-priority interrupt (I1) that is followed by a higher-priority interrupt (I2)

**Summary:** Sequence showing interrupt-latch and AIR (Interrupt Acknowledge Register) behavior when a lower-priority interrupt I1 is being serviced and a higher-priority interrupt I2 arrives: A1/A2 latch bits, /IRQ assertion/deassertion, automatic stacking into the 650x stack queue, AIR read clearing latch bits for identification, and AIR write clearing A2 to resume I1. Terms: AIR, Interrupt Latch Register, /IRQ, A1/A2, 650x stack queue.

## Sequence (step-by-step)
1. Interrupt I1 is received by the device.
2. Bit I1 in the Interrupt Latch Register is set high.
3. /IRQ is pulled low and A1 output is set high.
4. The processor recognizes /IRQ and reads AIR to determine which interrupt occurred (AIR = Interrupt Acknowledge Register).
5. Reading AIR resets bit I1 in the interrupt latch and allows /IRQ to be released (reset high).
6. The processor begins servicing the I1 interrupt.
7. While servicing I1, a higher-priority interrupt I2 is received: A2 is set, A1 is reset low, and /IRQ is pulled low again.
8. Because the processor has not finished I1, the current I1 service context (routine) will be automatically stacked in the 650x stack queue when the new /IRQ for I2 is received (stack pushes occur on the processor side).
9. The processor reads AIR to identify I2; reading AIR resets the I2 bit in the interrupt latch.
10. The processor services I2, clears A2 by writing AIR, and returns from the I2 interrupt. Returning from the interrupt causes the 650x processor to resume servicing the previously interrupted I1.
11. After clearing A2 in AIR, A1 will not be restored to one; internal circuitry prevents a lower-priority interrupt (I1) from re-interrupting the resumed higher-priority processing (i.e., prevents the lower-priority interrupt from interrupting the resumed I1 processing).

## References
- "6525_interrupt_stack_note" — expands on interrupt stack pushes on AIR read and pops on AIR write  
- "6525_IP1_example_single_interrupt" — contrasts this sequence with single-interrupt behavior