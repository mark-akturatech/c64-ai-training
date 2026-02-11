# C64 I/O Map $DC04-$DC07 — CIA Timers A and B (CIA #1)

**Summary:** Registers $DC04-$DC07 are the low/high bytes for CIA timer A and timer B on the Commodore 64 (CIA#1). Read returns the current 16-bit counter; write sets the 16-bit latch (low byte + 256*high byte). See $DC0D for interrupt bits and $DC0E/$DC0F for control/load behavior.

## Description
- Registers $DC04-$DC07 hold two 16-bit interval timers (Timer A and Timer B) in the usual little-endian format: VALUE = LOW + 256*HIGH.
- Read semantics: reading any of these four bytes returns the present Timer Counter (the countdown value).
- Write semantics: writing stores the value into the Timer Latch. The latch is transferred into the running Timer Counter only when the corresponding Force Load bit in the timer Control Register (Control Register A/B at $DC0E/$DC0F) is used.
- Counting: when running, each timer counts down one step per microprocessor clock cycle (CPU cycles). TIME = LATCH VALUE / CLOCK SPEED. The source gives clock speeds:
  - NTSC (USA) ~ 1,022,730 cycles/sec (also listed as 1,022,370 in the source — see note below).
  - PAL (Europe) = 985,250 cycles/sec.
  **[Note: Source may contain an error — conflicting NTSC values 1,022,730 vs 1,022,370.]**
- On underflow (counter reaches 0):
  - The timer sets its interrupt bit in the CIA Interrupt Control Register ($DC0D): Timer A sets bit 0, Timer B sets bit 1.
  - If that timer interrupt is enabled in $DC0D, an IRQ is generated and the high bit of $DC0D is set to 1.
  - Optionally, if Port B output mode is configured, the timer will toggle/write the corresponding Port B output bit (Timer A -> Port B bit 6, Timer B -> Port B bit 7).
  - After reaching 0 the counter reloads from the Timer Latch and then either stops (one-shot) or continues counting (continuous mode), as selected by the Control Register (Bit 3 controls one-shot vs continuous).
- Timer A sources: normally counts CPU clock cycles; can be switched to count external pulses on the CTN line (User Port pin 4).
- Timer B sources: can count CPU clock cycles, external pulses, or be set to count the number of times Timer A underflows (linking A→B). Linking A as the low 16 bits and B as the high 16 bits yields an effective 32-bit timer (useful for long intervals, up to many minutes).
- Typical C64 usage:
  - CIA #1 Timer A is used to generate the periodic IRQ that drives keyboard scanning and the software clock (jiffy clock).
  - Default jiffy latch: low = 149, high = 66 → Latch Value = 66*256 + 149 = 17045, producing ~1/60 second timing on NTSC.
  - Both timers are used by the cassette/tape routines for timing data transfers; tape routines also use CIA timers while taking over IRQ vectors.

## Key Registers
- $DC04-$DC07 - CIA (CIA #1) - Timer A low/high ($DC04-$DC05) and Timer B low/high ($DC06-$DC07). Read = counter, Write = latch (use $DC0E/$DC0F Force Load to transfer).

## References
- "dc0d_ciaicr_interrupt_control_register" — expands on Timer IRQ enable and how timers signal IRQs
- "dc0e_ciacra_control_register_a" — expands on Control bits to start/stop Timer A and Force Load behavior
