# FNLEN ($B7) — Length of Current Filename

**Summary:** FNLEN at $00B7 contains the number of characters in the current filename (disk or tape). Covers disk vs tape limits (disk 1–16, tape 0–187), truncation in SEARCHING/FOUND messages, pointer at $00BB, and RS-232 OPEN filename bytes at $0293-$0296.

## Description
This zero-page location ($00B7, decimal 183) holds the length (number of characters) of the current filename.

- Disk filenames: 1–16 characters. A disk file is always referred to by a name (including generic names with * or ?), so FNLEN will always be > 0 for disk files.
- Tape filenames: 0–187 characters. Tape LOAD/SAVE/VERIFY operations may omit a name; in that case FNLEN may be 0 and the filename pointer at $00BB (decimal 187) is irrelevant.
- Truncation: If a tape filename exceeds 16 characters, the SEARCHING and FOUND messages will display only the first 16 characters (excess characters are truncated in messages) — the full name remains on tape and may be used. This permits saving machine-language programs into the cassette buffer using the tape filename.
- RS-232 OPEN: An OPEN command for the RS-232 device may specify a filename up to four characters; those characters are copied into locations $0293–$0296 (decimal 659–662) and are used to select baud rate, word length, and parity for the serial device.

## Key Registers
- $00B7 - RAM (zero page) - FNLEN: length of the current filename (disk or tape)
- $00BB - RAM - Pointer to filename (used when FNLEN > 0)
- $0293-$0296 - RAM - RS-232 OPEN filename bytes (4 characters copied here; determine baud/word length/parity)

## References
- "rs232_input_byte_buffer_RIDATA_AA" — expands on RS-232 device interactions and filename usage for OPEN commands
- "tape_buffer_pointer_TAPE1_B2_B3" — expands on tape filenames and cassette-buffer usage

## Labels
- FNLEN
