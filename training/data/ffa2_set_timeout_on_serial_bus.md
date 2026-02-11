# KERNAL $FFA2 — Set timeout on serial bus

**Summary:** KERNAL entry $FFA2 sets the serial-bus timeout flag; it tests accumulator bit 7 (A bit7 = 0 enables 64 ms timeouts, A bit7 = 1 disables timeouts). Used to detect device non-response conditions (for example, "file not found" on OPEN).

## Description
JSR $FFA2 sets the C64 serial-bus timeout behavior used during device handshakes. The routine examines bit 7 of the accumulator:

- A bit 7 = 0 (A & $80 = 0): enable timeouts — the computer will wait ~64 milliseconds for a device to respond to the DAV (data valid) handshake signal. If no response occurs within that interval, the KERNAL recognizes an error and abandons the handshake.
- A bit 7 = 1 (A & $80 ≠ 0): disable timeouts — the KERNAL will not abort on the 64 ms timeout.

Only bit 7 is significant to this routine; other accumulator bits are ignored. Typical usage examples:
- Enable timeouts: `LDA #$00` / `JSR $FFA2`
- Disable timeouts: `LDA #$80` / `JSR $FFA2`

NOTE: The timeout feature is used by the KERNAL to detect conditions such as "file not found" when attempting to OPEN a disk file (device non-response within the timeout interval).

**[Note: Source may contain a minor typographical error — duplicated word "the".]**

## Key Registers
- $FFA2 - KERNAL ROM - Set timeout on serial bus (JSR $FFA2)

## References
- "ffb7_read_io_status_word" — expands on checking device/status after serial operations and error conditions
