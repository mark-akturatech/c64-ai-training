# SID Filter Cutoff Low (CUTLO) — $D415

**Summary:** $D415 (SID) holds the low 3 bits of the SID filter cutoff (11-bit value). Bits 0-2 are the low portion of the cutoff frequency; bits 3-7 are unused. The full 11-bit cutoff is formed with $D416 (high byte) + $D415 (low 3 bits).

## Details
This register is the low portion of the SID chip's 11-bit filter cutoff control. Only bits 0-2 contain meaningful data: they are the least-significant 3 bits of the 11-bit cutoff value. Bits 3–7 are unused/ignored by the SID.

To form the 11-bit cutoff value:
- cutoff11 = ( $D416 << 3 ) | ( $D415 & %00000111 )

(Short parenthetical: $D416 is the high 8 bits; $D415 provides low 3 bits.)

## Source Code
```text
$D415        CUTLO
Bit 7  6  5  4  3  2  1  0
    U  U  U  U  U  b2 b1 b0

b0-b2 = Low 3 bits of 11-bit filter cutoff frequency (LSBs)
b3-b7 = Unused
```

## Key Registers
- $D415 - SID - Filter cutoff low 3 bits (CUTLO); bits 0-2 = low portion of 11-bit cutoff, bits 3-7 unused

## References
- "sid_filter_controls_overview" — expands on Cutoff composed of $D415 low bits + $D416 high byte