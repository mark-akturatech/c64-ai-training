# CIA #2 PC (PC2) — User Port handshaking

**Summary:** CIA #2 ($DD00-$DD0F) provides a PC (PC2) handshaking output wired to the User Port; PC2 pulses low for one cycle immediately after any read or write of Port B, allowing external devices to detect Port B transfers.

**Behavior**
The Peripheral Control (PC) line of CIA #2 (commonly called PC2) is physically connected to the C64 User Port and acts as a hardware handshaking signal. On CIA #2, PC2 is driven low for one cycle following a read or a write access to the Port B register. External hardware attached to the User Port can use this single-cycle low pulse to detect when the C64 has read from or written to CIA #2 Port B (handshaking).

CIA #1 also has a PC line, but that PC line is not connected to any external pin on the C64 and therefore cannot be used for the User Port handshaking described above.

**User Port Pinout**
The Commodore 64 User Port is a 24-pin edge connector with the following pin assignments:


In this pinout:
- Pin 8 is designated as `/PC2`, corresponding to the PC2 handshaking line from CIA #2.

## Source Code

```
  1  GND        A  GND
  2  +5V        B  /FLAG2
  3  /RESET     C  PB0
  4  CNT1       D  PB1
  5  SP1        E  PB2
  6  CNT2       F  PB3
  7  SP2        H  PB4
  8  /PC2       J  PB5
  9  ATN        K  PB6
 10  9VAC       L  PB7
 11  9VAC       M  PA2
 12  GND        N  GND
```


## Key Registers
- $DC00-$DC0F - CIA 1 - PC line not connected to external User Port
- $DD00-$DD0F - CIA 2 - Port B read/write triggers PC2 low pulse (User Port handshaking)

## References
- Commodore 64 Programmer's Reference Guide: User Port Pinout
- C64-Wiki: User Port Pinout
- Hardware Book: C64/128 User Port