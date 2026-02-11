# $029C RIDBS — RS-232 index to start of receive buffer

**Summary:** $029C RIDBS is a C64 RAM map entry containing the index (0–255) to the start of the 256-byte RS-232 receive buffer; it is used to remove (read/consume) data from that circular receive buffer (wraparound FIFO).

## Description
RIDBS at $029C holds a single-byte index that points to the starting byte within the 256-byte RS-232 receive buffer. When code removes a byte from the receive buffer, it uses this index to locate the byte to read and then increments (modulo 256) the index so the buffer behaves as a wraparound (circular) FIFO.

- Size: 1 byte (0x00–0xFF)
- Buffer length referenced: 256 bytes
- Purpose: read/consume bytes from the RS-232 receive FIFO by pointing to the next byte to remove
- Behavior note: index wraps around after $FF to $00 (see rs232_fifo_overview for full wraparound FIFO management)

## Key Registers
- $029C - RAM - RS-232 index to start of 256-byte receive buffer (RIDBS)

## References
- "rs232_fifo_overview" — wraparound FIFO buffer management

## Labels
- RIDBS
