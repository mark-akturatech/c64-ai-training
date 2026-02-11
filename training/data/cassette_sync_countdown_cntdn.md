# CNTDN ($A5) — Cassette Synchronization Character Countdown

**Summary:** CNTDN ($A5, decimal 165) is a zero-page system variable used by the Commodore cassette/tape routines to count down how many synchronization characters are sent before the actual data in a tape block (cassette sync/tape block timing).

## Description
CNTDN (label/name) holds the countdown value used during tape output (and related tape I/O routines) to determine how many synchronization characters are emitted prior to the payload data of a tape block. It is a single-byte zero-page variable used by the cassette driver to gate the transition from sync-character output to the actual data stream.

- Size: 1 byte (zero page)
- Purpose: controls number of pre-data sync characters for tape blocks
- Usage context: cassette write/read routines and tape timing/state machines (part of the tape-block framing process)

No code, bitfields, or timing constants are included here; related buffer handling and timing constants are documented in the referenced chunks.

## Key Registers
- $00A5 - Zero Page - CNTDN: Cassette synchronization-character countdown (counts sync characters sent before tape-block data)

## References
- "tape_buffer_count_and_force_output_BUFPNT" — expands on buffer handling during tape write/read operations
- "tape_timing_constant_CMP0_B0_B1" — expands on timing constants relevant to tape I/O

## Labels
- CNTDN
