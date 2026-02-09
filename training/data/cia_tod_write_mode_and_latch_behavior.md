# CIA Time-of-Day (TOD) write mode and latch — $DC0F / $DC08-$DC0B

**Summary:** Describes CIA1 TOD register behavior (write-mode select and latch) controlled by $DC0F, and the TOD registers at $DC08-$DC0B. Notes BASIC RND seeding from TOD seconds/tenths and TOD advantages over the software clock ($00A0-$00A2) and IRQ-based timers.

## Behavior of TOD writes and latch
- $DC0F contains a control bit that selects the effect of writes to the Time-of-Day (TOD) registers: when the bit is 1, writes to the TOD registers write the alarm; when 0, writes set the TOD clock itself. (Source text refers to this as the CIACRB control of TOD write/select.)
- There is a latch function associated with the TOD register access (the same latch used when reading the TOD registers). Writing to the hours register stops the TOD clock from updating (the clock is latched). The TOD will not resume updating until a write to the tenths-of-seconds register occurs.
- Practical consequence: to set the TOD clock reliably, write the hours (this latches the clock), then write down through to the tenths — the final write to the tenths restarts the clock with the new value latched in.
- The C64 BASIC RND(0) routine samples the TOD seconds and tenths registers for its seed (seconds + tenths-of-seconds are used as part of the seed value).
- Advantages of the TOD clock over the software clock maintained by the Timer A IRQ (locations $00A0-$00A2):
  - Higher accuracy than the software clock maintained in RAM by an IRQ routine.
  - Not disrupted if the Timer A IRQ is delayed or the IRQ vector is diverted.
  - Survives a cold-start RESET (remains running across a reset).
  - Useful for elapsed-time measurement: set TOD to 00:00:00:0 and read elapsed hours:minutes:seconds:tenths.

## Source Code
(omitted — no code or register bitmaps provided in this chunk)

## Key Registers
- $DC08-$DC0B - CIA1 - Time-of-Day registers: tenths ($DC08), seconds ($DC09), minutes ($DC0A), hours ($DC0B)
- $DC0F - CIA1 - Control register (CIACRB) bit that selects whether writes to TOD registers set the alarm or set the TOD clock
- $00A0-$00A2 - RAM - Software clock maintained by Timer A IRQ (compared in text to TOD advantages)

## References
- "dc0f_control_register_b_cia1" — expands on Control of TOD write/select via CIACRB ($DC0F)
- "dc08_dc0b_time_of_day_registers" — expands on individual TOD registers (tenths, seconds, minutes, hours)
- "basic_tod_clock_example" — BASIC example that reads/writes TOD registers