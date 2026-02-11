# VIC-II Bitmap Mode: $D018 Bit 3 — Bitmap Base Address

**Summary:** $D018 bit 3 (mask $08) selects the bitmap base within the current 16 KB VIC-II bank: bank base + $0000 or bank base + $2000. A C64 bitmap requires 8000 bytes ($1F40) and fits entirely at either offset within a 16 KB bank.

## Bitmap base selection (Bit 3 of $D018)
Bit 3 of register $D018 selects which of two bitmap base addresses to use inside the VIC-II-visible 16 KB bank:

- Bit 3 = 0 -> Bitmap base = bank base + $0000 (bitmap occupies $0000–$1F3F)
- Bit 3 = 1 -> Bitmap base = bank base + $2000 (bitmap occupies $2000–$3F3F)

Details:
- Bit 3 mask: $08 (least-significant bit is bit 0).
- Bitmap size: 8000 bytes (decimal) = $1F40 (end address = start + $1F40 − 1).
- Both placements fit within a single 16 KB VIC-II bank (bank size = $4000), so starting at $0000 or $2000 does not cross the bank boundary.

## Key Registers
- $D018 - VIC-II - Control register for character/bitmap memory layout; bit 3 selects bitmap base at bank base + $0000 or + $2000

## References
- "d018_vmcsb_overview" — expanded overview of $D018 bitmap/character base selection
- "address_calculation_quick_reference" — details on calculating VIC-II addresses relative to bank base

## Labels
- D018
