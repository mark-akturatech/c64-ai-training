# write_tape_header (start)

**Summary:** Start of the KERNAL write-tape-header routine: saves selected header type into $009E (zero page) and calls helper at $F7D0 to load the tape buffer start pointer into X/Y registers (STA, JSR, $F76A, $F7D0).

## Overview
This entry is the initial setup step for writing a tape header. It stores the selected header type in zero page location $009E and then calls a KERNAL helper routine at $F7D0 which returns the tape buffer start pointer in the X and Y registers. This prepares the header buffer before the remainder of the header-write sequence runs.

- Exact actions:
  - STA $009E — save the header type byte into zero page variable $009E.
  - JSR $F7D0 — call helper to obtain tape buffer start pointer; helper returns pointer in X/Y.

No additional code or register maps are included here; the remainder of the header-write sequence and the implementation of $F7D0 are covered in referenced chunks.

## Source Code
```asm
.,F76A 85 9E    STA $9E         save header type
.,F76C 20 D0 F7 JSR $F7D0       get tape buffer start pointer in XY
```

## Key Registers
- $009E - Zero Page - selected tape header type (saved by STA)
- $F7D0 - KERNAL ROM - helper routine that returns tape buffer start pointer in X/Y
- $F76A-$F76C - KERNAL ROM - entry point/start of write-tape-header sequence

## References
- "tape_save_entry_and_device_checks" — expands on invoking the write-tape-header routine when saving to tape
- "find_tape_header" — covers the symmetric operation for locating headers during LOAD/VERIFY