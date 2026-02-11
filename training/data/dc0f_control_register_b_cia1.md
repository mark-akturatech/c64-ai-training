# CIA 1 Control Register B ($DC0F) — CIACRB

**Summary:** CIACRB ($DC0F) is the CIA#1 Control Register B that controls Timer B start/stop, output on Port B (PB7), output mode (toggle/pulse), one-shot/continuous operation, forced latch load, Timer B input source (CPU cycles, CNT, Timer A underflows, combined CNT+TimerA), and Time-of-Day (TOD) write behavior (sets alarm vs sets clock).

## Description
CIACRB is an 8-bit control register for Timer B in CIA #1. The low nibble (bits 0–3) provides the same start/stop, output enable, output-mode, and run-mode controls that Control Register A (CIACRA) provides for Timer A — with the difference that Timer B’s external output appears on Port B bit 7 (PB7) rather than Port B bit 6.

Bits 5–6 select Timer B’s clock/input source:
- 00: Timer B counts microprocessor machine cycles (≈ 1,022,730 cycles/sec).
- 01: Timer B counts pulses on the CNT line (User Port pin 4).
- 10: Timer B increments on each Timer A underflow (linking A→B).
- 11: Timer B increments on Timer A underflow only when a CNT pulse is present (A underflow gated by CNT).

Linking Timer A and Timer B (bits = 10 or 11) allows forming a chained counter (effectively 32-bit across A and B) enabling long-duration timing (up to ~70 minutes) with resolution determined by Timer A. Use the forced-load bit (bit 4) to transfer the latch to the counter as needed.

Bit 7 controls write behavior for the Time-of-Day registers:
- 0 = Writing TOD registers sets the TOD clock.
- 1 = Writing TOD registers sets the TOD alarm.

Use the forced-load strobe (bit 4) when you need to synchronously load Timer B from its latch. Bits 0–3 support one-shot vs continuous operation and configuring the PB7 output to either toggle or pulse upon Timer B underflow.

## Source Code
```text
$DC0F        CIACRB       Control Register B

                     0    Start Timer B (1=start, 0=stop)
                     1    Select Timer B output on Port B (1=Timer B output appears on
                            Bit 7 of Port B)
                     2    Port B output mode (1=toggle Bit 7, 0=pulse Bit 7 for one
                            cycle)
                     3    Timer B run mode (1=one-shot, 0=continuous)
                     4    Force latched value to be loaded to Timer B counter (1=force
                            load strobe)
                     5-6  Timer B input mode
                              00 = Timer B counts microprocessor cycles
                              01 = Count signals on CNT line at pin 4 of User Port
                              10 = Count each time that Timer A counts down to 0
                              11 = Count Timer A 0's when CNT pulses are also present
                     7    Select Time of Day write (0=writing to TOD registers sets
                          alarm, 1=writing to TOD registers sets clock)

                          Bits 0-3.  This nybble performs the same functions for Timer B that
                          Bits 0-3 of Control Register A perform for Timer A, except that Timer
                          B output on Data Port B appears at Bit 7, and not Bit 6.

                          Bits 5 and 6.  These two bits are used to select what Timer B counts.
                          If both bits are set to 0, Timer B counts the microprocessor machine
                          cycles (which occur at the rate of 1,022,730 cycles per second).  If
                          Bit 6 is set to 0 and Bit 5 is set to 1, Timer B counts pulses on the
                          CNT line, which is connected to pin 4 of the User Port.  If Bit 6 is
                          set to 1 and Bit 5 is set to 0, Timer B counts Timer A underflow
                          pulses, which is to say that it counts the number of times that Timer
                          A counts down to 0.  This is used to link the two numbers into one
                          32-bit timer that can count up to 70 minutes with accuracy to within
                          1/15 second.  Finally, if both bits are set to 1, Timer B counts the
                          number of times that Timer A counts down to 0 and there is a signal on
                          the CNT line (pin 4 of the User Port).

                          Bit 7.  Bit 7 controls what happens when you write to the Time of Day
                          registers.  If this bit is set to 1, writing to the TOD registers sets
                          the ALARM time.  If this bit is cleared to 0, writing to the TOD
                          registers sets the TOD clock.
```

## Key Registers
- $DC0F - CIA 1 - Control Register B (Timer B control: start/stop, PB7 output, toggle/pulse, one-shot/continuous, force-load, input-source select, TOD write mode)

## References
- "cia_tod_write_mode_and_latch_behavior" — expands on how CIACRB bit 7 affects TOD register writes
- "dc0e_control_register_a_cia1" — comparison with CIACRA Timer A bits

## Labels
- CIACRB
