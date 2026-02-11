# M51CDR (location 660 / $294) — RS-232 Mock 6551 Command Register

**Summary:** M51CDR at $0294 is a mock 6551 UART command register for RS-232 on the C64; it selects parity (bits 7-5, mask $E0), duplex (bit 4, $10), and handshake protocol (bit 0, $01). The second filename character passed to OPEN for device 2 is stored here to set these fields.

## Description
This location implements the command-register functions of a 6551 UART: it configures parity type, duplex mode, and handshaking protocol used by the RS-232 device.

- Parity selection is encoded in bits 7-5 (mask $E0). If the low bit of that 3-bit field is clear the device uses "no parity"; specific values select odd/even/mark/space.
- Duplex (bit 4, mask $10): 0 = full duplex, 1 = half duplex.
- Bits 3-1 are unused/reserved.
- Handshake protocol (bit 0, mask $01): 0 = 3-line handshaking, 1 = X‑line handshaking.

The C64 stores the second character of the filename supplied in the OPEN statement for RS-232 (device 2) into this location. That byte value directly selects parity/duplex/handshake according to the bit assignments.

See the Source Code section for the exact bit map and an OPEN example.

## Source Code
```text
Register: M51CDR  (location 660, $0294) — Mock 6551 Command Register

Bit layout (7..0):
 7   6   5   4   3   2   1   0
[ P2  P1  P0  D  -   -   -   H ]
 P2..P0 = parity field (bits 7-5)  mask $E0
 D      = duplex (bit 4)           mask $10
 bits3-1 = unused/reserved
 H      = handshake protocol (bit 0) mask $01

Parity field values (bits7-5 / masked values):
 - $00, $40, $80, $C0 (binary XX0) = No Parity generated or checked
 - $20 (001) = Odd Parity transmitted and received
 - $60 (011) = Even Parity transmitted and received
 - $A0 (101) = Mark Parity transmitted and received
 - $E0 (111) = Space Parity transmitted and received

Duplex (bit 4):
 - $00 = Full duplex
 - $10 = Half duplex

Handshake (bit 0):
 - $00 = 3-line handshaking
 - $01 = X-line handshaking

Example from BASIC:
The second character of the filename supplied to OPEN is stored here.
Example statement:
```
```basic
OPEN 2,2,0,CHR$(6+32)+CHR$(32+16)
```
```text
The second character is CHR$(32+16) = CHR$(48) (decimal 48 = $30).
Value $30 = $20 (odd parity) + $10 (half duplex) => odd parity, half duplex, 3-line handshake (bit0 = 0).
```

## Key Registers
- $0294 - M51CDR - Mock 6551 Command Register (parity bits $E0, duplex $10, handshake $01)

## References
- "m51ctr_rs232_control_register" — expands on M51CTR (sets baud/length/stop bits) while M51CDR sets parity/duplex/handshakes

## Labels
- M51CDR
