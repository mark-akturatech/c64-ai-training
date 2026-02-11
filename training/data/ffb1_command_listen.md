# KERNAL $FFB1 — LISTEN (command device to receive on serial bus)

**Summary:** KERNAL entry $FFB1 issues an IEC serial-bus LISTEN command. Call with A = device number (4–31); the routine converts that device number to a listen address and transmits it so the device enters listen mode.

## Description
JSR $FFB1 tells a device on the Commodore serial (IEC) bus to enter LISTEN (receive) mode. Before calling:
- Load the accumulator (A) with the target device number (valid range 4..31).
- Device numbers >= 4 refer to serial bus devices.

Behavior:
- The routine converts the device number in A to the appropriate listen address for the serial bus protocol and transmits that byte as a command on the bus.
- After the command is sent, the specified device will be in LISTEN mode and ready to accept subsequent data bytes (sent with the appropriate output/send routines).

Notes:
- This entry only sends the LISTEN command itself; follow-up bytes (secondary address or data) must be sent using the serial output routines (see referenced entries).
- The source text does not document return flags, error reporting, or timing; consult related KERNAL routines for bus collision/handshake handling.

## Key Registers
- $FFB1 - KERNAL ROM - LISTEN command entry (call with A = device number 4..31)

## References
- "ffa8_output_byte_to_serial_bus" — expands on bytes sent after LISTEN (output procedure)
- "ff93_send_secondary_address_after_listen" — expands on sending a secondary address following LISTEN

## Labels
- LISTEN
