# KERNAL $FF9C — Read/Set Bottom of Memory

**Summary:** KERNAL entry $FF9C reads or sets the bottom-of-RAM pointer. Call with the 6502 carry flag set to load the bottom-of-RAM pointer into X/Y; call with carry clear to store X/Y as the new bottom-of-memory pointer.

## Description
This KERNAL routine manages the bottom (start) of usable RAM. Behavior depends on the processor carry flag at entry:

- Carry = 1 (set): the routine loads the pointer to the bottom of RAM into the X and Y registers (pointer returned in X/Y).
- Carry = 0 (clear): the routine saves the current X/Y register pair as the bottom-of-memory pointer, changing the base of available RAM.

Changing the bottom-of-memory pointer adjusts where the system treats RAM as beginning; use with care because it affects memory available to programs and system routines.

(Use SEC to set carry or CLC to clear carry before calling; call via JSR $FF9C.)

## Key Registers
- $FF9C - KERNAL - Read/Set bottom-of-memory pointer (uses carry flag; transfers pointer via X/Y)

## References
- "ff99_read_set_top_of_memory" — paired routine that reads/sets the top-of-memory pointer (top-of-RAM)
