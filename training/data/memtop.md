# MEMTOP ($FF99)

**Summary:** KERNAL routine MEMTOP at $FF99 (real entry $FE25) manages the BASIC workspace upper boundary (MEMTOP). Calling convention: Carry=0 → restore (X/Y = address to restore); Carry=1 → save (returns X/Y = saved address). Uses registers X and Y.

## Description
MEMTOP provides read/write access to BASIC's workspace upper limit (MEMTOP). Behavior:
- Input:
  - Carry = 0: restore MEMTOP from the address supplied in X/Y (X = low byte, Y = high byte).
  - Carry = 1: save current MEMTOP (no input address expected).
- Output:
  - When called with Carry = 1, returns the saved MEMTOP in X/Y (X = low byte, Y = high byte).
- Registers:
  - Uses X and Y for input/output (X = low byte, Y = high byte).
- Addresses:
  - Documented entry: $FF99 (KERNAL vector).
  - Real/actual code address: $FE25.

Note: The source lists only the X/Y and Carry usage; effects on other CPU registers, stack, or flags are not specified here.

## Key Registers
- $FF99 - KERNAL ROM - MEMTOP entry point (documented)
- $FE25 - KERNAL ROM - MEMTOP real address (implementation target)

## References
- "membot" — BASIC workspace lower boundary (MEMBOT $FF9C)
- "ramtas" — RAM initialization and workspace setup (RAMTAS $FF87)

## Labels
- MEMTOP
