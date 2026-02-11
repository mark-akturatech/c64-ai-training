# RIPRTY ($AB)

**Summary:** RIPRTY at $00AB (decimal 171) is a KERNAL/zero-page byte used for RS-232 input parity detection and as a cassette (tape) leader length counter to detect end-of-leader. Searchable terms: $AB, RIPRTY, RS-232, parity, tape leader.

## Description
RIPRTY is a single-byte location that serves two related roles in the system routines that handle serial input and cassette input:

- RS-232 parity detection: involved in detecting whether data was lost during RS-232 transmission (parity error detection).
- Cassette leader counter: counts tape leader length to determine when the tape leader has completed (end-of-leader detection).

It is used in conjunction with the RS-232 input byte buffer and bit-count locations (see References) to verify assembled bytes or to time/count leader bits.

## Key Registers
- $00AB - KERNAL/Zero Page - RS-232 input parity / cassette leader counter (RIPRTY)

## References
- "rs232_input_byte_buffer_RIDATA_AA" — expands on verification of assembled RS-232/tape bytes (RIDATA, $AA)
- "rs232_input_bit_count_BITCI_A8" — expands on bit-count usage working with RIPRTY to detect reception errors (BITCI, $A8)

## Labels
- RIPRTY
