# DOS single-byte checksum (hashtotal) — EOR (XOR) method

**Summary:** Single-byte checksum (hashtotal) used by Commodore DOS to detect read errors on header and data blocks; computed by Exclusive-OR (EOR/XOR) of bytes (DOS EORs bytes prior to GCR conversion). Applies to header block and data block verification.

**Checksums**
Disk files are recorded once on disk (no cyclic redundancy like tape duplication), so DOS uses a single-byte hashtotal to detect read errors for header blocks and data blocks. The checksum (hashtotal) is formed by Exclusive-ORing (EOR) the bytes together: each byte in the block is combined with the running checksum using the bitwise EOR operation. The final single-byte result is stored and later compared on read to detect corruption.

Algorithm (conceptual):
- Initialize a one-byte accumulator to 0.
- For each byte in the header or data block: accumulator = accumulator EOR byte.
- The accumulator after processing all bytes is the hashtotal (single-byte checksum).

Note: DOS performs the EOR accumulation on the raw bytes before they are converted to/from GCR (Group Code Recording) on disk.

**Worked Example of Header Checksum Calculation:**

Consider a header block with the following bytes:

- Sector Number: $00 (0)
- Track Number: $12 (18)
- ID LO: $58 (88)
- ID HI: $5A (90)

Steps to calculate the checksum:

1. **Initialize the checksum accumulator to $00:**
   - Accumulator = $00

2. **EOR with Sector Number:**
   - Accumulator = $00 EOR $00 = $00

3. **EOR with Track Number:**
   - Accumulator = $00 EOR $12 = $12

4. **EOR with ID LO:**
   - Accumulator = $12 EOR $58 = $4A

5. **EOR with ID HI:**
   - Accumulator = $4A EOR $5A = $10

Final checksum (hashtotal) is $10.

## Source Code
```text
EOR Truth Table

0 EOR 0 = 0
0 EOR 1 = 1
1 EOR 0 = 1
1 EOR 1 = 0
```

## References
- "Inside Commodore DOS" by Richard Immers and Gerald G. Neufeld, Chapter 7.2: Checksums
