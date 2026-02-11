# LASTPT ($17-$18) — Pointer to last string in temporary string descriptor stack

**Summary:** LASTPT is a two‑byte pointer stored at $0017 (low) and $0018 (high) that points to the address of the last string descriptor used in the temporary string descriptor stack; it is related to TEMPPT such that LASTPT = TEMPPT - 3 and $0018 is typically zero.

## Description
LASTPT is a 16‑bit pointer (low byte at $17, high byte at $18) that identifies the last slot used in the temporary string descriptor stack. The temporary string stack uses fixed‑size descriptors (3 bytes each), so the pointer relationship to the pointer for the next available slot (TEMPPT) is:

- LASTPT = TEMPPT - 3

Because the temporary string descriptors normally reside in the low memory page, the high byte stored at $0018 will usually be $00 in typical cases. LASTPT therefore points to the low‑memory address of the last descriptor in use; updating TEMPPT (the next free entry pointer) should maintain this 3‑byte spacing invariant.

## Key Registers
- $0017-$0018 - Zero page - LASTPT pointer (low/high) to address of last temporary string descriptor

## References
- "temporary_string_stack_temppt" — expands on pointer to next available stack entry (TEMPPT)
- "temporary_string_stack_tempst" — expands on the actual descriptor stack entries (TEMPST)

## Labels
- LASTPT
