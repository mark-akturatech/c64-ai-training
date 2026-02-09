# CIA Control Register A (CIACRA) — $DC0E / 56334

**Summary:** CIACRA ($DC0E) on CIA 1 controls Timer A start/stop, one-shot/continuous mode, Timer A output on Port B (Bit 6), Port B output form (toggle or pulse), forced load of Timer A latch, Timer A count source (CPU cycles or CNT pin), serial port direction, and TOD frequency selection (50/60 Hz).

## Description
CIACRA is an 8-bit control register whose bits are assigned as follows:

- Bits 0–3: Timer A control (start/stop, one-shot vs continuous, plus related functions).
  - Bit 0 starts (1) or stops (0) Timer A.
  - Bit 3 selects one-shot (1) or continuous (0) mode.
  - One-shot behavior: timer counts down to 0, reloads the counter from the latch, then Bit 0 is cleared (timer stops).
  - Continuous behavior: timer counts down to 0, reloads the latch and continues counting automatically.
- Bits 1–2: Force a Timer A–driven output on Port B bit 6 (overrides DDRB and normal Port B value) and select the output form:
  - Bit 1 = 1 enables Timer A output on Port B bit 6.
  - Bit 2 = 1 makes Port B bit 6 toggle (invert) each time the timer underflows.
  - Bit 2 = 0 produces a single pulse on Port B bit 6 of one machine-cycle duration when the timer underflows.
  - This forced output overrides the Data Direction Register B (DDRB) and the Port B data value for bit 6.
- Bit 4: Force-load strobe. Writing 1 causes the value previously written to Timer A Low/High byte registers (the latch) to be loaded into the Timer A counter immediately. The bit has no stored data and no significance on read.
- Bit 5: Timer A count source selection.
  - Bit 5 = 1: count microprocessor machine cycles (~1,022,730 Hz on C64).
  - Bit 5 = 0: count pulses on the CNT input (User Port pin 4). Useful for frequency/event counting and pulse-width/delay measurement of external signals.
- Bit 6: Serial port direction selection for the serial register at $DC0C (see serial register documentation).
  - Bit 6 = 1: serial port is an output.
  - Bit 6 = 0: serial port is an input.
- Bit 7: Time-of-Day (TOD) clock frequency selection.
  - Bit 7 = 1: TOD expects 50 Hz on the TOD pin.
  - Bit 7 = 0: TOD expects 60 Hz (C64 uses 60 Hz by default).

Use cases: Timer A can be used as an event/frequency counter (CNT pin), as a precise CPU-cycle timer, or to generate timed pulses/toggles on Port B bit 6. Forced load (Bit 4) lets software synchronously reload the timer latch into the counter.

## Source Code
```text
56334         $DC0E          CIACRA
Control Register A

Bit 0:  Start Timer A (1=start, 0=stop)
Bit 1:  Select Timer A output on Port B (1=Timer A output appears on Bit 6 of
        Port B)
Bit 2:  Port B output mode (1=toggle Bit 6, 0=pulse Bit 6 for one cycle)
Bit 3:  Timer A run mode (1=one-shot, 0=continuous)
Bit 4:  Force latched value to be loaded to Timer A counter (1=force load
        strobe)
Bit 5:  Timer A input mode (1=count microprocessor cycles, 0=count signals on
        CNT line at pin 4 of User Port)
Bit 6:  Serial Port (56332, $DC0C) mode (1=output, 0=input)
Bit 7:  Time of Day Clock frequency (1=50 Hz required on TOD pin, 0=60 Hz)

Bits 0-3.  This nybble controls Timer A.  Bit 0 is set to 1 to start
the timer counting down, and set to 0 to stop it.  Bit 3 sets the
timer for one-shot or continuous mode.

In one-shot mode, the timer counts down to 0, sets the counter value
back to the latch value, and then sets Bit 0 back to 0 to stop the
timer.  In continuous mode, it reloads the latch value and starts all
over again.

Bits 1 and 2 allow you to send a signal on Bit 6 of Data Port B when
the timer counts.  Setting Bit 1 to 1 forces this output (which
overrides the Data Direction Register B Bit 6, and the normal Data
Port B value).  Bit 2 allows you to choose the form this output to Bit
6 of Data Port B will take.  Setting Bit 2 to a value of 1 will cause
Bit 6 to toggle to the opposite value when the timer runs down (a
value of 1 will change to 0, and a value of 0 will change to 1).
Setting Bit 2 to a value of 0 will cause a single pulse of a one
machine-cycle duration (about a millionth of a second) to occur.

Bit 4.  This bit is used to load the Timer A counter with the value
that was previously written to the Timer Low and High Byte Registers.
Writing a 1 to this bit will force the load (although there is no data
stored here, and the bit has no significance on a read).

Bit 5.  Bit 5 is used to control just what it is Timer A is counting.
If this bit is set to 1, it counts the microprocessor machine cycles
(which occur at the rate of 1,022,730 cycles per second).  If the bit
is set to 0, the timer counts pulses on the CNT line, which is
connected to pin 4 of the User Port.  This allows you to use the CIA
as a frequency counter or an event counter, or to measure pulse width
or delay times of external signals.

Bit 6.  Whether the Serial Port Register is currently inputting or
outputting data (see the entry for that register at 56332 ($DC0C) for
more information) is controlled by this bit.

Bit 7.  This bit allows you to select from software whether the Time
of Day Clock will use a 50 Hz or 60 Hz signal on the TOD pin in order
to keep accurate time (the 64 uses a 60 Hz signal on that pin).
```

## Key Registers
- $DC00-$DC0F - CIA 1 - Timer A/B, Port A/B, Serial, TOD, Interrupt and Control registers (includes CIACRA at $DC0E)

## References
- "data_port_b_timer_output" — expands on effects of Bits 1-2 on Port B outputs
- "tod_registers_list_and_serial_data_port" — expands on Bit 6 serial port direction and Bit 7 TOD frequency