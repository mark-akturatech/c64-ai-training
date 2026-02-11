# Kernel I/O message table (ROM)

**Summary:** Kernel I/O message strings stored in ROM at $F0BD–$F127; PETSCII-encoded status/prompts (I/O ERROR, SEARCHING, FOR, PRESS PLAY ON TAPE, LOADING, SAVING, VERIFYING, FOUND, OK). Used by kernel print routines (see display_control_io_message_if_direct_mode).

## Description
This chunk is the Commodore 64 kernel's table of user-facing I/O message strings, located in ROM starting at $F0BD. The entries are PETSCII bytes (control codes such as $0D = CR, $A0 = space are used inline). These strings are used by kernel routines that report tape/disk status and prompts (e.g., "PRESS PLAY ON TAPE", "I/O ERROR"). The kernel prints them when direct or device-status reporting is required (see referenced routine name).

Listed strings (start address → human-readable form):
- $F0BD → "I/O ERROR" (terminator/control bytes present)
- $F0C6 → "SEARCHING"
- $F0D1 → "FOR"
- $F0D4 → "FOR" (duplicate/continuation area in table)
- $F0D8 → "PRESS PLAY ON TAPE"
- $F0E8 → "PRESS RECORD & PLAY ON TAPE"
- $F0F3 → "RECORD & PLAY ON TAPE" (continuation)
- $F103 → "LOAD" / "LOADING" (with CR markers)
- $F10E → "SAVING"
- $F116 → "VERIFYING"
- $F11E → "FOUND"
- $F127 → "OK"

These strings include CR ($0D) and PETSCII spacing ($A0) bytes to control printing format. The kernel I/O-print routine indexes into this table and outputs the PETSCII bytes directly.

## Source Code
```text
.:F0BD 0D 49 2F 4F 20 45 52 52  I/O ERROR #
.:F0C6 52 20 A3 0D 53 45 41 52
.:F0C9 0D 53 45 41 52 43 48 49  SEARCHING
.:F0D1 4E 47 A0 46 4F 52 A0 0D
.:F0D4 46 4F 52 A0 0D 50 52 45  FOR
.:F0D8 0D 50 52 45 53 53 20 50  PRESS PLAY ON TAPE
.:F0E0 4C 41 59 20 4F 4E 20 54
.:F0E8 41 50 C5 50 52 45 53 53
.:F0EB 50 52 45 53 53 20 52 45  PRESS RECORD & PLAY ON TAPE
.:F0F3 43 4F 52 44 20 26 20 50
.:F0FB 4C 41 59 20 4F 4E 20 54
.:F103 41 50 C5 0D 4C 4F 41 44
.:F106 0D 4C 4F 41 44 49 4E C7  LOADING
.:F10E 0D 53 41 56 49 4E 47 A0  SAVING
.:F116 0D 56 45 52 49 46 59 49  VERIFYING
.:F11E 4E C7 0D 46 4F 55 4E 44
.:F120 0D 46 4F 55 4E 44 A0 0D  FOUND
.:F127 0D 4F 4B 8D              OK
```

Notes on byte meanings (for reference):
- $0D — carriage return (CR) / end-of-line in PETSCII (controls kernel printing)
- $A0 — PETSCII space (non-zero high-bit space used in kernel strings)

## References
- "display_control_io_message_if_direct_mode" — kernel routine that prints these I/O messages when direct mode is enabled
