# BAM: 4-byte per-track entry and example (track 14)

**Summary:** Describes the CBM DOS Block Availability Map (BAM) format: 4 bytes per track (first = free-block count, next 3 = 21-bit sector bitmap free=1/allocated=0), located at $04-$8F (140 bytes). Example shows track 14 entry at byte 14*4 = $38 with first byte $11 (17 free blocks).

## BAM format and location
- Each track on a CBM 1541-style disk has a 4-byte BAM entry. The BAM occupies 4 × 35 = 140 bytes at offsets $04-$8F in the directory/BAM sector area.
- Entry layout (per track):
  - Byte 0: number of free blocks on that track (decimal count).
  - Bytes 1–3: bit map (21 bits used) — one bit per sector on the track; bit = 1 means sector is free, bit = 0 means sector allocated. The three bytes hold up to 21 sector bits (LSB of first bitmap byte = sector 0).
- DOS computes total free blocks by summing the first byte of each track's BAM entry (sum every 4th byte starting at byte $04).

## Decoding an entry — track 14 example
- Entry offset calculation shown: entry for track N begins at byte N × 4. For track 14:
  - 14 × 4 = 56 = $38 — this is the start of track 14's 4-byte BAM entry.
- The example entry (hex dump) shows the first byte for track 14 is $11:
  - $11 = decimal 17 free blocks on track 14.
- The next three bytes form the 21-bit sector bitmap for that track, where each bit maps to a sector (1 = free, 0 = used).
- When DOS reports free blocks for the whole disk, it sums the decimal values of each track's first byte (every 4th byte starting at $04).

**[Note: Source may contain an OCR/typo in the hex dump byte sequence — the fourth nibble shown as "IF" in the provided dump is likely an artifact. The first byte $11 and the description of the 3-byte bitmap are correct.]**

## Source Code
```text
BAM occupies bytes $04-$8F (140 bytes), 4 bytes per track (35 tracks).

Example hex dump snippet (as in source):
.    3G:    11   D7  5F   IF  00  00  00  00   .W  BAM  TRACKS  14-15

Entry for track 14 begins at byte 14 * 4 = 56 ($38):
.    38:    11   D7  5F   IF  00  00  00  00   .W  BAM  TRACKS  14-15

Interpretation:
- Byte at $38 = $11  -> 17 free blocks on track 14.
- Next three bytes ($D7 $5F $IF) -> 3-byte bitmap (21 bits) describing free (1) / allocated (0) sectors.
```

## References
- "bam_bit_map_for_track14" — detailed bit-map decoding for track 14
