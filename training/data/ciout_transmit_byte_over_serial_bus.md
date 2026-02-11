# CIOUT

**Summary:** Transmit a single byte over the C64 serial bus using full handshaking. Call address $FFA8 (65448), input in A, preparatory routines: LISTEN (and SECOND if needed); routine buffers one character and uses EOI on UNLSN.

## Description
CIOUT is a KERNAL routine that places one data byte onto the serial bus using full serial handshaking. Behavior and requirements:

- Call address: $FFA8 (hex) / 65448 (decimal).
- Communication register: A — load A with the byte to send.
- Preparatory routines: the LISTEN KERNAL routine must be used first to select and command a device to listen; if the device needs a secondary address, call SECOND as well.
- Stack requirements: 5 bytes.
- Registers affected: none (routine preserves CPU registers per KERNAL conventions).
- Error returns: status/timeout behavior follows READST (see READST for detailed status codes). If no device is listening, CIOUT will return a timeout status.
- Buffering and EOI behavior: CIOUT always buffers one character (it holds the previous character). When the caller later ends the transmission with UNLSN, the buffered character is sent with the End Or Identify (EOI) flag set, and then the UNLSN command is sent to the device.
- Typical usage: select device (LISTEN [+ SECOND]), load A with data byte, JSR CIOUT for each byte to send. Ensure the device is listening or expect a timeout.

## How to use
0) Use the LISTEN KERNAL routine (and SECOND if required by the device).  
1) Load the accumulator with the data byte (A = byte).  
2) JSR $FFA8 (CIOUT) to send the byte.  
3) When finished sending, call UNLSN to transmit the buffered character with EOI and release the device.

## Source Code
```asm
; Example: send the character 'X' over the serial bus
    LDA #'X'        ; load A with ASCII 'X'
    JSR $FFA8       ; JSR CIOUT
```

## Key Registers
- $FFA8 - KERNAL ROM - CIOUT entry point (transmit one byte with full handshaking)

## References
- "chkout_open_output_channel" — expands on higher-level channel setup that issues LISTEN before using CIOUT
- "acptr_get_byte_from_serial_bus_full_handshake" — complementary serial read routine using full handshaking

## Labels
- CIOUT
