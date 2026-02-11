# ACPTR — Read one byte from serial bus (KERNAL)

**Summary:** ACPTR is the KERNAL routine to read one byte from a device on the C64 serial bus using full handshaking; the byte is returned in the accumulator (A). Preparatory calls: TALK (select device) and TKSA (if a secondary address is needed); errors are reported via the status word (use READST to retrieve it).

## Description
ACPTR performs a full-handshake read of one byte from the IEC serial bus (e.g., a disk drive) and returns the data in A. It does not perform device selection — the calling program must first command the device to talk using the TALK routine. If the target device requires a secondary address (logical file or command), the TKSA KERNAL routine must be used before calling ACPTR.

Error and status information from the operation are not returned in A; instead ACPTR sets the KERNAL status word. Use the READST routine to read that status word after a transfer to detect errors.

## How to Use
0) Command the device to prepare to send data (JSR TALK; if needed, JSR TKSA to send secondary address).  
1) JSR ACPTR — performs one full-handshake read and places the byte in A.  
2) Store or use the returned byte (e.g., STA DATA).  
3) To check for errors, call READST to read the status word.

## Source Code
```asm
; GET A BYTE FROM THE BUS
JSR ACPTR
STA DATA
```

## References
- "chkin_open_input_channel" — expands on input-channel setup (TALK/TKSA for serial devices)
- "ciout_transmit_byte_over_serial_bus" — complementary routine for sending bytes (LISTEN/SECOND preparatory calls)

## Labels
- ACPTR
