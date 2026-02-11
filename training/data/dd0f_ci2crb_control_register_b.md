# CIA #2 Control Register B ($DD0F) (CI2CRB)

**Summary:** CIA 2 Control Register B at $DD0F (CI2CRB) controls Timer B start/stop, Timer B output routing and behavior on Port B, run mode (one-shot/continuous), force-load strobe, Timer B input source selection (CPU cycles / CNT / Timer A underflows), and the Time-of-Day (TOD) write select bit.

**Register description**
This register mirrors CIA#1 Control Register B (CIACRB) and is used to configure and control Timer B and related outputs on CIA 2.

Bit meanings:
- Bit 0 — Start Timer B: 1 = start, 0 = stop.
- Bit 1 — Timer B output on Port B: 1 = Timer B output appears on Port B bit 7.
- Bit 2 — Port B output mode: 1 = toggle PB7 on Timer B output, 0 = pulse PB7 for one cycle.
- Bit 3 — Timer B run mode: 1 = one-shot, 0 = continuous (reloads and repeats).
- Bit 4 — Force load: 1 = force latched value to be loaded into Timer B counter (strobe).
- Bits 5-6 — Timer B input mode (selects the event Timer B counts):
  - 00 = Timer B counts microprocessor cycles (CPU clock).
  - 01 = Timer B counts CNT line pulses (pin 4 of User Port).
  - 10 = Timer B counts when Timer A underflows (Timer A 0 events).
  - 11 = Timer B counts Timer A underflows only when CNT pulses are also present (combined mode).
- Bit 7 — TOD write select: 0 = writing to TOD registers sets the alarm, 1 = writing sets the clock.

**Note:** The original source used "ROD registers" for Bit 7; this has been corrected to "TOD registers" (Time-Of-Day) based on authoritative sources.

Behavioral notes:
- Bit 4 is a strobe: setting it forces the latched word into the live Timer B counter.
- Bits 5-6 change the clock source for Timer B; mode 10/11 link Timer B to Timer A underflows.
- Bit 2 determines whether PB7 is toggled each Timer B event (square wave) or pulsed for a single cycle per event.

## Source Code
```text
$DD0F        CI2CRB       Control Register B

                     0    Start Timer B (1=start, 0=stop)
                     1    Select Timer B output on Port B (1=Timer B output appears on
                          Bit 7 of Port B)
                     2    Port B output mode (1=toggle Bit 7, 0=pulse Bit 7 for one
                            cycle)
                     3    Timer B run mode (1=one shot, 0=continuous)
                     4    Force latched value to be loaded to Timer B counter (1=force
                            load strobe)
                     5-6  Timer B input mode
                              00 = Timer B counts microprocessor cycles
                              01 = Count signals on CNT line at pin 4 of User Port
                              10 = Count each time that Timer A counts down to 0
                              11 = Count Timer A 0's when CNT pulses are also present
                     7    Select Time of Day write (0=writing to TOD registers sets
                            alarm, 1=writing to TOD registers sets clock)
```

## Key Registers
- $DD0F - CIA-II - Control Register B (Timer B start/stop, PB7 output/toggle/pulse, run mode, force-load strobe, Timer B input source, TOD write select)

## References
- "dd08_dd0b_time_of_day_clock_cia2" — expands on Bit 7 TOD write behavior and how TOD vs alarm writes are selected  
- "dd04_dd07_timers_overview" — expands on Timer B mode selections and linking with Timer A

## Labels
- CI2CRB
