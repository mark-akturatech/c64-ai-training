# SEETF — SET FILE VALUES (KERNAL $F31F)

**Summary:** Loads logical file number (LA $B8), device number (FA $BA) and secondary address (SA $B9) from the file parameter tables LAT ($0259), FAT ($0263) and SAT ($026D) using indexed LDA/STA (LDA abs,X / STA zp). Entry: X = offset into tables.

## Description
This KERNAL routine copies the file parameter bytes for the file indexed by X from three contiguous tables into the current file registers:

- On entry: X must contain the offset/index into the file parameter tables.
- It performs three indexed absolute loads:
  - LDA $0259,X — read LAT (table of active logical files) at base $0259 + X
  - LDA $0263,X — read FAT (table of active device numbers) at base $0263 + X
  - LDA $026D,X — read SAT (table of active secondary addresses) at base $026D + X
- Each loaded byte is stored into the corresponding zero page KERNAL register with STA:
  - STA $B8 → LA (logical file number)
  - STA $BA → FA (device number)
  - STA $B9 → SA (secondary address)
- Returns with RTS.

This routine is typically called after a prior routine that finds the file and returns the table offset (see "find_file").

## Source Code
```asm
.; SEET FILE VALUES
.; Entry: X = offset into file tables
.,F31F BD 59 02    LDA $0259,X     ; LAT, table of active logical files
.,F322 85 B8       STA $B8         ; store in LA
.,F324 BD 63 02    LDA $0263,X     ; FAT, table of active device numbers
.,F327 85 BA       STA $BA         ; store in FA
.,F329 BD 6D 02    LDA $026D,X     ; SAT, table of active secondary addresses
.,F32C 85 B9       STA $B9         ; store in SAT
.,F32E 60          RTS             ; return
```

## Key Registers
- $0259 - RAM - LAT base (table of active logical files)
- $0263 - RAM - FAT base (table of active device numbers)
- $026D - RAM - SAT base (table of active secondary addresses)
- $B8   - Zero Page - LA (current logical file number)
- $B9   - Zero Page - SA (current secondary address)
- $BA   - Zero Page - FA (current device number)

## References
- "find_file" — expands on find_file returns offset used by this routine

## Labels
- SEETF
