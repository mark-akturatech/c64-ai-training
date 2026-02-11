# MACHINE — TXTPTR (CHRGOT vector $0308/$0309)

**Summary:** TXTPTR is the address of the instruction at CHRGOT and always points to the BASIC command currently being executed. On the VIC-20 and C64 a vector at $0308/$0309 transfers control immediately before each BASIC command, allowing wedges to inspect BASIC text (via indirect, indexed addressing) and return with TXTPTR positioned correctly.

## TXTPTR and CHRGOT
TXTPTR denotes the address of the instruction at CHRGOT; it points at the BASIC command being executed at that moment. If code wants to participate in BASIC’s parsing/execution (a "wedge"), it commonly:

- Hooks the CHRGOT vector at $0308/$0309 to gain control immediately before each BASIC statement.
- Uses the address in TXTPTR with indirect indexed addressing to examine the BASIC program text (for example, read characters via (TXTPTR),Y).
- Must leave TXTPTR pointing to a suitable place when returning so normal BASIC handlers resume correctly.

Project example (conceptual): make the character '&' a custom BASIC command that prints ten asterisks and a carriage return whenever BASIC encounters '&' in the input stream. The vector at $0308/$0309 is the insertion point for such a wedge to detect '&', perform the action, and then restore TXTPTR appropriately before returning.

## Key Registers
- $0308-$0309 - System - CHRGOT vector (entry point invoked immediately before each BASIC command); contains address of the instruction at CHRGOT (TXTPTR).

## References
- "breaking_into_basic_wedge_constraints" — expands on why the $0308 vector simplifies wedge insertion

## Labels
- CHRGOT
- TXTPTR
