# RS-232 Nonzero-page Registers and FIFO Indices ($0293-$02A1)

**Summary:** Nonzero-page RS-232 control and FIFO variables used by the C64 system RS-232 interface: $0293 (M51CTR pseudo 6551 control), $0294 (M51COR pseudo 6551 command), $0295-$0296 (M51AJB baud timing bytes), $0297 (RSSTAT status), $0298 (BITNUM bit count), $0299-$029A (BAUDOF bit-cell time), FIFO indices $029B-$029E, and $02A1 (ENABL — CIA#2 interrupt state bits).

**General RS-232 Storage**

This section documents the nonzero-page memory locations the C64 RS-232 system uses to hold control/command words, baud timing information, status, bit counts, and FIFO indices. The control/command words are described as "pseudo 6551" registers (software representations used by system routines). Two-byte fields are used for timing values derived from the system clock and baud rate (bit-cell timing and start-of-bit test timing). FIFO start/end indices are held as byte indices for receiver/transmitter buffers. ENABL contains a summary of active RS-232-related interrupt states derived from CIA #2 ICR: bit 4 = waiting for Receiver Edge, bit 1 = receiving data, bit 0 = transmitting data.

## Source Code

```text
NONZERO-PAGE MEMORY LOCATIONS AND USAGE FOR
RS-232 SYSTEM INTERFACE

General RS-232 storage:

$0293 - M51CTR - Pseudo 6551 control register.
$0294 - M51COR - Pseudo 6551 command register.
$0295 - M51AJB - Two bytes following the control and command registers in
          the file name field. These locations contain the baud rate for
          the start of the bit test during the interface activity, which,
          in turn, is used to calculate baud rate.
$0297 - RSSTAT - The RS-232 status register.
$0298 - BITNUM - The number of bits to be sent/received.
$0299 - BAUDOF - Two bytes that are equal to the time of one bit cell.
          (Based on system clock/baud rate.)

$029B - RIDBE - The byte index to the end of the receiver FIFO buffer.
$029C - RIDBS - The byte index to the start of the receiver FIFO buffer.
$029D - RODBS - The byte index to the start of the transmitter FIFO buffer.
$029E - RODBE - The byte index to the end of the transmitter FIFO buffer.
$02A1 - ENABL - Holds current active interrupts in the CIA #2 ICR.
          When bit 4 is turned on means that the system is waiting for the
          Receiver Edge. When bit 1 is turned on then the system is
          receiving data. When bit 0 is turned on then the system is
          transmitting data.
```

```text
Figure 6-1: Pseudo 6551 Control Register (M51CTR) Bit Definitions

Bit 7   | Bit 6   | Bit 5   | Bit 4   | Bit 3   | Bit 2   | Bit 1   | Bit 0
--------|---------|---------|---------|---------|---------|---------|---------
Stop Bit| Data Bit| Data Bit| Unused  | Baud Rate Selection
```

- **Bits 0-3:** Baud Rate Selection
  - 0000: 50 baud
  - 0001: 75 baud
  - 0010: 110 baud
  - 0011: 134.5 baud
  - 0100: 150 baud
  - 0101: 300 baud
  - 0110: 600 baud
  - 0111: 1200 baud
  - 1000: 1800 baud
  - 1001: 2400 baud
  - 1010: 3600 baud
  - 1011: 4800 baud
  - 1100: 7200 baud
  - 1101: 9600 baud
  - 1110: 19200 baud
  - 1111: External (non-standard) baud rate

- **Bits 4:** Unused

- **Bits 5-6:** Data Bits
  - 00: 8 data bits
  - 01: 7 data bits
  - 10: 6 data bits
  - 11: 5 data bits

- **Bit 7:** Stop Bits
  - 0: 1 stop bit
  - 1: 2 stop bits
```

```text
Figure 6-2: Pseudo 6551 Command Register (M51COR) Bit Definitions

Bit 7   | Bit 6   | Bit 5   | Bit 4   | Bit 3   | Bit 2   | Bit 1   | Bit 0
--------|---------|---------|---------|---------|---------|---------|---------
Parity  | Parity  | Parity  | Duplex  | Unused  | Unused  | Unused  | Handshake
```

- **Bit 0:** Handshake Protocol
  - 0: 3-wire (software) handshake
  - 1: X-wire (hardware) handshake

- **Bits 1-3:** Unused

- **Bit 4:** Duplex Mode
  - 0: Full duplex
  - 1: Half duplex

- **Bits 5-7:** Parity Mode
  - 000: No parity
  - 001: Odd parity
  - 010: Even parity
  - 011: Mark parity (parity bit always 1)
  - 100: Space parity (parity bit always 0)
```

```text
Figure 6-3: RS-232 Status Register (RSSTAT) Bit Definitions

Bit 7   | Bit 6   | Bit 5   | Bit 4   | Bit 3   | Bit 2   | Bit 1   | Bit 0
--------|---------|---------|---------|---------|---------|---------|---------
BREAK   | DSR     | Unused  | CTS     | Rx Empty| Rx Full | Framing | Parity
```

- **Bit 0:** Parity Error
  - 0: No parity error
  - 1: Parity error detected

- **Bit 1:** Framing Error
  - 0: No framing error
  - 1: Framing error detected

- **Bit 2:** Receiver Buffer Full
  - 0: Receiver buffer not full
  - 1: Receiver buffer full

- **Bit 3:** Receiver Buffer Empty
  - 0: Receiver buffer not empty
  - 1: Receiver buffer empty

- **Bit 4:** Clear to Send (CTS)
  - 0: CTS signal present
  - 1: CTS signal missing

- **Bit 5:** Unused

- **Bit 6:** Data Set Ready (DSR)
  - 0: DSR signal present
  - 1: DSR signal missing

- **Bit 7:** BREAK Signal
  - 0: No BREAK signal detected
  - 1: BREAK signal detected

## Labels
- M51CTR
- M51COR
- M51AJB
- RSSTAT
- BITNUM
- BAUDOF
- RIDBE
- RIDBS
- RODBS
- RODBE
- ENABL
