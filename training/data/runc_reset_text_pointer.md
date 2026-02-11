# RUNC — Reset CHRGET Text Pointer (TXTPTR $7A-$7B)

**Summary:** RUNC (label $A68E) resets the CHRGET text pointer TXTPTR (zero-page bytes $7A-$7B / decimal 122-123) so the interpreter's next CHRGET read begins at the start of the program text; used by LIST and execution routines that rely on TXTPTR positioning.

## Description
RUNC is a small interpreter routine (labelled RUNC at $A68E) whose purpose is to set the two-byte pointer TXTPTR (zero page $7A-$7B) to point at the beginning of the stored program text. CHRGET (the interpreter byte-fetch routine) reads bytes from the location indicated by TXTPTR; by resetting TXTPTR to the program text start, RUNC prepares the interpreter to read program statements from the beginning (for example, before LIST or when restarting execution).

Key details preserved from the source:
- Routine name and address: RUNC at $A68E.
- Target pointer: TXTPTR, two bytes at $7A-$7B (decimal 122-123).
- Effect: Next CHRGET call will read the first byte of the program text.
- Usage context: LIST, token-printing and execution routines that depend on TXTPTR positioning.

## Key Registers
- $007A-$007B - BASIC interpreter (Zero Page) - TXTPTR (CHRGET text pointer; program text read pointer, 2-byte little-endian)

## References
- "list_listing_and_token_printing" — expands on LIST and execution routines that rely on TXTPTR positioning

## Labels
- RUNC
- TXTPTR
