# RS-232 FIFO Buffer Indices ($029B-$029E)

**Summary:** Four RAM locations ($029B-$029E) hold byte indices for two 256-byte wraparound FIFO buffers used by the C64 RS-232 routines: receive start/end and transmit start/end. Indices are 0–255 and naturally wrap modulo 256 for dynamic circular-buffer behavior.

## Description
The RS-232 I/O routines use two 256-byte First-In-First-Out (FIFO) circular buffers: one for receive and one for transmit. Each buffer is managed with two single-byte indices:

- An "end" index (used to add/append data).
- A "start" index (used to remove/consume data).

Because each index is a byte (0–255), the buffer wraps automatically: if an index increments past 255 it becomes 0. Either the start or end index may be anywhere in the 256-byte region; data is added at the end index and removed from the start index. Typical behavior: if start = 100, adding will advance end towards 255 and then wrap to 0; removing advances start similarly. Buffer fullness/emptiness is determined by comparing these indices (implementation-specific compare logic not provided here).

This set of four indices allows dynamic wraparound FIFO behavior without moving buffer contents — only the indices are updated on add/remove operations. These locations are used by the RS-232 driver routines to coordinate producer (UART/interrupt) and consumer (read/processing) operations.

## Source Code
```text
667  $029B  RIDBE  - RS-232: Index to End of Receive Buffer (adds data)
668  $029C  RIDBS  - RS-232: Index to Start of Receive Buffer (removes data)
669  $029D  RODBS  - RS-232: Index to Start of Transmit Buffer (removes data)
670  $029E  RODBE  - RS-232: Index to End of Transmit Buffer (adds data)

Notes:
- Buffers are 256 bytes each; indices are single-byte (0..255) and operate modulo 256.
- "End" indices are incremented when appending a received/transmit byte.
- "Start" indices are incremented when a byte is read/consumed.
- Compare (start == end) indicates empty; full condition depends on driver convention (e.g., one slot reserved).
```

## Key Registers
- $029B-$029E - RAM - RS-232 FIFO indices: RIDBE, RIDBS, RODBS, RODBE

## References
- "tbuffer_cassette_io_buffer" — contrast with cassette buffer usage (separate 192-byte buffer)

## Labels
- RIDBE
- RIDBS
- RODBS
- RODBE
