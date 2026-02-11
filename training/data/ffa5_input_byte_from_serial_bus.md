# KERNAL $FFA5 — Input a byte from the serial bus (full handshaking)

**Summary:** KERNAL entry $FFA5 reads one data byte from the IEC serial bus using full handshaking and returns it in the 6502 accumulator A. Requires a prior TALK ($FFB4); send a secondary address with TKSA ($FF96) if needed. Errors are reported via the I/O status word (READST $FFB7).

## Operation
This KERNAL routine performs a full-handshake read of one data byte from a device on the C64 IEC serial bus (IEC serial bus). Before calling:

- The device must have been put into talk mode by calling TALK ($FFB4). (TALK — set device to talk mode)
- If the device expects a secondary address/command after TALK, send it with TKSA ($FF96) first. (TKSA — send secondary address)

Call convention:
- Invoke the routine (JSR $FFA5).
- On return the received data byte is placed in the accumulator A.
- Any I/O errors or status conditions are recorded in the I/O status word; read it with READST ($FFB7) to examine error bits.

Behavior notes:
- The routine implements full IEC handshaking for the byte transfer (clock/handshake protocol managed by the KERNAL).
- It is intended for use with serial devices already commanded to send data; it does not perform TALK or TKSA itself.

## References
- "ffb4_command_talk" — expands on must TALK before reading
- "ff96_send_secondary_address_after_talk" — expands on send secondary address for TALK devices
- "ffb7_read_io_status_word" — expands on checking errors/status via READST
