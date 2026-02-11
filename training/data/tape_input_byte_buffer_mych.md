# MYCH ($BF) — Tape input byte buffer

**Summary:** Zero-page byte at $BF (decimal 191) named MYCH; used by tape routines as a work area where incoming cassette/tape characters are assembled. Searchable terms: $BF, MYCH, tape input, cassette buffer.

## Description
MYCH is a single byte located in zero page at address $BF (191). It is used by the system tape/cassette routines as a temporary work area in which incoming characters from the tape interface are assembled before further processing (block assembly, checksumming, or storage). References in related tape code and documentation use MYCH while higher-level counters/flags (for example FSBLK, CAS1) coordinate block counts and hardware control.

## Key Registers
- $00BF - Zero Page - MYCH (Tape input byte buffer; temporary assembly location for incoming cassette characters)

## References
- "cassette_block_count_fsblk" — expands on FSBLK and how tracks/blocks remaining are counted while MYCH holds assembled bytes  
- "tape_motor_interlock_cas1" — expands on CAS1 and other tape-related locations that coordinate tape hardware and data flow

## Labels
- MYCH
