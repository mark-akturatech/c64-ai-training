# RIDBE ($029B) — RS-232 Index to End of Receive Buffer

**Summary:** $029B (RIDBE) is a KERNAL workspace byte holding the index to the ending byte within the 256-byte RS-232 receive buffer; it is used when adding incoming serial data to that buffer.

## Description
RIDBE at $029B contains the offset (index) that points to the end position within the RS-232 receive buffer used by the C64 KERNAL. The buffer is 256 bytes long, so the index is a single byte (0–255) and naturally wraps as a ring buffer when bytes are added (wraparound FIFO behavior).

When new RS-232 bytes arrive, the KERNAL uses RIDBE to determine where to store the next byte in the receive buffer and then updates RIDBE accordingly.

## Key Registers
- $029B - KERNAL - RS-232: Index to end of 256-byte receive buffer (used for adding incoming bytes)

## References
- "rs232_fifo_overview" — expands on wraparound FIFO buffer management

## Labels
- RIDBE
