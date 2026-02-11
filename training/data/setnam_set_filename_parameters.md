# SETNAM ($FDF9) - Set Filename Parameters

**Summary:** KERNAL routine SETNAM at $FDF9 sets filename parameters (filename length and pointer) from CPU registers A, X, Y to the KERNAL filename storage; callable via the jump table entry at $FFBD. Used to prepare for OPEN, LOAD, or SAVE.

**Description**
SETNAM is a documented KERNAL entry that copies the filename length and the pointer to the ASCII filename from the CPU registers into the KERNAL filename parameter storage.

- **Entry:** Call through the KERNAL jump table at $FFBD (decimal 65469) or jump directly to $FDF9.
- **Inputs:**
  - A = filename length (stored into the KERNAL filename-length location at $B7)
  - X/Y = pointer to the ASCII filename (stored into the KERNAL filename pointer locations at $BB-$BC; low byte at $BB, high byte at $BC)
- **Purpose:** Prepares the KERNAL filename parameters so subsequent file operations (OPEN, LOAD, SAVE) know where the ASCII filename resides and how many characters to use.

## Key Registers
- $FDF9 - KERNAL ROM - SETNAM entry point (stores A to filename-length and X/Y to filename pointer)
- $FFBD - KERNAL Vector - Jump-table entry for SETNAM (call here for documented entry)

## References
- "setlfs_set_logical_file_device_secondary" — expands on SETLFS, which sets device, file number, and secondary address used together with SETNAM

## Labels
- SETNAM
