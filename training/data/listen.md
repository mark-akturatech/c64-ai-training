# LISTEN ($FFB1)

**Summary:** KERNAL entry LISTEN ($FFB1) — Sends a LISTEN command on the Commodore serial IEC bus. Input: A = device number (uses A). Real address: $ED0C.

## Description
Sends the IEC "LISTEN" command to a device on the serial bus. The device number to address must be supplied in the A register; the routine uses (clobbers) A. This is the KERNAL vector at $FFB1 which branches/JSRs into the ROM routine located at physical address $ED0C.

Typical call sequence (high level):
- Call LISTEN with A = device number to start a write/listen session.
- Optionally send a secondary address (see LSTNSA).
- Send data bytes using IECOUT.

This entry only issues the LISTEN command; subsequent operations (secondary address, data transfer, and closing the session) are handled by other KERNAL routines.

## Key Registers
- $FFB1 - KERNAL ROM - LISTEN vector (call entry)
- $ED0C - KERNAL ROM - physical routine address for LISTEN

## References
- "lstnsa" — expands on sending a secondary address after LISTEN (LSTNSA $FF93)
- "iecout" — expands on sending data after LISTEN via IECOUT ($FFA8)

## Labels
- LISTEN
