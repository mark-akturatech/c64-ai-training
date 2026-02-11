# M51CTR (659 / $293) — Mock 6551 Control Register

**Summary:** RS-232 control register at $0293 (M51CTR) for the mock 6551 UART implementation; selects baud rate (bits 3–0), word length (bits 6–5), and stop bits (bit 7). Uses 6551 control-format values but software limits mean baud rates above 2400 are not implemented.

## Description
This byte controls the RS-232 serial I/O parameters used by the emulated 6551 device: stop bits, data word length, and baud-rate selection. The layout follows the 6551 UART control register format. Bit 4 is unused. Several standard 6551-configurable baud rates (above 2400 baud) are not implemented by the C64 software emulator.

When opening the RS-232 device (device number 2) the first character of the filename is stored into this location; BASIC can set the register by using CHR$ in the filename. Example: OPEN 2,2,0,CHR$(6+32) writes value 38 to $0293 (6 = 300 baud code, 32 = 7-data-bit code, stop-bit = 0 for 1 stop).

Composing the register value:
- Bit 7 = stop-bit flag (0 = 1 stop bit, 1 = 0 stop bits)
- Bits 6–5 = word length code (00=8, 01=7, 10=6, 11=5)
- Bit 4 = unused (0)
- Bits 3–0 = baud-rate code (see table in Source Code)

## Source Code
```text
M51CTR ($0293) -- Bit definitions and numeric values

Bit 7: STOP Bits
 0   -> 1 STOP Bit
 1   -> 0 STOP Bits
(bit value 128 when set)

Bits 6-5: WORD LENGTH (bit values: 64 and 32)
 00 (0)  = 8 DATA Bits
 01 (32) = 7 DATA Bits
 10 (64) = 6 DATA Bits
 11 (96) = 5 DATA Bits

Bit 4: Unused (no function)

Bits 3-0: BAUD RATE (values 0-15)
 0000 (0)  = Nonstandard (User-Defined) Rate (Not Implemented)
 0001 (1)  = 50 Baud
 0010 (2)  = 75 Baud
 0011 (3)  = 110 Baud
 0100 (4)  = 134.5 Baud
 0101 (5)  = 150 Baud
 0110 (6)  = 300 Baud
 0111 (7)  = 600 Baud
 1000 (8)  = 1200 Baud
 1001 (9)  = 1800 Baud
 1010 (10) = 2400 Baud
 1011 (11) = 3600 Baud (Not Implemented on the Commodore 64)
 1100 (12) = 4800 Baud (Not Implemented on the Commodore 64)
 1101 (13) = 7200 Baud (Not Implemented on the Commodore 64)
 1110 (14) = 9600 Baud (Not Implemented on the Commodore 64)
 1111 (15) = 19200 Baud (Not Implemented on the Commodore 64)

Example:
 OPEN 2,2,0,CHR$(6+32)
  bits3-0 = 6  -> 300 baud
  bits6-5 = 01 -> 7 data bits (value 32)
  bit7    = 0  -> 1 stop bit
  Combined value = 32 + 6 = 38 (decimal) written to $0293
```

## Key Registers
- $0293 - Mock 6551 (M51CTR) - RS-232 control register (baud rate code, word length, stop bits)

## References
- "baudoftime_prescaler" — prescaler values for CIA timers and BAUDOF determine actual bit timing  
- "m51cdr_rs232_command_register" — command register complements: parity/duplex/handshake controls

## Labels
- M51CTR
