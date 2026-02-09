# CIA 6526 — Control Register A (CRA) — Offset $0E

**Summary:** Control Register A (CRA) at offset $0E in the 6526 CIA controls Timer A start/stop, input source (CNT/PHI2), PB6 routing/behavior, serial port direction, and TOD input frequency (50/60 Hz). Read/Write register; LOAD is a strobe that reads as 0.

## Description
Read/Write. Controls Timer A and related functions.

Bit layout and behavior:
- Bit 0: START — 1 = Start Timer A; 0 = Stop Timer A.
- Bit 1: PBON — 1 = Timer A output routed to PB6; 0 = PB6 is normal general-purpose I/O.
- Bit 2: OUTMODE — 1 = Toggle PB6 on each Timer A underflow; 0 = Pulse PB6 for one PHI2 cycle on underflow.
- Bit 3: RUNMODE — 1 = One-shot mode (timer stops after underflow); 0 = Continuous mode (timer reloads and continues).
- Bit 4: LOAD — 1 = Force load: transfer the latch value into the timer counter (strobe); this bit always reads back as 0.
- Bit 5: INMODE — 1 = Timer A counts positive edges on CNT input; 0 = Timer A counts PHI2 clock pulses.
- Bit 6: SPMODE — 1 = Serial port set to output (shift register driven by Timer A); 0 = Serial port set to input.
- Bit 7: TODIN — 1 = Time-of-day clock uses 50 Hz external input; 0 = uses 60 Hz external input.

Operational notes preserved from source:
- LOAD is a strobe (write-only effect); reading CRA returns bit 4 = 0.
- When SPMODE = 1, Timer A is used to clock the serial shift register (serial output mode).
- INMODE selects between external CNT edges (counting events) and internal PHI2 clock pulses (system clock).

## Key Registers
- $DC0E - CIA 1 - Control Register A (CRA), Timer A control, PB6 routing, serial/TOD select
- $DD0E - CIA 2 - Control Register A (CRA), Timer A control, PB6 routing, serial/TOD select

## References
- "timer_a_16bit" — expands on CRA bits controlling Timer A start, input source, and PB6 behavior
- "serial_data_register_sdr" — expands on CRA bit 6 selecting serial port input/output mode
- "time_of_day_clock" — expands on CRA bit 7 selecting TOD input frequency (50/60 Hz)