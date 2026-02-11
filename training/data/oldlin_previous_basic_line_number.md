# OLDLIN ($003B-$003C) — Previous BASIC Line Number

**Summary:** OLDLIN at $003B-$003C (zero page) holds the last executed BASIC line number when program execution ends; the CONT operation restores this value into CURLIN ($0039). Searchable terms: $003B, $003C, $0039, OLDLIN, CURLIN, CONT, BASIC line number.

## Description
OLDLIN is a two-byte zero-page location that records the last BASIC line number executed when a program terminates (for example after RUN completes or a STOP/BREAK). The two bytes at $003B (low) and $003C (high) form the 16-bit line number. The BASIC CONT routine copies OLDLIN back into the current-line pointer CURLIN at $0039 so execution can resume from that line.

This value is used together with CURLIN for STOP/CONT/BREAK behavior in BASIC interpreter control flow.

## Key Registers
- $003B-$003C - Zero Page - OLDLIN, previous BASIC line number (stored low byte at $003B, high byte at $003C)
- $0039 - Zero Page - CURLIN, current BASIC line pointer (CONT restores OLDLIN here)

## References
- "curlin_current_basic_line_number" — expands on how CURLIN and OLDLIN are used together for STOP/CONT/BREAK behavior

## Labels
- OLDLIN
- CURLIN
