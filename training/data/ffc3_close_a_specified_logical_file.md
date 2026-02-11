# $FFC3 — KERNAL CLOSE (close a specified logical file)

**Summary:** KERNAL entry at $FFC3 (CLOSE) closes a specified logical file; call with accumulator A set to the logical file number originally used with OPEN. The routine finalises I/O for that file and updates the KERNAL file table pointers.

## Description
Call convention: load the accumulator (A) with the logical file number to be closed (the same number supplied to OPEN) and then JSR $FFC3 (CLOSE). The routine performs final I/O housekeeping for that logical file and updates internal file-table pointers so the channel/file is finalised and its slot becomes available for reuse.

Behavior notes from source:
- Intended to be called after all I/O on the logical file has been completed.
- Finalises any remaining I/O and updates file-table pointers (internal KERNAL bookkeeping).

(Short parenthetical: logical file number = the value used in OPEN.)

## Key Registers
- $FFC3 - KERNAL - CLOSE: close a specified logical file; call with A = logical file number

## References
- "ffe7_close_all_channels_and_files" — expands on closing all files at once

## Labels
- CLOSE
