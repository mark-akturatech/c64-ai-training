# VECTOR ($FF8D)

**Summary:** KERNAL routine VECTOR at $FF8D (real address $FD1A) copies the interrupt vector table between the system and user areas; input via Carry flag (0 = copy user→system, 1 = copy system→user) and X/Y point to the user table. Uses registers A and Y.

## Description
VECTOR is a KERNAL entry that transfers the 256-byte (vector) table between the system area and a user-supplied table. The direction of the copy is controlled by the processor Carry flag. The user supplies a pointer to the user table in X/Y (low/high), and the routine uses the A and Y registers during the transfer.

## Inputs / Operation
- Carry flag:
  - 0 = copy user table → system table
  - 1 = copy system table → user table
- X/Y = pointer (address) of the user vector table (X = low byte, Y = high byte)
- Registers used: A, Y (may be modified)
- Function vector / entry point: $FF8D
- Real ROM address: $FD1A

## References
- "restor" — RESTOR ($FF8A) — restores the default vector table

## Labels
- VECTOR
