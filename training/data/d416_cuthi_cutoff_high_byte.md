# SID $D416 (CUTHI) — Filter Cutoff High Byte

**Summary:** $D416 (decimal 54294) on the SID ($D400 base) holds the high 8 bits of the SID's 11-bit filter cutoff frequency (CUTHI). The full 11-bit cutoff is formed by combining $D416 (high byte) with the low 3 bits at $D415.

## Description
$D416 is the CUTHI register in the SID chip. It contains bits 10..3 of the 11-bit filter cutoff value. To form the full cutoff value:

- Cutoff (0..2047) = ($D416 << 3) | ($D415 & %00000111)

Writes to $D416 change the filter cutoff frequency when the filter is enabled; reads return the last written value (behavior is write/register state). $D416 is addressed as $D416 (54294 decimal) in the C64 I/O map.

## Key Registers
- $D415-$D418 - SID - Filter cutoff low+high (11-bit cutoff) and adjacent filter control registers

## References
- "sid_filter_controls_overview" — expands on Cutoff composed of $D415 low bits + $D416 high byte

## Labels
- CUTHI
