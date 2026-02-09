# CIA #1 Control Registers A/B ($DC0E/$DC0F)

**Summary:** Definitions for CIA1 Control Register A ($DC0E) and Control Register B ($DC0F): TOD frequency (50/60 Hz), serial I/O direction, Timer A count source, force-load, one-shot vs continuous, PB6 output mode/enable, start/stop; and Timer B mode select plus B[4:0] mirroring A[4:0].

## Overview
This chunk documents the bit fields of CIA #1 control registers at $DC0E (Control Register A) and $DC0F (Control Register B). Control Register A configures Time-of-Day (TOD) frequency and serial port direction and fully controls Timer A (count source, force-load, run mode, output behavior on PB6, and start/stop). Control Register B selects Timer B count mode (three alternative count sources plus a conditional mode) and uses bits 4-0 to provide the same control bits for Timer B that Control Register A provides for Timer A. Bit 7 of $DC0F selects between setting the alarm or setting the clock for the TOD.

Notes:
- "Force load" causes the timer latch value to be transferred into the active counter (loads latch immediately). (short parenthetical)
- PB6 control covers both enabling the timer-driven output on PB6 and selecting whether the timer output toggles or produces a pulse.

## Source Code
```text
   HEX      DECIMAL        BITS                 DESCRIPTION
  -------------------------------------------------------------------------

  DC0E       56334                 CIA Control Register A
                            7      Time-of-Day Clock Frequency: 1 = 50 Hz,
                                     0 = 60 Hz
                            6      Serial Port I/O Mode Output, 0 = Input

                            5      Timer A Counts: 1 = CNT Signals,
                                     0 = System 02 Clock
                            4      Force Load Timer A: 1 = Yes
                            3      Timer A Run Mode: 1 = One-Shot,
                                     0 = Continuous
                            2      Timer A Output Mode to PB6: 1 = Toggle,
                                     0 = Pulse
                            1      Timer A Output on PB6: 1 = Yes, 0 = No
                            0      Start/Stop Timer A: 1 = Start, 0 = Stop

  DC0F       56335                 CIA Control Register B
                            7      Set Alarm/TOD-Clock: 1 = Alarm,
                                     0 = Clock
                            6-5    Timer B Mode Select:
                                     00 = Count System 02 Clock Pulses
                                     01 = Count Positive CNT Transitions
                                     10 = Count Timer A Underflow Pulses
                                     11 = Count Timer A Underflows While
                                       CNT Positive
                            4-0    Same as CIA Control Reg. A - for Timer B
```

## Key Registers
- $DC0E-$DC0F - CIA1 - Control Register A (Timer A, serial, TOD freq) and Control Register B (Timer B mode + mirrored A bits)

## References
- "cia1_time_of_day_and_interrupts" — expands on interrupts and TOD registers affected by these controls
- "cia2_overview_and_dd00_port_a" — expands on CIA #2 mapping and related port behavior