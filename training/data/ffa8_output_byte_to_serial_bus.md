# $FFA8 — Output a byte to the serial bus (KERNAL)

**Summary:** KERNAL vector $FFA8 sends the accumulator (A) as a data byte to the IEC/C64 serial bus using full handshaking; requires a prior LISTEN ($FFB1). Transmission is buffered (one character) and completed by UNLISTEN ($FFAE); errors/timeouts appear in the I/O status word ($FFB7).

## Description
This KERNAL routine transmits one data byte from the accumulator onto the serial bus using full device handshaking. Preconditions and behavior:

- Preconditions: The device must have been selected with LISTEN ($FFB1) before calling this routine; otherwise a timeout will occur.
- Input: A contains the byte to send.
- Buffering: The routine always buffers one character rather than sending it immediately on call.
- Completion: When UNLISTEN ($FFAE) is later called to terminate the data transfer, the buffered character is sent with EOI set, and then the UNLISTEN command is transmitted to the device.
- Error reporting: Timeouts or other transmission errors are reported in the C64 I/O status word; read the status word with $FFB7 to inspect error bits and conditions.

(Calling: JSR $FFA8 with A = data byte)

## Key Registers
- $FFA8 - KERNAL - Output a byte to the serial bus (A = data; requires LISTEN $FFB1; buffered; completed by UNLISTEN $FFAE)

## References
- "ffb1_command_listen" — explains LISTEN requirement and addressing a device on the serial bus  
- "ffae_command_unlisten" — explains how UNLISTEN completes transfer and sends buffered char with EOI  
- "ffb7_read_io_status_word" — explains how to read and interpret the I/O status word (error/timeout reporting)
