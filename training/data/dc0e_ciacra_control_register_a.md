# CIACRA ($DC0E) — CIA A Control Register A

**Summary:** CIACRA ($DC0E) is the CIA A Control Register A controlling Timer A (start/stop, one-shot/continuous, load, input source, and Port B output behaviour), serial direction (bit 6), and TOD clock frequency selection (bit 7).

## Control and behaviour
Bits 0–3 control Timer A operation: bit 0 starts/stops the countdown; bit 3 selects one-shot (1) or continuous (0) mode. In one-shot mode the timer counts down to 0, reloads the latch value, and clears bit 0 to stop. In continuous mode the latch value is reloaded and counting restarts automatically.

Bits 1–2 control an output on Port B bit 6 when the timer counts down. Setting bit 1 forces the Timer A output to appear on Port B bit 6 (this overrides DDRB bit 6 and the normal Port B output). Bit 2 selects the waveform applied to Port B bit 6: 1 = toggle the bit on each underflow; 0 = produce a single machine-cycle pulse on underflow.

Bit 4 is a write-only force-load strobe: writing 1 loads the Timer A counter from its latch (Timer Low/High bytes previously written). The bit has no meaningful value when read.

Bit 5 selects the Timer A input source: 1 = count CPU machine cycles (1,022,730 cycles/sec); 0 = count pulses on CNT (pin 4 of the User Port). This allows Timer A to be used as a frequency/event counter or pulse-width/delay measurement for external signals.

Bit 6 selects the direction of the serial port (see $DC0C): 1 = serial port output, 0 = serial port input.

Bit 7 selects the required TOD (Time-of-Day) clock frequency on the TOD pin: 1 = 50 Hz required on the TOD pin, 0 = 60 Hz required.

## Source Code
```text
$DC0E        CIACRA       Control Register A

                     0    Start Timer A (1=start, 0=stop)
                     1    Select Timer A output on Port B (1=Timer A output appears on Bit 6 of
                            Port B)
                     2    Port B output mode (1=toggle Bit 6, 0=pulse Bit 6 for one cycle)
                     3    Timer A run mode (1=one-shot, 0=continuous)
                     4    Force latched value to be loaded to Timer A counter (1=force load
                            strobe)
                     5    Timer A input mode (1=count microprocessor cycles, 0=count signals on
                            CNT line at pin 4 of User Port)
                     6    Serial Port (56332, $DC0C) mode (1=output, 0=input)
                     7    Time of Day Clock frequency (1=50 Hz required on TOD pin, 0=60 Hz)

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
```

## Key Registers
- $DC0E - CIA A - Control Register A (Timer A control, Port B timer output, serial direction, TOD frequency select)

## References
- "dc04_dc07_timers" — expands on How Control Register A manipulates timer behavior and modes
- "dc0c_serial_data_register" — expands on Serial mode controlled by bit6 of this register

## Labels
- CIACRA
