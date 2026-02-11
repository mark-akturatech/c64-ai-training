# FDC Track Formatting and Tail (Inter-Sector) Gap Calculation

**Summary:** Describes the Commodore FDC track-formatting algorithm that erases a track with overlapping $FF bytes, writes a $FF/$55 pattern (2400 $FFs then 2400 $55s), counts written bytes, subtracts the expected sector bytes for the zone, and divides the remainder by sectors to compute the variable tail (inter-sector) gap; minimum tail gap enforced = 4 bytes; includes zone table with tracks, sectors per track, and typical tail-gap ranges.

## Formatting algorithm
- The DOS intentionally excludes the inter-sector (tail) gap from per-sector byte counts because the OS never references the tail gap after formatting.
- Track erase: the FDC writes 10,240 overlapping 8-bit $FF bytes to erase a track.
- Pattern write: after erase the FDC writes 2,400 8-bit $FFs followed immediately by 2,400 8-bit $55s (pattern intended to wrap the track circumference with a clear on/off byte pattern).
- Measurement: the FDC counts how many sync ($FF) and nonsync ($55) bytes were actually written (this reflects the disk circumference and drive motor variation).
- Tail-gap computation:
  1. From the measured total bytes written, subtract the total expected bytes consumed by all sectors in the given zone (note: this excludes tail gaps).
  2. Divide the remainder by the number of sectors in that zone.
  3. Result is the per-sector variable tail (inter-sector) gap for that track/zone.
- Behavior and constraints:
  - The tail gap varies by track (circumference and sector count decrease on outer->inner or inner->outer depending on numbering) and between drives (motor speed variance).
  - The algorithm enforces a minimum tail gap: if the computed tail gap is less than 4 bytes, formatting fails and an error is reported.
  - The algorithm is analogous to cutting a pie: the remainder bytes are distributed equally as per-sector tails.

## Source Code
```text
Counts and patterns used by the FDC:
- Erase: 10240 overlapping bytes of %11111111 ($FF)
- Pattern: 2400 bytes of %11111111 ($FF) followed by 2400 bytes of %01010101 ($55)

Zone table (typical ranges):

Zone    Tracks   Number of Sectors   Variable Tail Gap (bytes)
1       1-17     21                  4-7
2       18-24    19                  9-12
3       25-30    18                  5-8
4       31-35    17                  4-8
```

## References
- "sector_byte_expansion_examples_and_block_byte_counts" — expands on why the tail gap is excluded from per-sector recorded byte counts
- "tail_gap_and_header_write_behavior_notes" — further notes on special-case tail gaps and header write behavior