# SETLFS ($FFBA)

**Summary:** KERNAL function SETLFS at vector $FFBA (real ROM entry $FE00) configures file parameters for subsequent file operations; inputs are in registers A (logical file number), X (device number), Y (secondary address). Call via `JSR $FFBA` after loading A/X/Y; commonly used before `SETNAM` and `OPEN`.

## Description
SETLFS stores the file parameters (logical channel, device number, secondary address) in the KERNAL workspace so later KERNAL calls (notably SETNAM and OPEN) use those values. It does not open or name a file itself — it merely sets the parameters used by subsequent file-related KERNAL routines.

Inputs (caller's registers)
- A = logical file number (the channel to be used by later OPEN/INPUT/OUTPUT calls)
- X = device number (serial device number, e.g. disk drive usually 8)
- Y = secondary address (device-specific sub-address / channel on the device)

Behavior and usage notes
- Typical sequence: set file parameters with `SETLFS`, set filename with `SETNAM` (if opening a file by name), then call `OPEN` to actually open the channel.
- The secondary address is device-dependent (for example, many devices use 0 for a command channel and 1 for data, but consult the device's protocol).
- Call convention: load registers A, X, Y and `JSR $FFBA` (or `JSR $FE00` to call the ROM entry directly). Prefer using the documented vector `$FFBA`.
- SETLFS itself does not return an error code indicating device failure — it only arranges parameters; errors typically surface during `OPEN` or other device operations.

Example (assembly call sequence)
- `LDA #<logical>` ; logical channel number
- `LDX #<device>`  ; device number (e.g. 8)
- `LDY #<secondary>` ; secondary address
- `JSR $FFBA`      ; SETLFS (KERNAL vector)

## Key Registers
- $FFBA - KERNAL vector - SETLFS (configure logical file/device/secondary)
- $FE00 - ROM entry - actual SETLFS routine address

## References
- "setnam" — sets the filename for subsequent OPEN
- "open" — opens a file using parameters set by SETLFS/SETNAM

## Labels
- SETLFS
