# CIA Control Register A ($DC0E) — Timer A control (CIA1)

**Summary:** Defines $DC0E (CIA Control Register A) bit meanings for Timer A control, Port B Bit‑6 output mode, input source selection (CNT vs CPU cycles), serial direction ($DC0C), and TOD frequency select (50/60 Hz). Covers one‑shot vs continuous timer behavior and the force‑load (latch→counter) strobe.

## Description
This register controls Timer A (start/stop, mode, reload) and several related functions:

- Bit 0 — Start Timer A
  - 1 = start counting down; 0 = stop.
  - In one‑shot mode the CIA will clear this bit when the timer reaches 0 (stops). In continuous mode the timer remains running (see Bit 3).

- Bit 1 — Route Timer A output to Port B bit 6
  - 1 = Timer A output appears on Port B Bit 6 (overrides DDRB Bit 6 and the normal Data Port B output).
  - 0 = no forced Timer output on Port B Bit 6.

- Bit 2 — Port B output form (when Bit 1 = 1)
  - 1 = toggle Bit 6 each time the timer runs down (flip from 0→1 or 1→0).
  - 0 = produce a single pulse on Bit 6 of one machine‑cycle duration (about 1 µs) when the timer runs down.

- Bit 3 — Timer A run mode
  - 1 = one‑shot: timer counts down to 0, reloads the counter from the latch, and then clears Bit 0 (stops).
  - 0 = continuous: timer counts down to 0, reloads the latch and continues counting repeatedly without clearing Bit 0.

- Bit 4 — Force load latched value to counter
  - Writing 1 causes the value previously written to the Timer A low/high latch to be transferred immediately to the counter.
  - The bit has no stored data (no significance on read); it is a write‑strobe to force load the counter.

- Bit 5 — Timer A input source
  - 1 = count microprocessor machine cycles (CPU cycles). The source rate is given as 1,022,730 cycles/second in the source.
  - 0 = count external pulses on the CNT line (User Port pin 4). Useful for frequency/event counting or measuring external pulse timing.

- Bit 6 — Serial port direction
  - Controls whether the Serial Port Register ($DC0C) is input or output (1=output, 0=input). See $DC0C for serial details.

- Bit 7 — Time Of Day (TOD) clock frequency select
  - 1 = TOD expects 50 Hz input on TOD pin.
  - 0 = TOD expects 60 Hz input on TOD pin (the C64 uses 60 Hz).

Behavior notes (preserved from source):
- One‑shot behavior: after reaching zero the CIA reloads the counter from the latch but will stop (clear Bit 0) so a subsequent start is required.
- Continuous behavior: automatic reload and continued counting; Bit 0 remains set.
- Force‑load (Bit 4) is used to synchronously load a newly written latch value into the running counter without waiting for the next underflow.

## Source Code
```text
56334 $DC0E CIACRA
Control Register A

Bit 0: Start Timer A (1=start, 0=stop)
Bit 1: Select Timer A output on Port B (1=Timer A output appears on Bit 6 of Port B)
Bit 2: Port B output mode (1=toggle Bit 6, 0=pulse Bit 6 for one cycle)
Bit 3: Timer A run mode (1=one-shot, 0=continuous)
Bit 4: Force latched value to be loaded to Timer A counter (1=force load strobe)
Bit 5: Timer A input mode (1=count microprocessor cycles, 0=count signals on CNT line at pin 4 of User Port)
Bit 6: Serial Port (56332, $DC0C) mode (1=output, 0=input)
Bit 7: Time of Day Clock frequency (1=50 Hz required on TOD pin, 0=60 Hz)
```

## Key Registers
- $DC0E - CIA (CIA1) - Control Register A (Timer A control, Port B Bit‑6 output, CNT/CPU source select, serial direction, TOD freq)

## References
- "cia1_timers_and_usage" — How control bits affect timer behavior in tape routines