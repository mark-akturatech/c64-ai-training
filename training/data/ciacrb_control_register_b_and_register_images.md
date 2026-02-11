# CIA Control Register B (CIACRB) — $DC0F (56335)

**Summary:** CIACRB ($DC0F) is CIA#1 Control Register B for Timer B: start/stop, output on Port B (Bit 7), output mode (toggle/pulse), one‑shot/continuous, force load strobe, Timer B input mode (CPU cycles / CNT pulses / Timer A underflows / Timer A underflows gated by CNT), and TOD write select (alarm vs clock). Also documents CIA register image mirroring across $DC10–$DCFF; use the base $DC00-$DC0F addresses.

## Description
CIACRB ($DC0F) controls Timer B behaviour and how Timer B interacts with Port B, the CNT line, Timer A, and the Time‑Of‑Day (TOD) registers.

Bit definitions
- Bit 0 — Start Timer B: 1 = start, 0 = stop.
- Bit 1 — Timer B output on Port B: 1 = Timer B output appears on Port B Bit 7.
- Bit 2 — Port B output mode: 1 = toggle Bit 7, 0 = pulse Bit 7 for one cycle.
- Bit 3 — Timer B run mode: 1 = one‑shot, 0 = continuous.
- Bit 4 — Force load strobe: 1 = force latched value to be loaded into Timer B counter.
- Bits 5–6 — Timer B input mode (select what Timer B counts):
  - 00 = counts microprocessor machine cycles (1,022,730 cycles/second).
  - 01 = counts CNT line pulses (pin 4 of User Port).
  - 10 = counts Timer A underflow pulses (used to link A+B into a 32‑bit counter).
  - 11 = counts Timer A underflow pulses only when CNT pulses are present.
  - Note: the "Timer A underflow" modes allow linking Timer A and Timer B into a 32‑bit timer (counts up to ~70 minutes with ~1/15 s resolution).
- Bit 7 — TOD write select: 0 = writing TOD registers sets the TOD clock; 1 = writing TOD registers sets the ALARM time.

Relationship to Control Register A
- Bits 0–3 perform the same Timer control functions as CIACRA bits 0–3 (for Timer A), except Timer B output appears on Port B Bit 7 (not Bit 6).

CIA register image mirroring
- The CIA decodes only the low 4 bits of the register address, so the 16‑byte register image at $DC00–$DC0F is mirrored across the 256‑byte block $DC00–$DCFF (every 16‑byte area is identical). For clarity and portability, use the chip base addresses ($DC00–$DC0F) in programs rather than higher mirror addresses.

## Source Code
```text
56335         $DC0F          CIACRB
Control Register B

Bit 0:  Start Timer B (1=start, 0=stop)
Bit 1:  Select Timer B output on Port B (1=Timer B output appears on
        Bit 7 of Port B)
Bit 2:  Port B output mode (1=toggle Bit 7, 0=pulse Bit 7 for one
        cycle)
Bit 3:  Timer B run mode (1=one-shot, 0=continuous)
Bit 4:  Force latched value to be loaded to Timer B counter (1=force
        load strobe)
Bits 5-6:  Timer B input mode
           00 = Timer B counts microprocessor cycles
           01 = Count signals on CNT line at pin 4 of User Port
           10 = Count each time that Timer A counts down to 0
           11 = Count Timer A 0's when CNT pulses are also present
Bit 7:  Select Time of Day write (0=writing to TOD registers sets
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

Location Range: 56336-56575 ($DC10-$DCFF)
CIA #1 Register Images

Since the CIA chip requires only enough addressing lines to handle 16
registers, none of the higher bits are decoded when addressing the
256-byte area that has been assigned to it.  The result is that every
16-byte area in this 256-byte block is a mirror of every other.  Even
so, for the sake of clarity in your programs it is advisable to use
the base address of the chip, and not use the higher addresses to
communicate with the chip.
```

## Key Registers
- $DC0F - CIA1 - Control Register B (CIACRB): Timer B control bits (start/stop, Port B output Bit 7, output mode, one‑shot/continuous, force load, input mode bits, TOD write select)
- $DC00-$DC0F - CIA1 - CIA register block (mirrored across $DC10-$DCFF); use base $DC00-$DC0F in code

## References
- "ciaicr_interrupt_control" — interaction of timer underflows and interrupt flags

## Labels
- CIACRB
