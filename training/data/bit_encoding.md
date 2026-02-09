# Datassette Pulse-Pair Bit Encoding

**Summary:** Datassette data is encoded as ordered pairs of pulses (short/medium/long). Bit values and special markers are encoded using pulse pairs: Bit 0 = short+medium, Bit 1 = medium+short, Byte marker = long+medium, End-of-data = long+short.

## Encoding Details
Each data element (bit or marker) is represented by a pair of consecutive pulses. The first pulse in the pair and the second pulse together determine the meaning:

- Bit "0" = short pulse followed by medium pulse
- Bit "1" = medium pulse followed by short pulse
- Byte marker = long pulse followed by medium pulse
- End-of-data marker = long pulse followed by short pulse

Pairs are decoded sequentially; markers (byte marker, end-of-data) are distinct and treated differently from data bits.

## Decoding Algorithm
A decoder must:
1. Measure and classify the duration of the next pulse as short, medium, or long.
2. Measure and classify the following pulse.
3. Interpret the ordered pair:
   - (short, medium) => data bit 0
   - (medium, short) => data bit 1
   - (long, medium) => byte marker (use to delimit bytes)
   - (long, short) => end-of-data (stop decoding)
   - Any other pair => invalid/frame error (handle per implementation)
4. When a byte marker is encountered, group the previously read bits into a byte according to the block format (see referenced "byte_encoding" for LSB-first order, parity, and byte timing).
5. Stop when end-of-data marker is found.

(Short parenthetical: pulse classification must use the actual timing thresholds for short/medium/long determined by the recording format/hardware.)

## Source Code
```text
Pulse-pair -> Meaning
(short, medium)  -> Bit 0
(medium, short)  -> Bit 1
(long, medium)   -> Byte marker
(long, short)    -> End-of-data
```

## References
- "byte_encoding" — expands on byte marker usage, LSB-first bit order, parity and byte timing
- "data_block_structure" — expands on use of byte markers inside recorded blocks