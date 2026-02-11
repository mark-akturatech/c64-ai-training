# CIA #2 Control Register A (CI2CRA) — $DD0E

**Summary:** CIA 2 Control Register A at $DD0E configures Timer A operation (start/stop, one-shot/continuous, force load, input source), routes Timer A output to Port B bit 6 (PB6) with toggle/pulse modes, selects serial port direction (related to $DD0C), and selects TOD clock frequency (50/60 Hz).

## Description
CI2CRA ($DD0E) is the Control Register A for CIA #2. It controls Timer A behavior (start/stop, run mode, force-load), selects whether Timer A output appears on Port B bit 6 and how it drives that pin (toggle vs pulse), chooses Timer A input source (CPU cycles or external CNT line), configures the serial port direction (see CI2SDR at $DD0C), and selects the Time-of-Day clock frequency (50 Hz vs 60 Hz). The full bit-level field definitions are provided in the Source Code section below.

## Source Code
```text
$DD0E-$DD0F               See locations 56334 and 56334 for details

$DD0E        CI2CRA       Control Register A

                     Bit 0    Start Timer A (1 = start, 0 = stop)
                     Bit 1    Select Timer A output on Port B (1 = Timer A output appears on
                              Bit 6 of Port B)
                     Bit 2    Port B output mode (1 = toggle Bit 6, 0 = pulse Bit 6 for one
                              cycle)
                     Bit 3    Timer A run mode (1 = one-shot, 0 = continuous)
                     Bit 4    Force latched value to be loaded to Timer A counter (1 = force
                              load strobe)
                     Bit 5    Timer A input mode (1 = count microprocessor cycles, 0 = count
                              signals on CNT line at pin 4 of User Port)
                     Bit 6    Serial Port mode (see $DD0C CI2SDR) (1 = output, 0 = input)
                     Bit 7    Time of Day Clock frequency (1 = 50 Hz required on TOD pin,
                              0 = 60 Hz)
```

## Key Registers
- $DD0E-$DD0F - CIA 2 - Control Register A (CI2CRA) — Timer A control, PB6 output selection, serial direction, TOD frequency select

## References
- "dd04_dd07_timers_overview" — expands on Timer A control explained here
- "dd0c_ci2sdr_serial_data_port" — expands on bit 6 selecting serial direction (CI2SDR $DD0C)

## Labels
- CI2CRA
