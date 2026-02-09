# Minimal C64 Datasette Loader — Pulse Bit/Byte Encoding

**Summary:** Datasette pulse encoding for a minimal C64 loader: each data bit uses two pulses (Short/Medium = 0, Medium/Short = 1), byte boundaries are marked with Long/Medium, end-of-data with Long/Short, and the final parity pair uses inverted odd parity. Searchable terms: Datasette, pulse encoding, Long/Medium, Short/Medium, parity.

## Bit and Byte Encoding
Every data bit is encoded as two pulses (a pulse pair). The first pulse of the pair alone determines the data value; the second pulse is present as a consistency check.

- Short/Medium = 0 bit
- Medium/Short = 1 bit

Receiver rule (simple check): inspect the first pulse of each pair — Short => 0, Medium => 1. The second pulse is ignored for data purposes but used by robust loaders (e.g., KERNAL) as a consistency check.

A byte boundary is signaled by a marker pulse pair:
- Byte marker: Long/Medium (L/M)

File termination (end-of-data) is signaled by:
- End-of-data marker: Long/Short (L/S)

Complete byte layout (pulse-pair sequence, left-to-right):
L/M  S/M  S/M  S/M  S/M  S/M  S/M  S/M  S/M  M/S
marker bit0 bit1 bit2 bit3 bit4 bit5 bit6 bit7 parity

## Parity
The final pulse pair after the eight data bits is the parity pair (M/S). The source specifies "odd parity (inverted)."

- (odd parity: total number of 1 bits including parity is odd)
- (inverted: parity bit equals the logical NOT of the standard odd-parity bit)

Receiver verification: compute odd parity over the eight data bits, apply inversion as indicated by the source, and compare against the parity pulse pair (M/S). If mismatched, the byte is considered corrupt.

## References
- "get_byte_routine" — expands on detection of byte markers and reading bits