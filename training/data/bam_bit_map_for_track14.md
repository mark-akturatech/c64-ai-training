# BAM bit-map decoding for track 14 (bytes $39–$3B)

**Summary:** Decoding of the per-track BAM bit-map bytes at $39–$3B for track 14 on a 1541 disk: bytes $D7, $5F, $1F (binary 11010111, 01011111, 00011111) map to sectors 0–20 (bits 0..7 = sectors 0..7, 8..15, 16..20). Bit=1 = FREE, bit=0 = ALLOCATED; the count of 1 bits (17) matches the "blocks free" byte at $38 ($11).

## Bit-map layout and decoding

- Each track in the BAM stores a 1-byte "blocks free" count followed by a 3-byte bit map that reports per-sector allocation.
- Bit-map bytes (three bytes per track) cover sectors in groups of eight:
  - First byte ($39) = sectors 0–7 (bit 0 → sector 0, bit 7 → sector 7).
  - Second byte ($3A) = sectors 8–15 (bit 0 → sector 8, bit 7 → sector 15).
  - Third byte ($3B) = sectors 16–20 (bit 0 → sector 16, bit 4 → sector 20). Bits 5–7 in the third byte are unused for tracks with ≤21 sectors and are adjusted by DOS during format.
- Interpretation rule:
  - bit = 1 → sector is FREE (available for writing)
  - bit = 0 → sector is ALLOCATED (in use; DOS will skip it when writing)
- Example (track 14 in the sample):
  - Bit-map bytes: $D7, $5F, $1F
  - Binary: 11010111, 01011111, 00011111
  - Counting 1 bits across all three bytes gives 6 + 6 + 5 = 17 free sectors, which matches the blocks-free byte at $38 = $11 (decimal 17).

## Source Code
```text
Original BAM excerpt (as shown in source):
.    38:    11   D7  5F   1F  00  OO  00  OO   .W  BAM  TRACKS  14-15

Byte locations (decimal):
  39 = 57
  3A = 58
  3B = 59

Bit-map bytes (hex and binary):
  $39: $D7  -> 11010111  (bits 7..0 = 1 1 0 1 0 1 1 1)
  $3A: $5F  -> 01011111  (bits 7..0 = 0 1 0 1 1 1 1 1)
  $3B: $1F  -> 00011111  (bits 7..0 = 0 0 0 1 1 1 1 1)

Sector mapping by bit (LSB = bit0):
  $39 (sectors 0..7)
    bit0 = sector 0 -> 1 (FREE)
    bit1 = sector 1 -> 1 (FREE)
    bit2 = sector 2 -> 1 (FREE)
    bit3 = sector 3 -> 0 (ALLOCATED)
    bit4 = sector 4 -> 1 (FREE)
    bit5 = sector 5 -> 0 (ALLOCATED)
    bit6 = sector 6 -> 1 (FREE)
    bit7 = sector 7 -> 1 (FREE)

  $3A (sectors 8..15)
    bit0 = sector 8  -> 1 (FREE)
    bit1 = sector 9  -> 1 (FREE)
    bit2 = sector 10 -> 1 (FREE)
    bit3 = sector 11 -> 1 (FREE)
    bit4 = sector 12 -> 1 (FREE)
    bit5 = sector 13 -> 0 (ALLOCATED)
    bit6 = sector 14 -> 1 (FREE)
    bit7 = sector 15 -> 0 (ALLOCATED)

  $3B (sectors 16..20; bits 5..7 unused)
    bit0 = sector 16 -> 1 (FREE)
    bit1 = sector 17 -> 1 (FREE)
    bit2 = sector 18 -> 1 (FREE)
    bit3 = sector 19 -> 1 (FREE)
    bit4 = sector 20 -> 1 (FREE)
    bit5..7 = unused/adjusted by DOS -> 0 0 0

Free-sector count:
  Ones per byte: 6 (0xD7) + 6 (0x5F) + 5 (0x1F) = 17 free sectors
  Matches BAM byte at $38 = $11 (decimal 17)
```

## Key Registers
- (none — this chunk documents disk BAM bytes/offsets, not CPU or chip registers)

## References
- "bam_entry_format_and_track14_example" — per-track BAM format and expanded example