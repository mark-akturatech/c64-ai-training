# PRTY ($9B) — Tape Character Parity

**Summary:** PRTY ($009B / decimal 155) is a RAM location holding tape character parity used to detect lost bits during cassette/tape data transmission. Searchable terms: $009B, $9B, PRTY, tape parity, cassette.

## Description
PRTY is a single-byte memory location containing the parity information for tape-transferred characters. Its purpose is to help detect when bits have been lost or corrupted during tape data reception. It is used together with the byte-received flag and cassette block synchronization values during tape transfers to validate received bytes.

(The source links the byte-received flag and cassette sync entries for the transfer protocol; see References.)

## Key Registers
- $009B - RAM - PRTY (Tape character parity: parity byte used to detect bit loss during tape data transmission)

## References
- "dpsw_tape_byte_received_flag_0x9c" — expands on byte-received flag used together with parity checks  
- "syno_cassette_block_sync_number_0x96" — expands on cassette synchronization used in tape transfers

## Labels
- PRTY
