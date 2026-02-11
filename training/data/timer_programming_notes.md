# CIA 6526 Timer Programming Notes

**Summary:** Practical programming notes for CIA 6526 timers (Timer A/B, CRA/CRB, PB6/PB7) including PHI2 clock resolution (≈985,248 Hz PAL / 1,022,727 Hz NTSC), 16-bit and cascaded 32-bit periods, latch vs counter behavior, force-load (CRA/CRB bit 4), one-shot vs continuous modes, and PB6/PB7 underflow output modes (pulse/toggle).

**Timer resolution and periods**
At PHI2 clock rates of approximately 985,248 Hz (PAL) or 1,022,727 Hz (NTSC):
- Minimum timer tick ≈ 1 microsecond (single PHI2 cycle).
- A single 16-bit CIA timer counts up to 65,536 cycles → maximum period ≈ 65.5 ms (16-bit).
- Cascading Timer A and Timer B yields a 32-bit timer (A low/high + B low/high) with a maximum period ≈ 71.8 minutes (PAL).

**One-shot vs continuous modes**
- Continuous mode: when the timer underflows it automatically reloads from the latch and continues counting; suitable for periodic interrupts.
- One-shot mode: the timer stops after a single underflow; suitable for precise single delays.

**Latch vs counter behavior (writes and load events)**
- Writes to the timer registers always update the timer LATCH, not the running COUNTER.
- The latch is transferred to the counter (i.e., the counter is reloaded) when any of the following occur:
  - (a) The timer underflows while in continuous mode (automatic reload).
  - (b) The force-load bit (CRA or CRB bit 4 — the LOAD/FORCE bit) is set.
  - (c) The timer transitions from stopped to running (START bit changes 0→1).
- Note: this behavior means software can safely write new reload values into the latch while the counter is running; the change only takes effect on the above events.

**Timer underflow output on Port B (PB6 / PB7)**
- Timer A underflow drives PB6; Timer B underflow drives PB7 (Port B pins).
- Output behavior selectable:
  - Pulse mode: PB6/PB7 goes active for a single PHI2 cycle on underflow.
  - Toggle mode: PB6/PB7 inverts its state on each underflow (useful for square waves or timing signals).
- Use DDRB and PRB appropriately to configure PB6/PB7 as outputs and to read/drive their states.

**Control Register A (CRA) and Control Register B (CRB) Bit Fields**

Both CRA and CRB are 8-bit registers that control the operation of Timer A and Timer B, respectively. The bit fields are defined as follows:

- **Bit 7 (START):** Start/Stop control.
  - 0: Stop the timer.
  - 1: Start the timer.

- **Bit 6 (PBON):** Timer output to PB6/PB7.
  - 0: Disable timer output.
  - 1: Enable timer output.

- **Bit 5 (OUTMODE):** Output mode selection.
  - 0: Pulse mode.
  - 1: Toggle mode.

- **Bit 4 (LOAD):** Force load.
  - 0: No action.
  - 1: Load the timer latch into the counter immediately.

- **Bit 3 (INMODE):** Input mode selection.
  - 0: Count PHI2 pulses.
  - 1: Count CNT pulses.

- **Bit 2 (RUNMODE):** Run mode selection.
  - 0: One-shot mode.
  - 1: Continuous mode.

- **Bit 1 (ALARM):** Time-of-Day (TOD) clock alarm.
  - 0: TOD clock runs normally.
  - 1: TOD clock is stopped and can be set.

- **Bit 0 (SPMODE):** Serial port mode.
  - 0: Serial port input mode.
  - 1: Serial port output mode.

**Example Bit Encoding:**

To configure Timer A to start immediately in continuous mode, counting PHI2 pulses, with pulse output mode enabled on PB6:

- **START (Bit 7):** 1 (Start the timer)
- **PBON (Bit 6):** 1 (Enable timer output)
- **OUTMODE (Bit 5):** 0 (Pulse mode)
- **LOAD (Bit 4):** 0 (No immediate load)
- **INMODE (Bit 3):** 0 (Count PHI2 pulses)
- **RUNMODE (Bit 2):** 1 (Continuous mode)
- **ALARM (Bit 1):** 0 (TOD clock runs normally)
- **SPMODE (Bit 0):** 0 (Serial port input mode)

Binary representation: `11000010`

Hexadecimal representation: `$C2`

## Key Registers
- $DC04-$DC05 - CIA1 - Timer A low/high (latch/counter)
- $DC06-$DC07 - CIA1 - Timer B low/high (latch/counter)
- $DC0E - CIA1 - Control Register A (CRA) — START, LOAD (bit 4), IN/OUT modes
- $DC0F - CIA1 - Control Register B (CRB) — START, LOAD (bit 4), IN/OUT modes
- $DC01 - CIA1 - Port B (PRB) — PB6/PB7 (timer outputs)
- $DC03 - CIA1 - DDRB — direction for PB6/PB7
- $DD04-$DD05 - CIA2 - Timer A low/high (latch/counter)
- $DD06-$DD07 - CIA2 - Timer B low/high (latch/counter)
- $DD0E - CIA2 - Control Register A (CRA)
- $DD0F - CIA2 - Control Register B (CRB)
- $DD01 - CIA2 - Port B (PRB) — PB6/PB7
- $DD03 - CIA2 - DDRB

## References
- "timer_a_16bit" — expands on Timer A latch/counter behavior and outputs to PB6
- "timer_b_16bit" — expands on Timer B latch/counter behavior and cascading with Timer A
- "control_register_a" — expands on CRA bits for Timer A control (START, LOAD, INMODE, OUTMODE)
- "control_register_b" — expands on CRB bits for Timer B control (START, LOAD, INMODE, OUTMODE)

## Labels
- CRA
- CRB
- PRB
- DDRB
