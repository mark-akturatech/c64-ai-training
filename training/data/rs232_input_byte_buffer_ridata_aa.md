# RIDATA ($AA) — RS-232 Input Byte Buffer / Cassette Temporary Storage

**Summary:** RIDATA at $AA (decimal 170) is a zero-page byte used as the RS-232 input byte buffer and temporary cassette storage; serial routines reassemble bits from INBIT/BITCI into RIDATA before the byte is moved to the receive buffer pointed to by $F7.

## Description
RIDATA is a zero-page workspace byte used by both the RS-232 serial input path and cassette input routines:

- RS-232: Serial receive routines collect incoming bits (temporary bit storage held in INBIT / BITCI) and reassemble them into a full byte in RIDATA. Once assembled, that byte is stored into the receive buffer whose pointer is at location 247 ($F7).
- Cassette: Tape input routines use RIDATA as temporary storage and as a flag to distinguish data bytes from synchronization/leader characters during tape read processing.

Related zero-page temporaries mentioned by the source include INBIT (temporary incoming bit storage) and parity/leader counters referenced in companion documents (see References).

## Key Registers
- $00AA - Zero Page - RIDATA: RS-232 input byte buffer / cassette temporary storage
- $00F7 - Zero Page - Receive buffer pointer (pointer to the receive buffer used by serial routines)
- $00A7 (referenced) - Zero Page - INBIT (temporary bit storage for incoming serial data) [see referenced chunk]

## References
- "rs232_input_parity_or_tape_leader_RIPRTY_AB" — expands on parity detection and tape leader counting
- "rs232_input_bits_inbit_A7" — expands on temporary bit storage for incoming serial data

## Labels
- RIDATA
