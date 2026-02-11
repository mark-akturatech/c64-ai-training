# RS-232 pseudo-6551 registers (locations 659-663 / $293-$297)

**Summary:** Describes the Commodore 64's RAM-based emulation of a 6551 UART/ACIA at $0293-$0297 used for RS-232 I/O; filenames supplied to OPEN device 2 populate $0293-$0296, and some 6551 features (nonstandard/higher baud rates, external clock) are not implemented.

**Description**

The C64 ROM/software emulates a 6551 UART (ACIA) by reserving RAM locations 659–663 (hex $0293–$0297) to mimic the 6551 chip's control, command, and status registers. These RAM locations are used by the internal RS-232 handling routines rather than a discrete 6551 IC.

When device 2 (the RS-232 device) is OPENed, an optional filename of up to four characters may be supplied. Those up-to-four characters are copied into RAM locations:
- $0293 (659) – Control Register
- $0294 (660) – Command Register
- $0295 (661) – Nonstandard Baud Rate Low Byte (not implemented)
- $0296 (662) – Nonstandard Baud Rate High Byte (not implemented)

The first two characters of the filename are used to configure the RS-232 interface:
- The first character sets the Control Register ($0293), defining baud rate, word length, and stop bits.
- The second character sets the Command Register ($0294), defining parity, duplex mode, and handshaking.

The last two bytes ($0295 and $0296) are intended to specify nonstandard baud rates but are not implemented in the C64 emulator.

The ROM reserves RAM space for emulating other 6551 features such as selection between an internal baud-rate generator and an external clock crystal, but the internal software does not implement those features (no external-clock support, no nonstandard/higher baud rates beyond the implemented set).

This RAM block thus acts as a pseudo-6551 interface: software may read/write these bytes, and the OPEN filename mechanism writes up to 4 characters into the first four bytes, but the full hardware semantics and many 6551 register behaviors are not present in the C64 implementation.

## Source Code

```text
Control Register ($0293 / 659):
Bit 7: Stop Bits
  0 = 1 Stop Bit
  1 = 2 Stop Bits
Bits 6-5: Word Length
  00 = 8 Bits
  01 = 7 Bits
  10 = 6 Bits
  11 = 5 Bits
Bits 4-0: Baud Rate
  00000 = Nonstandard (User-Defined) Rate (Not Implemented)
  00001 = 50 Baud
  00010 = 75 Baud
  00011 = 110 Baud
  00100 = 134.5 Baud
  00101 = 150 Baud
  00110 = 300 Baud
  00111 = 600 Baud
  01000 = 1200 Baud
  01001 = 1800 Baud
  01010 = 2400 Baud
  01011 = 3600 Baud (Not Implemented)
  01100 = 4800 Baud (Not Implemented)
  01101 = 7200 Baud (Not Implemented)
  01110 = 9600 Baud (Not Implemented)
  01111 = 19200 Baud (Not Implemented)

Command Register ($0294 / 660):
Bit 7: Parity Mode
  0 = Odd Parity
  1 = Even Parity
Bit 6: Parity Enable
  0 = Parity Disabled
  1 = Parity Enabled
Bit 5: Transmit Control
  0 = RTS Control
  1 = X-ON/X-OFF Protocol
Bit 4: Receiver Control
  0 = Receiver Disabled
  1 = Receiver Enabled
Bit 3: Transmitter Control
  0 = Transmitter Disabled
  1 = Transmitter Enabled
Bits 2-1: Duplex Mode
  00 = Full Duplex
  01 = Reserved
  10 = Reserved
  11 = Local Loopback
Bit 0: Data Terminal Ready (DTR)
  0 = DTR Inactive
  1 = DTR Active

Status Register ($0297 / 663):
Bit 7: Break Detected
  1 = Break Signal Detected
Bit 6: DSR (Data Set Ready) Signal Missing
  1 = DSR Signal Missing
Bit 5: Unused
Bit 4: CTS (Clear to Send) Signal Missing
  1 = CTS Signal Missing
Bit 3: Receiver Buffer Empty
  1 = Receiver Buffer Empty
Bit 2: Receiver Buffer Overrun
  1 = Receiver Buffer Overrun
Bit 1: Framing Error
  1 = Framing Error
Bit 0: Parity Error
  1 = Parity Error
```

## Key Registers

- $0293 (659) – Control Register: Configures baud rate, word length, and stop bits.
- $0294 (660) – Command Register: Configures parity, duplex mode, and handshaking.
- $0295 (661) – Nonstandard Baud Rate Low Byte: Intended for user-defined baud rates (not implemented).
- $0296 (662) – Nonstandard Baud Rate High Byte: Intended for user-defined baud rates (not implemented).
- $0297 (663) – Status Register: Indicates error status of RS-232 data transmission.

## References

- "Commodore 64 Programmer's Reference Guide" – Detailed descriptions of RS-232 registers and configurations.
- "Mapping the Commodore 64" – Memory map and register details.
- "C64 OS Networking Guide" – Practical applications and limitations of C64's RS-232 implementation.