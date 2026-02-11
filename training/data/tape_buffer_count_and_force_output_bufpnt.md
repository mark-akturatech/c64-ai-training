# BUFPNT ($A6) — Tape I/O buffer count

**Summary:** BUFPNT at $A6 (decimal 166) holds the count of bytes currently in the cassette/tape I/O buffer; tape writes are buffered in 192-byte blocks and can be forced out with POKE 166,191.

## Description
BUFPNT (decimal 166, hex $A6) is used by the KERNAL tape routines to count the number of characters (bytes) that have been read into or written to the cassette/tape buffer. For tape writes, data is not sent to the cassette until the internal 192‑byte buffer is full. To force an immediate output of the buffer before it reaches 192 bytes, write the value 191 to location 166 (example: POKE 166,191).

## Key Registers
- $00A6 - RAM (zero page) - BUFPNT: count of characters in cassette/tape I/O buffer (decimal 166)

## References
- "tape_buffer_pointer_TAPE1_B2_B3" — expands on start address of the cassette buffer  
- "tape_timing_constant_CMP0_B0_B1" — expands on timing values that affect tape reads/writes

## Labels
- BUFPNT
