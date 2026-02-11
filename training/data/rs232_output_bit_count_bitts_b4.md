# $B4 (BITTS) — RS-232 Output Bit Count / Cassette Temporary Storage

**Summary:** $B4 (BITTS) is a zero-page byte used by RS-232 routines to count transmitted bits and to support parity and stop‑bit handling; tape/cassette load routines also reuse this location as a flag to indicate readiness to receive data bytes.

## Description
BITTS is a single zero-page byte (address $B4) with two distinct uses in the ROM:

- RS-232 serial output: counted and manipulated by the RS-232 routines to track the number of bits transmitted for a byte and to assist in parity and stop‑bit processing.
- Cassette/tape I/O: tape load routines temporarily reuse this location as a readiness/receive flag when accepting incoming data bytes from tape.

No bit-field breakdown or additional subfields are specified in the source; it is used as a plain 8-bit counter/flag variable by the routines that reference it.

## Key Registers
- $00B4 - Zero Page - BITTS — RS-232 output bit count; used for parity/stop-bit handling and as cassette/tape receive-ready flag

## References
- "rs232_next_bit_or_tape_eot_NXTBIT_B5" — expands on next-bit/position information used with bit counting
- "rs232_output_byte_buffer_RODATA_B6" — expands on where bytes are disassembled for output bit-wise

## Labels
- BITTS
