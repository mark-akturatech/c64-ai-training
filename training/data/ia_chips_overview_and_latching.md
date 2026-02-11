# IA chips (PIA / VIA / CIA) — event latching & interrupt control

**Summary:** Overview of interface adapter functions for PIA/VIA/CIA focusing on event latching, interrupt enable registers, the IFR (interrupt flag register), IRQ linkage, and use of logical operations (AND / ORA / EOR) to test and clear flags.

**Event latching and interrupt control**
Interface adapters (PIA, VIA, CIA) provide hardware event latching and interrupt control for brief external or timer-driven events.

- **Event latching:** A short-lived triggering signal is captured (latched) into an event flag so the CPU can detect and handle it later. The flag holds the event state until software clears it; the flag will not usually clear itself.
- **Interrupt enable register:** Links selected event flags to the adapter's IRQ output. When a linked flag is set, the adapter can assert IRQ to the CPU; the register lets software enable or disable that linkage on a per-event basis.
- **IFR (Interrupt Flag Register):** Packs multiple event flags together. Software reads IFR to detect which events occurred and must explicitly clear flags when handling them.
- **Polling vs interrupts:** If an event is not time-critical, software can poll IFR periodically instead of enabling IRQ linkage.
- **Bit extraction and clearing:** Use logical operations (AND, ORA, EOR) to isolate or modify particular bits in IFR. It is the programmer’s responsibility to clear event flags after handling; failure to do so can leave the IRQ asserted or prevent detection of new events.
- **Trigger sources:** Flags are typically set by timers or external signals; whether a flag is connected to IRQ is controlled by the interrupt enable register.

## Key Registers
- **6526 CIA:**
  - **Interrupt Flag Register (IFR):** Addressed at $0D.
    - **Bit 7:** Set if any interrupt is pending.
    - **Bit 6:** Serial port interrupt.
    - **Bit 5:** Timer B interrupt.
    - **Bit 4:** Timer A interrupt.
    - **Bit 3:** Time-of-Day clock alarm interrupt.
    - **Bit 2:** Flag pin interrupt.
    - **Bit 1:** Port B interrupt.
    - **Bit 0:** Port A interrupt.
  - **Interrupt Control Register (ICR):** Addressed at $0E.
    - **Bit 7:** Set to enable or disable interrupts.
    - **Bits 6-0:** Correspond to the interrupt sources in the IFR; setting a bit enables the corresponding interrupt.

- **6522 VIA:**
  - **Interrupt Flag Register (IFR):** Addressed at $0D.
    - **Bit 7:** Set if any interrupt is pending.
    - **Bit 6:** Shift register interrupt.
    - **Bit 5:** Timer 2 interrupt.
    - **Bit 4:** Timer 1 interrupt.
    - **Bit 3:** CB1 interrupt.
    - **Bit 2:** CB2 interrupt.
    - **Bit 1:** CA1 interrupt.
    - **Bit 0:** CA2 interrupt.
  - **Interrupt Enable Register (IER):** Addressed at $0E.
    - **Bit 7:** Set to enable or disable interrupts.
    - **Bits 6-0:** Correspond to the interrupt sources in the IFR; setting a bit enables the corresponding interrupt.

## References
- "ia_chip_timers_io" — expands on IA chip timers and I/O functions  
- "interrupt_project_example" — practical use of IA flags with IRQ

## Labels
- IFR
- ICR
- IER
