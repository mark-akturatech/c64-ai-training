# CIA #1 Control Register A ($DC0E) — CIACRA

**Summary:** CIA1 Control Register A at $DC0E configures Timer A (start/stop, one-shot/continuous, force load, input source), routes Timer A to Port B (PB6) in toggle or pulse modes, sets the serial port direction, and selects TOD clock frequency (50/60 Hz).

## Description
This register controls Timer A behavior and related I/O signals on Complex Interface Adapter 1 (CIA1, base $DC00).

Bit assignments and effects:
- Bit 0 — Timer A start/stop
  - 0 = Timer A stopped; 1 = Timer A running (loads latched value and begins counting according to input mode).
- Bit 1 — Timer A output on Port B (PB6)
  - When set, the Timer A output is routed to PB6 (Port B bit 6). The exact PB6 waveform depends on Bit 2 (toggle vs pulse).
- Bit 2 — Port B output mode for Timer A (toggle/pulse)
  - Controls how PB6 behaves when Timer A output is enabled:
    - Toggle mode: PB6 changes state each time Timer A underflows, producing a square-ish wave whose period is two timer cycles (state flips on each terminal count).
    - Pulse mode: PB6 generates a short pulse on the terminal count event (single transition per underflow). (Pulse width is implementation-specific to the CIA hardware timing.)
- Bit 3 — Timer A one-shot / continuous
  - 0 = Timer A continuous (reloads automatically from latch on underflow and keeps running).
  - 1 = Timer A one-shot (stops after a single underflow unless restarted).
- Bit 4 — Force load latched Timer A value
  - When set, the latched timer value is immediately loaded into the countdown register. Use to synchronize or reinitialize the running timer without waiting for an underflow.
- Bit 5 — Timer A input mode (CPU cycles vs CNT line)
  - 0 = Timer A counts system (CPU) cycles (each CPU clock or defined internal tick).
  - 1 = Timer A counts pulses on the external CNT input line (allows external event counting).
- Bit 6 — Serial port direction (CIA serial register at $DC0C)
  - 1 = Serial port is in output mode.
  - 0 = Serial port is in input mode.
  - See the serial data port documentation ($DC0C) for timing and handshaking details.
- Bit 7 — TOD (Time-of-Day) clock frequency selection
  - 1 = TOD uses a 50 Hz reference on the TOD pin (for PAL/50Hz systems).
  - 0 = TOD uses a 60 Hz reference on the TOD pin (for NTSC/60Hz systems).
  - Use this to select the external mains/sync-derived frequency for accurate timekeeping.

Timer A operation notes
- Starting Timer A (Bit 0 = 1) loads the countdown register from the latched value (unless force-load logic is used) and begins counting according to Bit 5 selection.
- One-shot mode (Bit 3) stops the timer on terminal count; continuous mode reloads the latch automatically.
- Force-load (Bit 4) is used to overwrite the active countdown with the current latched value immediately; it is useful to re-synchronize phases or restart without waiting for an underflow.
- When configured to count CNT pulses (Bit 5 = 1), Timer A increments only on external CNT transitions; when configured for CPU cycles, it advances with internal clock ticks.

PB6 signaling (practical behavior)
- With Bit 1 set and Bit 2 = toggle, PB6 flips state on each Timer A terminal count, producing a toggled output whose frequency is half the timer underflow frequency.
- With Bit 1 set and Bit 2 = pulse, PB6 emits a brief pulse at each terminal count event instead of toggling state. Pulse duration is governed by CIA internal timing and typically is a short, fixed-width pulse.

Serial and TOD interactions
- Bit 6 directly affects the serial shift register direction and must be consistent with software use of $DC0C to avoid bus contention.
- Bit 7 changes the reference used by the TOD circuitry; set appropriately for your machine region or external clock source.

**[Note: Source may contain limited wording on exact pulse width for PB6 in pulse mode — pulse width depends on CIA internal timing and is not specified here.]**

## Source Code
```text
CIA1 Control Register A ($DC0E) — bit map
Bit 7  Bit 6  Bit 5  Bit 4  Bit 3  Bit 2  Bit 1  Bit 0
TODHz  SERDIR CNTSEL FLOAD ONESH T/P   PB_EN  START

Definitions:
- START (Bit 0): 0=stop Timer A, 1=start Timer A
- PB_EN (Bit 1): 1=route Timer A output to PB6
- T/P (Bit 2): 0=toggle PB6 on terminal count, 1=pulse PB6 on terminal count
- ONESH (Bit 3): 1=one-shot mode, 0=continuous (auto-reload)
- FLOAD (Bit 4): 1=force load latched value into timer
- CNTSEL (Bit 5): 0=count CPU/internal cycles, 1=count external CNT pulses
- SERDIR (Bit 6): 1=serial port output, 0=serial port input (see $DC0C)
- TODHz (Bit 7): 1=50Hz TOD reference, 0=60Hz TOD reference

Notes:
- PB6 behavior: toggle mode flips PB6 each underflow (effective frequency = timer_underflow_freq/2).
- Pulse mode emits a short pulse on each underflow (pulse width is CIA-internal).
- Force load causes immediate transfer of the latch to the countdown register.
```

## Key Registers
- $DC0E - CIA 1 - Control Register A (CIACRA): Timer A control, PB6 routing, serial direction, TOD frequency

## References
- "dc0c_serial_data_port_cia1" — Serial Data Port register ($DC0C) and serial direction/timing
- "dc0d_cia1_interrupt_control_register" — CIA1 Interrupt Control and Timer A interrupt sources

## Labels
- CIACRA
