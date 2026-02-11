# Jiffy count constants in ROM ($BF3A-$BF4E)

**Summary:** Jiffy-count constants in the C64 ROM at $BF3A–$BF4E used by the ROM clock/time routines; contains signed jiffy values for each time-digit position (10s hours, hours, 10s minutes, minutes, 10s seconds, seconds).

**Description**
This data block provides the jiffy multipliers (signed integers) used by the ROM time/clock arithmetic. Each constant corresponds to a single BCD digit position (10s hours, hours, 10s minutes, minutes, 10s seconds, seconds) and holds the number of "jiffies" for that digit. The ROM uses these values to add/subtract time by digit (jiffy arithmetic).

According to the ROM listing, these constants (addresses and signed decimal values) are:
- $BF3A — -2160000 — 10s hours
- $BF3E — +216000 — hours
- $BF42 — -36000  — 10s minutes
- $BF46 — +3600   — minutes
- $BF4A — -600    — 10s seconds
- $BF4E — +60     — seconds

Each value is a four-byte signed integer, with negative values represented in two's-complement form in the ROM bytes.

These constants are referenced by the ROM clock/time routines (time arithmetic and jiffy-grouped adjustments). They act as scale factors to convert between digit increments and the internal jiffy count used by the system clock.

## Source Code
```asm
.:BF3A FF DF 0A 80              -2160000    10s hours
.:BF3E 00 03 4B C0               +216000        hours
.:BF42 FF FF 73 60                -36000    10s mins
.:BF46 00 00 0E 10                 +3600        mins
.:BF4A FF FF FD A8                  -600    10s secs
.:BF4E 00 00 00 3C                   +60        secs
```

## References
- "floating_point_basic_constants" — expands on preceding numeric constants used across ROM math routines  
- "checksum_and_spare_bytes" — expands on data area (checksum & spare bytes) following the jiffy constants
