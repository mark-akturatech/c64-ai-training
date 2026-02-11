# CIA 6526 — Timer A (TALO/TAHI) — Offsets $04/$05

**Summary:** Timer A is a 16-bit down-counter at offsets $04/$05 (TALO/TAHI). Relevant searchable terms: $04/$05, CIA 6526, Timer A, TALO, TAHI, CRA bit 4 (force load), CRA bit 5 (count source), PHI2 (~1 MHz), CNT pin, PB6 toggle/pulse, ICR interrupt, cascaded Timer B.

## Description
Timer A is implemented as a 16-bit down-counter split into low and high bytes:
- Low byte: $04 (TALO)
- High byte: $05 (TAHI)

Reading from these offsets returns the current counter value. Writing to these offsets updates the timer latch (the 16-bit value to be used by the counter).

The latch is transferred to the active counter in any of these conditions:
- Timer underflow (when in continuous mode)
- A forced load (CRA bit 4)
- When the timer is started while previously stopped

Count source selection is controlled by CRA bit 5:
- PHI2 system clock (≈ 1 MHz on the C64)
- Positive edges on the external CNT pin

On underflow, Timer A can:
- Trigger an interrupt (flagged in the ICR if enabled)
- Toggle or generate a pulse on Port B bit 6 (PB6) when enabled/configured via CRA (PBON / OUTMODE)
- Clock Timer B when Timer B is configured to count Timer A underflows (cascading)

Reading behavior: reads return the current running counter value (not the latch), with low and high byte as above.

## Key Registers
- $DC04-$DC05 - CIA1 - Timer A low/high (TALO/TAHI) 16-bit down-counter
- $DD04-$DD05 - CIA2 - Timer A low/high (TALO/TAHI) 16-bit down-counter

## References
- "control_register_a" — CRA bits: start/stop, force load (bit 4), count-source (bit 5), PB6 output control (PBON/OUTMODE)
- "timer_b_16bit" — Timer B operation and cascading (Timer B can count Timer A underflows)
- "interrupt_control_register_icr" — ICR: timer underflow can set/trigger interrupts

## Labels
- TALO
- TAHI
