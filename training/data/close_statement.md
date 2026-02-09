# CLOSE (BASIC I/O statement)

**Summary:** CLOSE <file number> — BASIC I/O statement that shuts off a data file or device channel opened with OPEN; for cassette and disk it flushes incomplete buffers to finalize files, for other devices it frees resources. See OPEN, PRINT#, CMD interactions.

## Description
Type: I/O statement  
Format: CLOSE <file number>

Action: Shuts off any data file or device channel previously OPENed. The file number is the same numeric channel used in the corresponding OPEN statement. For storage devices (cassette tape and disk), CLOSE writes any incomplete buffers and finalizes the file on the medium; if CLOSE is not performed the file may be incomplete on tape or unreadable on disk. For non-storage devices CLOSE is not always required but it frees memory and other resources associated with the open channel. See the external device's manual for device-specific behavior.

Notes:
- The statement applies to channels opened with OPEN (same file/channel number).
- CLOSE affects buffered output for disk and cassette devices (finalizes/flushes buffers).

## References
- "cmd_statement_and_usage" — expands on CMD and PRINT# interactions with OPEN/CLOSE