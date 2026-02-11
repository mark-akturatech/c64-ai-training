# INBIT ($A7)

**Summary:** $A7 (decimal 167) — INBIT — zero page temporary storage for received RS-232 serial bits and miscellaneous cassette/tape I/O tasks; used as the per-bit latch during serial input before bits are counted/assembled.

## Description
INBIT is a zero-page byte at address $A7 used to hold each individual bit as it is received from the RS-232 serial input (or used for cassette/tape I/O routines). Each incoming serial bit is placed here temporarily; higher-level routines read INBIT, update a bit counter (see BITCI at $A8), and shift/assemble bits into the input byte buffer (see RIDATA at $AA). Its use is transient and synchronous with the serial/tape input service routines.

## Key Registers
- $00A7 - Zero page - INBIT - RS-232 input bit / cassette temporary storage (decimal 167)

## References
- "rs232_input_bit_count_BITCI_A8" — expands on counting bits received to form a byte
- "rs232_input_byte_buffer_RIDATA_AA" — expands on where assembled bits are stored as bytes

## Labels
- INBIT
