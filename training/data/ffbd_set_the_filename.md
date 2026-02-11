# C64 KERNAL $FFBD — Set the filename

**Summary:** KERNAL call $FFBD sets the filename for file operations (OPEN, SAVE, LOAD). Call convention: A = filename length, X/Y = pointer to filename string (X = low byte).

## Description
Sets up the file name used by subsequent OPEN, SAVE, or LOAD KERNAL routines.

Calling convention (CPU registers on entry):
- A = length of the file name (number of characters). The KERNAL uses this length; the string is not required to be zero-terminated.
- X/Y = address pointer to the filename string in memory, with X containing the low byte and Y the high byte of the 16-bit address.
- If A = 0 (no filename desired), XY may contain any address; a zero length indicates no filename.

The pointer may reference any valid RAM location containing the filename characters. This routine must be used to provide the filename before calling OPEN (and is used by SAVE and LOAD as well).

## Key Registers
- $FFBD - KERNAL (ROM) - Set filename for OPEN / SAVE / LOAD (A=length, X/Y=pointer; X=low byte)

## References
- "ffba_set_logical_first_and_second_addresses" — expands on device/secondary address pairing for file operations  
- "ffc0_open_a_logical_file" — expands on how OPEN reads the filename set by $FFBD

## Labels
- SETNAM
