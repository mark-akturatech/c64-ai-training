# FRESPC ($35-$36) — Temporary Pointer for Strings

**Summary:** FRESPC ($0035-$0036) is a zero-page two‑byte pointer used by Commodore BASIC string routines. It holds a pointer to the most recently added or moved string and is used as a temporary working pointer while building or relocating string text; it is used alongside FREETOP and STREND (string area boundary managers).

## Description
FRESPC is a zero‑page temporary pointer (little‑endian two bytes at $0035/$0036) used internally by the BASIC string-manipulation routines. When the interpreter constructs or relocates string text, the routines set FRESPC to point to the current string being worked on — effectively the most recently added or moved string — and use it as a scratch/address pointer while copying, appending, or moving characters.

FRESPC is part of BASIC’s string-area management scheme and is used in conjunction with FREETOP and STREND, which define the free/top and end boundaries of the string text area. The name "freetop_string_text_pointer" is an alternate search term that expands on FRESPC’s role as a temporary working pointer when updating the string text area.

## Key Registers
- $0035-$0036 - Zero Page - FRESPC: temporary two-byte pointer to the most recently added/moved BASIC string (working pointer for building/relocating string text)

## References
- "freetop_string_text_pointer" — expands on FRESPC as a temporary working pointer used when updating the string text area whose boundaries are managed by FREETOP and STREND

## Labels
- FRESPC
