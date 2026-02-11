# 1540/1541 — Block Distribution by Track (Tracks 1–35)

**Summary:** Block distribution for Commodore 1540/1541 disk drives: tracks 1–17 have 21 blocks each, 18–24 have 19 blocks, 25–30 have 18 blocks, and 31–35 have 17 blocks; block ranges are zero-based (blocks numbered 0..N). This is the per-track allocation used by the 1540/1541 BAM and file allocation routines.

## Block distribution
Tracks and their per-track block counts (inclusive block ranges):
- Tracks 1–17: blocks 0..20 — 21 blocks per track
- Tracks 18–24: blocks 0..18 — 19 blocks per track
- Tracks 25–30: blocks 0..17 — 18 blocks per track
- Tracks 31–35: blocks 0..16 — 17 blocks per track

Total blocks on a standard 35-track 1540/1541 disk:
- 17 tracks × 21 blocks = 357
- 7 tracks × 19 blocks = 133
- 6 tracks × 18 blocks = 108
- 5 tracks × 17 blocks = 85
- Grand total = 357 + 133 + 108 + 85 = 683 blocks

(Blocks are numbered starting at 0 on each track; ranges shown are inclusive.)

## Source Code
```text
         BLOCK DISTRIBUTION BY TRACK
 +--------------+-------------+-------------+
 | TRACK NUMBER | BLOCK RANGE | TOTAL BLOCK |
 +--------------+-------------+-------------+
 |    1 to 17   |   0 to 20   |      21     |
 |   18 to 24   |   0 to 18   |      19     |
 |   25 to 30   |   0 to 17   |      18     |
 |   31 to 35   |   0 to 16   |      17     |
 +--------------+-------------+-------------+
```

## References
- "bam_format_1541" — expands on how the BAM stores availability for tracks 1–35
- "relative_file_format" — describes Relative file side-sector allocation and per-track block usage
