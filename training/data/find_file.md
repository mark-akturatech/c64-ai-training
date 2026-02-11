# FIND FILE (KERNAL) — $F30F

**Summary:** Scans the LAT table ($0259) for a logical file number using LDTND ($98) as the count; STATUS ($90) is cleared on entry. On success X returns the table index/offset and Z=1; otherwise Z=0. Uses TXA, LDX/DEX loop, CMP $0259,X and RTS.

## Description
This KERNAL routine searches the LAT (table of active logical files) for a logical file number supplied in X on entry. Behavior and registers:

- Entry:
  - X must hold the logical file number to find (this value is transferred into A).
  - STATUS ($90) is cleared at start.
- Operation:
  - The file number is copied to A (TXA).
  - LDTND (zero-page $98) is loaded into X and decremented once, establishing an index (X = LDTND - 1).
  - The routine compares A with LAT entries via CMP $0259,X (LAT base $0259, indexed by X).
  - If not equal, X is decremented and the compare repeats (counting down through LAT).
  - If a match is found, the routine returns with Z flag set and X containing the offset/index into LAT.
  - If the table is exhausted (LDTND = 0 or no match), the routine branches out and returns with Z clear.
- Notes:
  - The original logical file number in X is destroyed (moved to A and X reused as loop/index).
  - STATUS ($90) is explicitly zeroed at start (STA $90).
  - The search loops from last open file (LDTND-1) down to 0.
  - The routine relies on the 6502 flags set by DEX/BMI and CMP to detect end-of-table and match.

## Source Code
```asm
.,F30F A9 00    LDA #$00
.,F311 85 90    STA $90         clear STATUS
.,F313 8A       TXA             file number to search for
.,F314 A6 98    LDX $98         LDTND, number of open files
.,F316 CA       DEX
.,F317 30 15    BMI $F32E       end of table, return
.,F319 DD 59 02 CMP $0259,X     compare file number with LAT, table of open files
.,F31C D0 F8    BNE $F316       not equal, try next
.,F31E 60       RTS             back with Z flag set
```

## Key Registers
- $0259 - RAM - LAT (table of active logical file numbers)
- $0098 - Zero page - LDTND (number of open files)
- $0090 - Zero page - STATUS (cleared on entry to this routine)

## References
- "close_file_part1" — expands on how CLOSE uses this to locate file entries
- "set_file_values" — expands on retrieving file parameter values after a successful find

## Labels
- FIND_FILE
