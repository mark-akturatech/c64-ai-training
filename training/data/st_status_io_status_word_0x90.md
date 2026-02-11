# Kernal I/O Status Word (ST) at $90

**Summary:** Kernal zero-page byte at $0090 (decimal 144) contains the I/O Status Word (ST) updated and tested by Kernal I/O routines and returned to BASIC via the reserved variable ST; contains bit flags for cassette file I/O (short/long block, unrecoverable, checksum, EOF) and serial device errors/timeouts/EOI/device absent.

## Description
This zero-page location is checked and updated by Kernal routines that open I/O channels or perform input/output. Its value is almost always the same value exposed to BASIC as the reserved (read-only) variable ST (BASIC does not allow an assignment such as ST=4).

Status bits are used for different device classes (cassette vs serial). Tests against ST typically use bitwise AND; for example, in BASIC the expression IF ST AND 64 is true when End Of File (EOF) has been reached while reading a cassette file.

Cassette status bits and meanings:
- Bit 2 (value 4)  = Short Block
- Bit 3 (value 8)  = Long Block
- Bit 4 (value 16) = Unrecoverable error (read) / mismatch
- Bit 5 (value 32) = Checksum error
- Bit 6 (value 64) = End Of File (EOF)

Serial device status bits and meanings:
- Bit 0 (value 1)   = Time out (Write)
- Bit 1 (value 2)   = Time out (Read)
- Bit 6 (value 64)  = EOI (End Or Identify)
- Bit 7 (value 128) = Device not present

Typical use: test EOF in BASIC with IF ST AND 64 THEN ... — this checks for the cassette EOF flag (bit 6). The same bit position (bit 6) is used for EOI on serial devices.

## Key Registers
- $0090 - Kernal - I/O Status Word (ST): bitfield holding cassette and serial device status flags (see bit map in Description)

## References
- "kernal_zero_page_overview_0x90_0xff" — overview of the Kernal zero-page area containing $90
- "stkey_stop_key_and_keyboard_matrix_0x91" — nearby zero-page location and STOP-key/keyboard matrix handling
- "rs232_status_663_$297" — RS-232 status codes at location 663 (hex $297)

## Labels
- ST
