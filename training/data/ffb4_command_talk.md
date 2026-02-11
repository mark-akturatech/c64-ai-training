# $FFB4 — Command serial bus device to TALK

**Summary:** KERNAL ROM vector $FFB4 — command a device on the C64 serial bus to TALK. Load the accumulator (A) with device number $04–$1E (4–30 decimal) and JSR $FFB4; routine converts the device number to a talk address and transmits the TALK command on the serial bus.

## Description
JSR $FFB4 is the KERNAL service to initiate a TALK command to a peripheral on the IEC serial bus (disk/other devices). The caller must place the target device number in the accumulator (valid range 4..30). When executed, the routine:

- Converts the device number in A into the corresponding IEC TALK address.
- Transmits the TALK command byte(s) on the serial bus so the addressed device will start sending data.

This routine performs only the TALK command transmission; subsequent serial transfers (reading bytes) are handled by other KERNAL routines (see References).

## Calling convention
- Input: A = device number (4..30)
- Call: JSR $FFB4
- Result: TALK command sent on IEC serial bus to the device corresponding to the number in A

(Use $FFA5 to read incoming bytes after TALK, and $FF96 to send a secondary address after TALK — see References.)

## Key Registers
- $FFB4 - KERNAL ROM - Command serial bus device to TALK (expects A = device number 4..30)

## References
- "ffa5_input_byte_from_serial_bus" — expands on reading data after TALK
- "ff96_send_secondary_address_after_talk" — expands on sending a secondary address after TALK

## Labels
- TALK
