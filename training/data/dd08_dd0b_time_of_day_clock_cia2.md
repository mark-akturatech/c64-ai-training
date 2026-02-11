# CIA #2 Time of Day Clock Registers ($DD08-$DD0B)

**Summary:** CIA #2 (6526) Time-of-Day (TOD) clock registers at $DD08-$DD0B store tenths, seconds, minutes and hours in packed BCD with an AM/PM flag (bit 7 of $DD0B). The C64 OS does not use these CIA #2 TOD registers; they mirror the format of CIA #1 TOD at $DC08-$DC0B.

## Description
The 6526 CIA includes a Time-of-Day (TOD) clock presenting human-readable time fields in BCD. CIA #2 provides the same four-register TOD format as CIA #1; these four registers are unused by the C64 Operating System but are available for software to read or maintain a real-time clock.

- $DD08 TO2TEN: tenths of seconds (BCD low digit).
- $DD09 TO2SEC: seconds in BCD (units and tens split across bit fields).
- $DD0A TO2MIN: minutes in BCD (units and tens split across bit fields).
- $DD0B TO2HRS: hours in BCD with AM/PM flag in bit 7; hours tens/units split across bit fields.

All numeric fields are BCD. Bit positions not explicitly used are reserved/unused.

## Source Code
```text
$DD08        TO2TEN       Time of Day Clock - Tenths of Seconds
                     Bits 0-3 : Time-of-Day tenths of second digit (BCD, 0-9)
                     Bits 4-7 : Unused

$DD09        TO2SEC       Time of Day Clock - Seconds
                     Bits 0-3 : Second (units) digit (BCD, 0-9)
                     Bits 4-6 : Second (tens) digit (BCD, 0-5)
                     Bit 7   : Unused

$DD0A        TO2MIN       Time of Day Clock - Minutes
                     Bits 0-3 : Minute (units) digit (BCD, 0-9)
                     Bits 4-6 : Minute (tens) digit (BCD, 0-5)
                     Bit 7   : Unused

$DD0B        TO2HRS       Time of Day Clock - Hours
                     Bits 0-3 : Hour (units) digit (BCD, 0-9)
                     Bit 4   : Hour (tens) digit (BCD, 0-2)
                     Bits 5-6: Unused
                     Bit 7   : AM/PM flag (1 = PM, 0 = AM)
```

## Key Registers
- $DD08-$DD0B - CIA 2 - Time of Day Clock (TO2TEN, TO2SEC, TO2MIN, TO2HRS; BCD fields, AM/PM bit at $DD0B bit7)

## References
- "dc08_dc0b_time_of_day_registers" — CIA #1 Time of Day Clock registers and format (same layout)

## Labels
- TO2TEN
- TO2SEC
- TO2MIN
- TO2HRS
