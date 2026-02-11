# READST ($FFB7 / $FE07)

**Summary:** KERNAL function READST at $FFB7 (real implementation at $FE07) retrieves the device status (ST variable) and clears the RS-232 status flag; result returned in A. Uses the A register.

**Description**

READST is the KERNAL entry for obtaining the current device status (the ST variable) from the selected device/channel. When called, it clears the RS-232 status and places the device status byte in the A register. The routine uses the A register (caller should not expect A to be preserved).

- **Entry vector:** $FFB7
- **Real subroutine address:** $FE07
- **Calling/return convention:** result in A; routine will overwrite A

The status byte returned by READST provides information about the outcome of the most recent I/O operation. Each bit in the status byte corresponds to a specific condition or error:

- **Bit 0 (Value 1):** Write timeout (serial bus)
- **Bit 1 (Value 2):** Read timeout (serial bus)
- **Bit 2 (Value 4):** Short block (tape read)
- **Bit 3 (Value 8):** Long block (tape read)
- **Bit 4 (Value 16):** Unrecoverable read error (tape read) or verify mismatch (tape verify/load)
- **Bit 5 (Value 32):** Checksum error (tape read)
- **Bit 6 (Value 64):** End of file (tape read) or EOI (serial bus)
- **Bit 7 (Value 128):** End of tape (tape read) or device not present (serial bus)

For RS-232 operations, the status byte bits are defined as follows:

- **Bit 0 (Value 1):** Parity error
- **Bit 1 (Value 2):** Framing error
- **Bit 2 (Value 4):** Receiver buffer overrun
- **Bit 3 (Value 8):** Receiver buffer empty
- **Bit 4 (Value 16):** CTS signal missing
- **Bit 5 (Value 32):** Not used
- **Bit 6 (Value 64):** DSR signal missing
- **Bit 7 (Value 128):** Break detected

## Source Code

```assembly
; Example: Check for end of file during read
JSR READST
AND #64  ; Check EOF bit (EOF = End of File)
BNE EOF  ; Branch on EOF
```

## Key Registers

- $FFB7 - KERNAL - READST entry vector
- $FE07 - KERNAL ROM - READST actual routine address

## References

- "setlfs" — file/device setup (uses device numbers and related status information read by READST)

## Labels
- READST
