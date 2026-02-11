# CMP0 ($B0-$B1) — Tape Timing

**Summary:** CMP0 at $B0-$B1 is a zero-page two-byte area used for cassette/tape timing. Location $00B0 (decimal 176) determines the adjustable timing constant stored at $0092; location $00C7 (decimal 199) is also referenced by tape read timing.

**Description**
CMP0 is identified in the source as the two-byte area at $B0-$B1 used for tape timing. The byte at location $00B0 (decimal 176) is used to compute or select the adjustable timing constant found at $0092 (decimal 146). Another zero-page location, $00C7 (decimal 199), is also referenced by the tape-read timing logic. The entry names and cross-references suggest CMP0 interacts with the cassette sync countdown and the tape buffer pointer routines (see References).

The timing constant at $0092 is utilized during datasette input operations to manage the timing of data reads. The value at $00B0 influences this constant, thereby affecting the overall timing of tape operations. Additionally, the cassette sync countdown at $00A5 (decimal 165) and the tape buffer pointer at $00A6 (decimal 166) are integral to the tape read process, coordinating the synchronization and data storage during tape operations.

## Source Code
```text
176-177       $B0-$B1        CMP0
Tape Timing

Location 176 ($B0) is used to determine the value of the adjustable
timing constant at 146 ($92).  Location 199 is also used in the timing
of tape reads.

---
Additional information can be found by searching:
- "cassette_sync_countdown_CNTDN" which expands on sync character countdown interacts with timing constants
- "tape_buffer_pointer_TAPE1_B2_B3" which expands on buffer pointer whose reads depend on timing
```

## Key Registers
- $00B0-$00B1 - Zero page - CMP0 (tape timing area)
- $0092 - Zero page - Adjustable timing constant (affected by $00B0)
- $00A5 - Zero page - Cassette sync countdown
- $00A6 - Zero page - Pointer: Tape I/O buffer
- $00C7 - Zero page - Reverse mode switch (also referenced in tape read timing)

## References
- "cassette_sync_countdown_CNTDN" — expands on sync-character countdown and its interaction with timing constants
- "tape_buffer_pointer_TAPE1_B2_B3" — expands on tape buffer pointer and reads that depend on timing

## Labels
- CMP0
