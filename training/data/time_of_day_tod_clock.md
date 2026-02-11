# CIA Time Of Day (TOD) Clock — 24-hour BCD clock, 1/10s resolution, ALARM, latching

**Summary:** TOD is a 24-hour (AM/PM) BCD clock with 1/10 second resolution in each CIA. Registers are 10ths/seconds/minutes/hours (BCD) with AM/PM in Hours MSB; external 60/50 Hz TTL TOD pin required; ALARM shares TOD addresses (write-only) and CRB7 selects TOD vs ALARM on writes. Read/write sequencing and latching rules preserve consistent multi-register reads.

## Time Of Day Clock (TOD)
The TOD provides real-time timekeeping inside each CIA (1 and 2). Key facts:
- Resolution: 1/10 second, counts in BCD.
- Registers (per CIA): 10ths, Seconds, Minutes, Hours (BCD). Hours MSB bit is the AM/PM flag (testable).
- External timing source: requires a TTL-level TOD pin input at 60 Hz or 50 Hz (programmable) for accurate timekeeping.
- ALARM: programmable alarm registers share the same addresses as the TOD registers; the ALARM is write-only. Any read of those addresses always returns the current TOD regardless of ALARM select.
- Format: All TOD registers are in BCD to simplify display/driving circuits.

## Read / Write / Latching behavior
- Latching on read: Because carries between fields (e.g., seconds->minutes) can occur at any time, the CIA latches the four TOD output registers when the Hours register is read. The four registers remain latched until after a read of the 10ths register. The TOD hardware continues to count even while the read registers are latched.
  - Practical consequence: to read a consistent snapshot, read Hours first (this latches all registers) and finish by reading 10ths (which releases the latch).
  - If only one register is read and it is not Hours, it may be read "on the fly" without using the latch sequence; however, any read of Hours must be followed by a read of 10ths to disable latching.
- Write sequencing:
  - Writing the Hours register automatically stops the TOD counting. This guarantees you can set hours without the clock advancing mid-write.
  - The clock will not restart until a write to the 10ths register is performed. Thus the correct sequence to set TOD is: write Hours (stops), write Minutes/Seconds as needed, write 10ths (restarts).
- ALARM access and CRB7:
  - The same TOD register addresses are used for ALARM registers when writing.
  - A Control Register B bit (CRB7) selects whether a write to those addresses sets the TOD clock (CRB7 = 0) or programs the ALARM (CRB7 = 1).
  - ALARM registers are write-only; reads always return the live TOD regardless of CRB7.

## Source Code
```text
READ
 REG  NAME     Bit7  Bit6 Bit5 Bit4 Bit3 Bit2 Bit1 Bit0
 +-----+---------+------+------+------+------+------+------+------+
 |  8  |TOD 10THS|  0   |  0   |  0   |  0   |  T8  |  T4  |  T2  |  T1  |
 |  9  |TOD SEC  |  0   |  SH4 |  SH2 |  SH1 |  SL8 |  SL4 |  SL2 |  SL1 |
 |  A  |TOD MIN  |  0   |  MH4 |  MH2 |  MH1 |  ML8 |  ML4 |  ML2 |  ML1 |
 |  B  |TOD HR   |  PM  |  0   |  0   |  HH  |  HL8 |  HL4 |  HL2 |  HL1 |
 +-----+---------+------+------+------+------+------+------+------+------+

WRITE
 CRB7=0 TOD
 CRB7=1 ALARM
 (SAME FORMAT AS READ)
```

## Key Registers
- $DC08-$DC0B - CIA 1 - TOD 10ths / Seconds / Minutes / Hours (BCD, Hours MSB = AM/PM). ALARM shares addresses; write selected by CRB7.
- $DD08-$DD0B - CIA 2 - TOD 10ths / Seconds / Minutes / Hours (BCD, Hours MSB = AM/PM). ALARM shares addresses; write selected by CRB7.

## References
- "control_registers_cra_crb" — expands on CRB7 selects whether TOD register writes set ALARM or TOD clock
- "interrupt_control_icr" — expands on TOD ALARM as an interrupt source masked/reported by the ICR