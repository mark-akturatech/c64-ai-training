# $DC08-$DC0B — Time of Day (TOD) Clock (6526 CIA)

**Summary:** $DC08-$DC0B are the 6526 CIA Time-of-Day (TOD) registers (BCD): tenths, seconds, minutes, hours; hours bit 7 = AM/PM; reading or writing hours latches the register set until tenths is read/written. The TOD has an alarm that can generate an IRQ when enabled.

**Overview**
The CIA TOD clock is a human-readable clock implemented as four BCD bytes (each byte contains two 4-bit decimal digits). The register order (low → high) is tenths, seconds, minutes, hours. Each register stores its value in packed BCD (high nybble = tens digit, low nybble = ones digit). Bit 7 of the hours register is used as the AM/PM flag (1 = PM, 0 = AM).

Reading behavior:
- Reading the hours register latches the TOD register outputs — the CIA stops updating the readable register values to prevent mid-read rollovers.
- The latch remains in effect until the tenths-of-seconds register is read; only then do the readable registers resume updating.
- If you read only minutes, seconds, or tenths (and do not read hours first), no latching occurs.
- Internally the clock continues to advance even while the readable registers are latched; the latch only freezes the outputs.

Writing behavior:
- Writing to the TOD registers either sets the current time or programs the alarm, depending on the control bit mentioned below.
- When writing hours, the CIA latches the TOD write sequence in the same way as reads: the latch persists until the tenths register is written (complete write sequence required to resume normal operation).

Alarm and interrupts:
- The TOD includes an alarm (compare) that can generate an interrupt (IRQ) when the alarm time matches the TOD and the corresponding interrupt is enabled.
- Enabling or routing the TOD alarm interrupt requires configuration via the CIA control/interrupt registers (see References).

Use cases:
- High-level timing and human-readable timestamps (hours/minutes/seconds/tenths).
- Source of pseudo-random seed in BASIC (reading TOD to seed RND).
- Precise timed events via the alarm + IRQ when properly enabled.

## Key Registers
- $DC08-$DC0B - CIA (6526) - Time of Day Clock registers: Tenths, Seconds, Minutes, Hours (BCD; hours bit7 = AM/PM; read/write latching behavior)

## References
- "dc0d_ciaicr_interrupt_control_register" — enabling TOD alarm interrupt via CIA interrupt/control registers (details on enabling and clearing TOD IRQ)

## Labels
- TOD
- TOD_TENTHS
- TOD_SECONDS
- TOD_MINUTES
- TOD_HOURS
