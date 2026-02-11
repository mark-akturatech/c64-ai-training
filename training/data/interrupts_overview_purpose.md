# Interrupts: purpose, asynchronous vs polling, and IRQ vector usage ($FFFE → $0314)

**Summary:** Interrupts (VIC-II IRQs) provide real-time timing and program control for tasks such as the real-time clock, type-ahead keyboard buffer, sprite-collision signaling, and raster-line notifications; the C64 CPU services an IRQ by performing an indirect jump through $FFFE which is routed (on stock C64 ROM) to a RAM pointer at $0314/$0315 for the user handler.

## Overview
Interrupts let hardware request immediate processor attention without continual software polling. On the C64 the VIC-II (and other chips) can request IRQs to handle:
- real-time clock updates,
- the type-ahead keyboard buffer,
- sprite collisions,
- notification when a specific raster scan line is reached.

When an interrupt request is accepted (interrupts enabled), the 6510/6502 finishes the current instruction and then performs the standard vector fetch/jump sequence to the IRQ vector at $FFFE/$FFFF. On the stock C64, the ROM IRQ entry performs an indirect jump into RAM; the RAM pointer used by many programs is at $0314/$0315. Placing the low/high address of your routine into $0314/$0315 causes that routine to be called when the IRQ/interrupt is taken.

## Asynchronous interrupt vs polling
- Polling: the program repeatedly reads a status register (e.g., a collision flag) inside its main loop. This wastes CPU cycles and requires the program to check the condition frequently enough to respond promptly.
- Asynchronous interrupt: hardware asserts an IRQ when the event occurs; the CPU suspends the main flow (after the current instruction) and jumps to the interrupt handler. This removes the need for constant polling and reserves CPU time for higher-priority or time-critical tasks.

Use interrupts for highest-priority, time-sensitive operations (e.g., immediate response to a collision). Use polling for less urgent or simpler checks where deterministic timing is not required.

## IRQ vector handling on the C64
- The processor services an IRQ by reading the IRQ vector at $FFFE/$FFFF and jumping there after completing the current instruction.
- On a stock C64, the ROM entry pointed to by $FFFE contains an indirect jump to a RAM vector at $0314/$0315 (software convention). Putting the address of your IRQ routine into $0314/$0315 causes the IRQ to invoke your code.
- The IRQ mechanism relieves the main program from continuous scanning of hardware status registers (e.g., sprite-collision bits in the VIC-II), lowering CPU overhead.

## Example: sprite collision → explosion via IRQ
- Configure the VIC-II to enable sprite-collision IRQs (hardware step; not detailed here).
- Ensure interrupts are enabled in the processor status so IRQs are accepted.
- Store the low/high address of the explosion routine at $0314/$0315. When the VIC-II asserts an IRQ for a detected collision, the CPU will finish the current instruction, vector through $FFFE, and execute your explosion handler immediately (asynchronously).

## Key Registers
- $FFFE - CPU - IRQ vector low byte (IRQ entry vector)
- $0314-$0315 - RAM - RAM-resident IRQ handler pointer used by C64 ROM/interrupt chain

## References
- "6510_architecture_and_registers" — expands on vector locations and status bits (IRQ/NMI)
- "working_with_interrupts_and_raster" — expands on detailed raster interrupt usage
