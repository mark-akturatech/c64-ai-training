# COMMODORE 64 - Change hardware IRQ vector (Method 4)

**Summary:** Change the 6502 IRQ vector to run a custom interrupt handler every 1/60s (system IRQ used by the KERNAL). Must disable interrupts before altering the vector; replacement handler normally should chain to the KERNAL IRQ routine unless it fully handles CIA responsibilities; the handler must finish with RTI.

## Details
- Every (approximately) 1/60th of a second the C64's IRQ is triggered and the operating system (KERNAL) transfers control to the IRQ handler. The KERNAL uses this IRQ for timing, keyboard scanning, and other periodic tasks.
- You can change the hardware IRQ vector to point to your own routine so that code runs concurrently with a BASIC program (useful for background tasks). This is more difficult than simpler techniques and requires careful chaining to avoid breaking system behavior.
- Important constraints and requirements:
  - ALWAYS disable interrupts before changing the IRQ vector to avoid the CPU taking an interrupt while the vector is being written.
  - If your replacement routine does not perform the KERNAL's expected CIA servicing, you must transfer control to the normal IRQ handling routine during your handler so the CIA is serviced correctly.
  - If your replacement handles the CIA interrupts itself, the replacement must still end with RTI (ReTurn from Interrupt).
  - The replacement handler must preserve CPU state (push registers as needed) and restore them before RTI, to avoid corrupting the interrupted context.
- Typical usage: install handler, allow BASIC program to run, let handler run every IRQ tick for concurrent processing. Be aware of timing and interrupt reentrancy issues.

## Key Registers
- $FFFE-$FFFF - CPU - IRQ/BRK vector (low/high) — address where the 6502 reads the interrupt vector for IRQ/BRK; change these to redirect IRQ to a custom handler

## References
- "vector_kernal_routine" — expands on VECTOR routine and how VECTOR routine entries can be used to manage IRQ vector chaining and KERNAL interaction