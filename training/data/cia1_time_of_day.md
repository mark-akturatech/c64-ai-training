# CIA #1 Time-of-Day Clock ($DC08-$DC0B)

**Summary:** CIA 1 Time-of-Day (TOD) clock registers at $DC08-$DC0B store tenths, seconds, minutes, and hours in BCD; hours contain an AM/PM bit. Searchable terms: $DC08, $DC09, $DC0A, $DC0B, CIA‑1, TOD, BCD, AM/PM bit.

## Time of Day (TOD) registers
The CIA #1 TOD clock provides a small BCD time counter split across four byte registers:
- $DC08 — TOD Tenths: tenth‑seconds counter in BCD (0–9)
- $DC09 — TOD Seconds: seconds counter in BCD (0–59)
- $DC0A — TOD Minutes: minutes counter in BCD (0–59)
- $DC0B — TOD Hours: hours counter in BCD with an AM/PM bit

Values are stored in packed BCD per register. The source identifies the hours register as including an AM/PM bit but does not specify the exact bit position.

## Source Code
```text
Time of Day:

$DC08   TOD Tenths              Tenth-seconds counter in BCD (0-9)
$DC09   TOD Seconds             Seconds counter in BCD (0-59)
$DC0A   TOD Minutes             Minutes counter in BCD (0-59)
$DC0B   TOD Hours               Hours counter in BCD with AM/PM bit
```

## Key Registers
- $DC08-$DC0B - CIA 1 - Time‑of‑Day clock: TOD tenths ($DC08), seconds ($DC09), minutes ($DC0A), hours with AM/PM bit ($DC0B)

## References
- "system_area_time_counters" — expands on system time counters and TI variable mapping