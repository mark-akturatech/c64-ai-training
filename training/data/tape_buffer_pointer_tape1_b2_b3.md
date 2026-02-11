# TAPE1 ($B2-$B3) — Pointer: Start of Cassette Buffer

**Summary:** TAPE1 is a two-byte KERNAL pointer at $00B2-$00B3 (little-endian) holding the start address of the cassette buffer (default $033C / 828). It must contain an address >= $0200 (512) or tape I/O will return an ILLEGAL DEVICE NUMBER error.

## Description
TAPE1 is a KERNAL pointer (two bytes) located at $00B2-$00B3. On power-on it is initialized to the cassette buffer start address: decimal 828, hex $033C. The pointer is stored low-byte first then high-byte (little-endian).

When performing cassette (tape) I/O, the KERNAL expects TAPE1 to point to a valid RAM buffer address. If TAPE1 contains an address less than $0200 (decimal 512), tape routines will report an ILLEGAL DEVICE NUMBER error. Related KERNAL variables and timing constants affect how the buffer is used and processed (see References).

## Key Registers
- $00B2-$00B3 - KERNAL - TAPE1 pointer: start address of cassette buffer (little-endian). Default on power-on $033C (828). Must be >= $0200 (512) or tape I/O returns ILLEGAL DEVICE NUMBER.

## References
- "tape_buffer_count_and_force_output_BUFPNT" — covers BUFPNT, counts for the buffer pointed to by TAPE1  
- "tape_timing_constant_CMP0_B0_B1" — covers timing constants used when reading/writing the cassette buffer

## Labels
- TAPE1
