# CIA1 Control Register B ($DC0F)

**Summary:** CIA1 Control Register B ($DC0F / 56335) controls Timer B operation: start/stop, output on Port B bit 7 (toggle/pulse, one-shot/continuous), force-loading the latched value, Timer B input source selection (CPU cycles, CNT line, Timer A underflows, Timer A+CNT), and Time-of-Day write mode (TOD/alarm select).

## Description
CIA1 Control Register B is an 8-bit control register that configures Timer B behavior and some Port B output routing. Important behaviors and effects:

- Bit 0 (Start): when set, Timer B runs; when clear, Timer B stops.
- Bit 1 (Port B output select): when set, Timer B's output is routed to Port B bit 7 (the physical port pin); when clear, Timer B does not drive Port B bit 7.
- Bit 2 (Port B output mode): selects how Timer B drives Port B bit 7: set = toggle the bit each output event; clear = pulse the bit for one cycle per event.
- Bit 3 (Run mode): set = one-shot mode (Timer B stops after underflow); clear = continuous (auto-reload) mode.
- Bit 4 (Force load): a strobe that forces the latched counter value to be loaded into the Timer B counter immediately.
- Bits 5-6 (Input mode select): choose the clock/input source used for counting Timer B:
  - 00 = Timer B counts CPU cycles (system clock-derived)
  - 01 = Timer B counts pulses on the CNT line (User Port pin 4)
  - 10 = Timer B counts occurrences of Timer A underflow (each time Timer A reaches 0)
  - 11 = Timer B counts Timer A underflows only when CNT pulses are present (Timer A + CNT combined)
- Bit 7 (TOD write select): selects Time-of-Day (TOD) write behavior when writing to TOD registers: 0 = writes set the alarm, 1 = writes set the clock.

Use the force-load strobe (bit 4) to synchronize loading the latched 16-bit Timer B value into the running counter. Selecting Port B bit 7 output (bits 1–3) allows hardware signaling or logic-level observation of Timer B events. Input-mode combinations (bits 5–6) enable flexible counting schemes for external event counting, timer chaining with Timer A, or CPU-cycle timing.

## Source Code
```text
56335 $DC0F CIACRB
Control Register B

Bit 0: Start Timer B (1=start, 0=stop)
Bit 1: Select Timer B output on Port B (1=Timer B output appears on Bit 7 of Port B)
Bit 2: Port B output mode (1=toggle Bit 7, 0=pulse Bit 7 for one cycle)
Bit 3: Timer B run mode (1=one-shot, 0=continuous)
Bit 4: Force latched value to be loaded to Timer B counter (1=force load strobe)
Bits 5-6: Timer B input mode
  00 = Timer B counts microprocessor cycles
  01 = Count signals on CNT line at pin 4 of User Port
  10 = Count each time that Timer A counts down to 0
  11 = Count Timer A 0's when CNT pulses are also present
Bit 7: Select Time of Day write (0=writing to TOD registers sets alarm, 1=writing to TOD registers sets clock)
```

## Key Registers
- $DC0F - CIA1 - Control Register B (Timer B control: start/stop, Port B bit7 output, output mode, one-shot/continuous, force-load, input-source select, TOD write select)

## References
- "cia1_timers_and_usage" — Implications of Timer B input modes for threshold schemes