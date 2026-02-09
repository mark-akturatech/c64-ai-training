# FSBLK ($BE) — Cassette read/write block count

**Summary:** FSBLK at $BE (decimal 190) is a zero-page RAM location used by tape/cassette routines to count how many copies of a data block remain to be read or written; searchable terms: $BE, FSBLK, tape, cassette, block count.

## Description
FSBLK (label) resides at address $BE (190 decimal) in zero-page RAM. It stores the cassette read/write block count — the number of copies of the current data block still to be processed by the tape routines. Tape I/O code decrements or tests this location to determine when block-repeat operations are complete.

This byte is used together with the tape input buffer during block read/write operations and is part of the RAM structures referenced during LOAD/SAVE tape activity.

## Key Registers
- $00BE - RAM - FSBLK: Cassette read/write block count (number of copies of a data block remaining to be read or written)

## References
- "tape_input_byte_buffer_mych" — expands on FSBLK; used together with the tape input buffer when reading/writing blocks  
- "io_start_address_stal" — expands on STAL; points to the RAM area used during LOAD/SAVE operations including tape I/O