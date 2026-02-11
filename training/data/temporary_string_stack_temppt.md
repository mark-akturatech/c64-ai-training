# TEMPPT ($16) — Pointer to the Next Available Space in the Temporary String Stack

**Summary:** Zero-page pointer at $0016 (TEMPPT) that points to the next free 3‑byte temporary string descriptor slot in the temporary string descriptor stack ($0019-$0021). Values: $19 (empty), $1C (one entry), $1F (two entries), $22 (full — raises FORMULA TOO COMPLEX).

## Description
TEMPPT (zero page $0016) holds the address of the next available slot in the temporary string descriptor stack located at $0019-$0021 (decimal 25–33). The stack contains space for three descriptors; each descriptor is 3 bytes long and occupies the following slots:

- Descriptor 0: $0019–$001B (decimal 25–27)
- Descriptor 1: $001C–$001E (decimal 28–30)
- Descriptor 2: $001F–$0021 (decimal 31–33)

TEMPPT therefore takes one of four values as the stack is used:
- $19 (decimal 25) — stack empty (next free = first descriptor)
- $1C (decimal 28) — one descriptor in use (next free = second descriptor)
- $1F (decimal 31) — two descriptors in use (next free = third descriptor)
- $22 (decimal 34) — stack full (no free descriptor available)

When BASIC adds a new temporary string descriptor:
- If TEMPPT = $22 (34 decimal), the interpreter raises the FORMULA TOO COMPLEX error.
- Otherwise, the descriptor is written at the address pointed to by TEMPPT, and TEMPPT is incremented by 3 (advancing to the next 3‑byte slot).

(The stack is zero-page storage used by the BASIC interpreter for short-lived string descriptors.)

## Key Registers
- $0016 - Zero Page - TEMPPT: pointer to next available 3-byte temporary string descriptor slot
- $0019-$0021 - Zero Page - Temporary string descriptor stack (three descriptors × 3 bytes each)

## References
- "linnum_target_line_integer" — expands on previous pointer and control-flow storage
- "temporary_string_stack_lastpt" — expands on pointer to the last-used temporary string descriptor

## Labels
- TEMPPT
