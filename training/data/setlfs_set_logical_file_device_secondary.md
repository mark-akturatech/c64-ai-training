# SETLFS — Set Logical File Number, Device Number, and Secondary Address

**Summary:** SETLFS is a documented KERNAL routine (addresses shown as $FE00 / jump table $FFBA) that stores A → current logical file number, X → current device number, and Y → current secondary address (use Y=$FF if none) to prepare for OPEN, LOAD, or SAVE operations.

## Details
SETLFS stores the values from the CPU registers into the KERNAL's "current file/device/secondary" slots used by subsequent device operations. Specifically:
- The Accumulator (A) is stored into the location that holds the current logical file number.
- The X register is stored into the location that holds the current device number.
- The Y register is stored into the location that holds the current secondary address; if no secondary address is used, set Y = $FF.

These values must be set (via SETLFS) before calling OPEN, or before LOAD or SAVE, so the device and file parameters are defined for the I/O operation.

Entry:
- The source lists "65024  $FE00  SETLFS" (65024 decimal = $FE00).
- The routine is documented as callable via the KERNAL jump table at $FFBA (65466 decimal).

**[Note: Source may contain an error — conflicting entry-point addresses are shown: $FE00 vs the documented jump-table entry at $FFBA. Confirm the correct entry via your KERNAL listing or jump vector table before use.]**

## References
- "setnam_set_filename_parameters" — expands on SETNAM and how SETLFS is used together to prepare file operations  
- "readst_read_io_status_word" — expands on I/O status affected by device operations initiated after SETLFS

## Labels
- SETLFS
