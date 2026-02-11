# Memory-Read (M-R) command — 1541

**Summary:** Describes the 1541 disk-drive Memory-Read (M-R) command for reading any area of 1541 RAM or ROM via a channel PRINT#, including canonical and alternate syntax, the required address bytes, and the optional byte-count (default 1). Search terms: 1541, M-R, PRINT#, CHR$, RAM, ROM.

**Description**
The Memory-Read (M-R) command requests the 1541 to return the contents of a specified memory area (RAM or ROM). The command must include the 16-bit address to read (low byte then high byte) and an optional number-of-bytes parameter; if the byte count is omitted, the default is 1. The command is sent over an open file channel (PRINT# file#) to the drive.

**Usage and syntax**
- **Purpose:** Read any address range in 1541 RAM or ROM.
- **Address format:** Low byte then high byte (CHR$(lo-byte), CHR$(hi-byte)).
- **Byte count:** CHR$(# of bytes) — optional, defaults to 1.
- **Sent using a PRINT# to the drive's command channel.**

Canonical syntax:
- `PRINT# file#, "M-R" CHR$(lo-byte) CHR$(hi-byte) CHR$(# of bytes)`

Alternate (colon) syntax:
- `PRINT# file#, "M-R:" CHR$(lo-byte) CHR$(hi-byte) CHR$(# of bytes)`

Example (read address $0300, default count omitted if desired; shown reading one byte at $0300):
- `PRINT#15, "M-R" CHR$(0) CHR$(3)`

Note: See the referenced documents for parameter defaults, buffer selection, and typical use with preceding block-read (U1) commands.

## Source Code
```basic
REM Memory-Read (M-R) command examples and syntax

REM Canonical form:
PRINT# file#, "M-R" CHR$(lo-byte) CHR$(hi-byte) CHR$(# of bytes)

REM Alternate form (colon after command):
PRINT# file#, "M-R:" CHR$(lo-byte) CHR$(hi-byte) CHR$(# of bytes)

REM Example: read from address $0300 (lo=0, hi=3) on device channel 15
PRINT#15, "M-R" CHR$(0) CHR$(3)
```

## References
- "memory_read_parameters_and_defaults" — expands on definitions for file#, lo-byte, hi-byte, and the optional # of bytes parameter (default 1)
- "buffer_selection_and_direct_access_open" — explains typical usage with a preceding block-read (U1) and how to select which buffer the DOS uses