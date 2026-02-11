# C64 RAM Map: $029B-$029E — RS-232 FIFO Buffer Indices

**Summary:** RAM addresses $029B-$029E hold the 8‑bit indices for the two 256‑byte RS‑232 FIFO buffers (receive and transmit). These indices implement dynamic wraparound (circular) buffers: start/end indices are advanced modulo 256 to enqueue/dequeue bytes.

## Overview
The C64 reserves two 256‑byte First‑In, First‑Out (FIFO) buffers for RS‑232 receive and transmit data. The buffers are implemented as dynamic wraparound (circular) buffers: both the start (read) index and the end (write) index are 8‑bit values that may point to any byte within their 256‑byte buffer area. Indices naturally wrap modulo 256 (0–255).

Behavioral details preserved from the source:
- Each buffer uses two indices: a start (beginning) index and an end index.
- Indices are single bytes, so advancing past 255 wraps to 0.
- The start and end pointers move independently as bytes are read (dequeue) and written (enqueue); either pointer can be anywhere in the 0–255 range.
- Example from source: if the start index is 100, the buffer fills toward 255 and then wraps to 0.

The indices at $029B–$029E are used to maintain and manage buffer contents (tracking where to read next and where to write next). The source refers to these indices by internal labels; see References for per‑index expansions.

## Key Registers
- $029B-$029E - RAM - Byte indices for RS-232 256‑byte FIFO receive/transmit buffers:
  - $029B = rs232_ridbs — Receive buffer: index to start (beginning) of receive buffer
  - $029C = rs232_ridbe — Receive buffer: index to end (write position) of receive buffer
  - $029D = rs232_rodbs — Transmit buffer: index to start (beginning) of transmit buffer
  - $029E = rs232_rodbe — Transmit buffer: index to end (write position) of transmit buffer

## References
- "rs232_ridbe" — index to end of receive buffer
- "rs232_ridbs" — index to start of receive buffer
- "rs232_rodbs" — index to start of transmit buffer
- "rs232_rodbe" — index to end of transmit buffer

## Labels
- RS232_RIDBS
- RS232_RIDBE
- RS232_RODBS
- RS232_RODBE
