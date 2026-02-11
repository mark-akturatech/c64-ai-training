# NXTBIT ($B5)

**Summary:** NXTBIT is a zero-page memory location at $B5 (decimal 181) used by RS-232 routines to hold the next bit to send and by tape routines as a block-position / tape-EOT indicator.

## Description
This single-byte zero-page location stores the "next bit" value used by the RS-232 output routines (the bit to be transmitted next) and is repurposed by the tape routines as a flag to indicate which part of a tape block the read routine is currently processing (effectively a tape end-of-block / position flag). It is read and written by those routines during bit-by-bit serial transmission and tape block processing.

It is used together with the bit-count and output-byte buffer variables (see referenced chunks) to manage RS-232 framing and the source of bits fed to the output shift logic.

## Key Registers
- $00B5 - Zero Page - NXTBIT: RS-232 next bit to send / tape block-position (EOT) flag

## References
- "rs232_output_bit_count_BITTS_B4" — expands on the bit-count used with NXTBIT to manage bit transmission and framing
- "rs232_output_byte_buffer_RODATA_B6" — expands on the output byte buffer that provides the bits fed to NXTBIT

## Labels
- NXTBIT
