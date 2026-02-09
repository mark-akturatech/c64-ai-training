# CLRCHN ($FFCC)

**Summary:** CLRCHN ($FFCC) — KERNAL routine to close default I/O files, send UNTALK/UNLISTEN on the serial bus when required, and restore keyboard/screen I/O. Uses registers A and X; indirect vector referenced via ($0322) and $F333.

## Description
CLRCHN closes the default I/O channels and restores the system to keyboard/screen I/O. When active serial bus connections exist, it issues the appropriate device-level teardown commands (UNTALK and/or UNLISTEN) as needed on the IEC serial bus. The routine uses the A and X registers (caller must preserve them if needed).

The documented entry point is $FFCC. The implementation is reached indirectly (vectored) via the address held at ($0322) and then through $F333 (as noted in the source).

Notes:
- CLRCHN may call or otherwise invoke the routines that implement UNTALK and UNLISTEN when necessary; see those routines for details of serial-bus command sequences and side effects.
- Registers affected: A, X (destroyed by the call).

## Source Code
(omitted — no assembly or register tables provided in this chunk)

## Key Registers
(omitted — this chunk documents a KERNAL entry, not hardware registers)

## References
- "untalk" — describes UNTALK behavior and its KERNAL entry ($FFAB)
- "unlstn" — describes UNLISTEN behavior and its KERNAL entry ($FFAE)