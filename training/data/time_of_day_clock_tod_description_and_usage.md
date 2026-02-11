# 6526 CIA — Time Of Day (TOD) Clock ($DC08-$DC0B)

**Summary:** 6526 CIA TOD registers at $DC08-$DC0B (tenths, seconds, minutes, hours) store time in BCD; hours register bit 7 = AM/PM (1 = PM). Reading or writing the hours register latches the TOD registers until the tenths register is read/written. Control Register B ($DC0F) bit 7 selects whether TOD writes set the alarm or the clock. TOD has an alarm that can trigger a CIA interrupt; BASIC RND(0) uses seconds+tenths as a seed.

## Description
The CIA contains a Time Of Day (TOD) clock implemented with four BCD registers (tenths, seconds, minutes, hours). Each register holds two BCD digits (high nybble = tens, low nybble = units). Typical ranges:
- Tenths: 0–9 (low nybble), high nybble unused/0.
- Seconds / Minutes: 00–59 (tens = 0–5).
- Hours: stored in 12-hour BCD with an AM/PM flag in bit 7 of the hours byte (1 = PM). Tens nybble for hours uses 0–1 for 1–12.

Latch behavior:
- Reading the hours register latches (freezes) the four TOD registers so they stop updating in the readable registers; the internal clock continues counting, but the register values presented to the CPU remain constant until the tenths register is read — reading tenths releases the latch and updates the registers again.
- Writing the hours register similarly latches writes: subsequent writes to minutes/seconds/tenths are held as part of the same atomic update; writing the tenths register completes the write sequence and restarts normal clock updates.
- This latch prevents inconsistent multi-byte reads (e.g., reading hours then minutes while seconds roll over).

Alarm and control:
- TOD registers can either set the running clock or set the alarm, depending on Control Register B (CIA CRB) bit 7 at $DC0F: when CRB bit 7 = 1, writes to TOD registers set the alarm; when CRB bit 7 = 0, writes set the time.
- The alarm, when matched, triggers a CIA interrupt (the ICR bit for the TOD alarm is documented elsewhere — see ciaicr_interrupt_control).

OS and usage notes:
- Commodore BASIC’s RND(0) uses the seconds and tenths registers to seed the PRNG; this is imperfect because the OS does not reliably start TOD and because BCD limits entropy.
- TOD persists across many resets and is generally more reliable than the software clock maintained by a Timer A IRQ (system clock areas documented at $A0-$A2).
- TOD is convenient for elapsed-time measurements (set to 00:00:00.0 and read later).

**[Note: Source may contain an error — original text shows "locations 60-162 ($A0-$A2)"; correct system clock zero-page locations are commonly $A0-$A2 (decimal 160–162).]**

## Source Code
```text
6526 CIA Time Of Day registers (C64 addresses)

$DC08 (56328) - TOD Tenths of seconds (BCD)
  - Low nybble: tenths 0-9
  - High nybble: typically 0
  - Reading/writing tenths releases the read/write latch when hours was previously accessed.

$DC09 (56329) - TOD Seconds (BCD)
  - Low nybble: units 0-9
  - High nybble: tens 0-5 (00-59 seconds)

$DC0A (56330) - TOD Minutes (BCD)
  - Low nybble: units 0-9
  - High nybble: tens 0-5 (00-59 minutes)

$DC0B (56331) - TOD Hours (BCD + AM/PM)
  - Low nybble: units 0-9
  - High nybble: tens 0-1 (for 1–12 hour BCD)
  - Bit 7 (MSB): AM/PM flag (1 = PM, 0 = AM)
  - Reading this register latches the TOD read sequence; writing this register latches a multibyte write until tenths is written.

$DC0F (56335) - CIA Control Register B (CRB)
  - Bit 7 selects TOD write target:
    - 0 = writes to $DC08-$DC0B set the Time Of Day clock
    - 1 = writes to $DC08-$DC0B set the TOD alarm

BCD examples:
  - 10 o'clock: hours byte = %00010000 (high nybble 1, low 0) = $10
  - 11:23:45.6 -> Hours: $11 (AM/PM in bit7 as needed), Minutes: $23, Seconds: $45, Tenths: $06

Behavior notes:
  - Read sequence: read $DC0B (hours) → $DC08 (tenths) to release latch.
  - Write sequence: write $DC0B (hours) → write $DC08 (tenths) to commit clock/alarm change.
```

## Key Registers
- $DC08-$DC0B - CIA - Time Of Day registers (Tenths, Seconds, Minutes, Hours; BCD; hours bit7 = AM/PM)
- $DC0F - CIA - Control Register B (bit 7 selects TOD writes set alarm vs clock)

## References
- "tod_registers_list" — expands on addresses and bit layouts for TOD registers
- "ciaicr_interrupt_control" — explains TOD alarm interrupt source in the CIA ICR