# TALK (KERNAL)

**Summary:** KERNAL routine TALK at $FFB4 (65460) commands a serial-bus device to TALK; takes device number in A (0–31), ORs bits to form the talk address and transmits the command on the serial bus. Error/status returned via READST; related routine TKSA sends secondary addresses.

## Description
Purpose: Command a device on the serial bus to TALK.

Call address: $FFB4 (hex) / 65460 (decimal)

Parameters / Communication registers:
- A = device number (0–31)

Behavior:
- The accumulator must contain a device number between 0 and 31 inclusive.
- On entry the routine ORs the device-number bits bit-by-bit to produce the serial-bus talk address, then transmits that byte as the TALK command on the IEC serial bus.
- No preparatory routines are required before calling.

Return / Errors:
- Any error/status resulting from the operation is reported via the READST routine (see "readst_kernal_routine").
- The routine does not return additional values in other registers.

Stack / Registers:
- Stack requirements: 8 bytes
- Registers affected: A

Example usage:
1) Load A with the device number (0–31).
2) JSR $FFB4 (or JSR TALK) to issue the TALK command.

## Source Code
```asm
; COMMAND DEVICE #4 TO TALK
        LDA #4
        JSR $FFB4   ; TALK
```

## References
- "tksa_kernal_routine" — Send secondary address for TALK devices using TKSA
- "readst_kernal_routine" — Check TALK status via READST

## Labels
- TALK
