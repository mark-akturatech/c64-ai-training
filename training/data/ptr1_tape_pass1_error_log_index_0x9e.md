# PTR1 ($9E) — Tape Pass 1 Error Log Index

**Summary:** PTR1 at $9E (decimal 158) is a zero-page index used by the tape routines to set up an error log of bytes that had parity errors on the first pass of a tape block transmission; each block is sent twice to reduce data loss.

## Description
PTR1 holds an index used when constructing an error log of bytes whose transmission parity failed during the first reception of a tape block. The tape protocol sends each block twice; PTR1 identifies positions to record for first-pass parity errors so the second pass can be used for correction/retransmission handling.

## Key Registers
- $009E - Zero Page RAM - PTR1: Tape Pass 1 Error Log Index (index for logging bytes with parity errors detected on the first reception of a tape block)

## References
- "ptr2_tape_pass2_error_correction_index_0x9f" — expands on the second-pass correction index for tape error handling (PTR2 at $9F)
- "dpsw_tape_byte_received_flag_0x9c" — expands on the byte-received flag used during error logging (DPSW at $9C)

## Labels
- PTR1
