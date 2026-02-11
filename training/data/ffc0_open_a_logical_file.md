# KERNAL OPEN ($FFC0) — Open a logical file

**Summary:** KERNAL routine at $FFC0 (OPEN) — creates a logical file entry for C64 I/O routines, performs device handshake when required; must call SETLFS ($FFBA) and SETNAM ($FFBD) first.

## Description
OPEN initializes a logical file that the KERNAL and higher-level I/O routines will use for input/output. It allocates and sets up the file table entries and performs any device handshake required by the selected device.

Prerequisites:
- Call SETLFS ($FFBA) to set the logical file number, device and secondary address.
- Call SETNAM ($FFBD) to set the filename (or supply an empty name for device-only opens).

No additional arguments need to be placed before calling OPEN. The routine is typically invoked with a JSR $FFC0 (single-instruction example).

OPEN is the standard creation step before using CHKIN/CHKOUT, and most other I/O KERNAL routines rely on an open logical file to be present.

## Key Registers
- $FFC0 - KERNAL - OPEN a logical file (requires prior SETLFS $FFBA and SETNAM $FFBD)

## References
- "ffc3_close_a_specified_logical_file" — closes files opened with OPEN
- "ffc6_open_channel_for_input" — CHKIN after OPEN (open for input)
- "ffc9_open_channel_for_output" — CHKOUT after OPEN (open for output)

## Labels
- OPEN
