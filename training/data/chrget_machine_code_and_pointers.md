# Zero Page $0073-$007B: CHRGET machine code & pointers (Zero Page $0073-$008A)

**Summary:** Zero-page CHRGET routine at $0073-$008A (24 bytes) with entry point CHRGOT at $0079 and CHRGET pointer(s) at $007A-$007B; used by BASIC tokenizer/listing to read the current BASIC byte (zero page = fast addressing).

## Description
This zero-page block contains the CHRGET routine and its pointer(s) used by the BASIC tokenizer and listing code:

- $0073-$008A — CHRGET machine code (24 bytes) implementing the read-current-BASIC-byte functionality.
- $0079 — CHRGOT entry point (single-byte entry used by tokenizer/listing to fetch the current BASIC byte).
- $007A-$007B — CHRGET Pointer (two-byte zero-page pointer referencing the current BASIC byte in memory; used during tokenization and listing).

Behavioral notes captured from the source:
- CHRGET is the centralized read routine invoked by tokenizer/executor vectors (see tokenizer_and_executor_vectors).
- The pointer at $007A-$007B is updated to point at the current BASIC byte being inspected; CHRGOT uses that pointer to return the byte to the caller.
- The code resides in zero page for fast indirect/absolute addressing during parsing/tokenization.

(No assembly listing provided in the source; see referenced tokenizer/executor vectors for call sites.)

## Source Code
```text
$0073-$008A  CHRGET             Machine code for reading BASIC bytes (24 bytes)
$0079        CHRGOT             Entry point to read current byte
$007A-$007B  CHRGET Ptr         Pointer to current BASIC byte

Additional information can be found by searching:
- "tokenizer_and_executor_vectors" which expands on tokenizer routines that call CHRGET
```

## Key Registers
- $0073-$008A - Zero Page - CHRGET machine code (24 bytes), entry at $0079
- $007A-$007B - Zero Page - Pointer to current BASIC byte (used by tokenizer/listing)

## References
- "tokenizer_and_executor_vectors" — expands on tokenizer routines that call CHRGET