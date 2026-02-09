# VIC-II $D018 — Screen & Character Memory Banking (VVVV / CCC bit layout)

**Summary:** $D018 (VIC-II) selects screen memory base (bits 7–4, VVVV) in $0400 steps and character/bitmap base (bits 3–1, CCC) in $0800 steps; bit 3 has a dual role as the high CCC bit and as the bitmap base select in bitmap mode. Default $D018 = $15 (%00010101): screen offset $0400, charset offset $1000 (ROM charset in bank 0).

## Overview
$D018 is the VIC-II register that configures where the video matrix (screen RAM) and character/bitmap data are located within the current VIC memory bank. The register is split into:

- Bits 7–4 (VVVV): screen memory base offset, with 16 possible positions. Each increment selects the next $0400 block relative to the VIC bank base.
- Bits 3–1 (CCC): character dot-data (charset) base offset, with 8 possible positions. Each increment selects the next $0800 block relative to the VIC bank base.
- Bit 3 also serves as the bitmap-base selector when the VIC is in bitmap mode: 0 = bank base + $0000, 1 = bank base + $2000.
- Bit 0 is unused.

Common computation patterns:
- Screen base = VIC_bank_base + (VVVV * $0400)
- Charset (text/character) base = VIC_bank_base + (CCC * $0800)
- Bitmap base (bitmap mode) = VIC_bank_base + ($0000 if bit3=0, $2000 if bit3=1)

Note: the register supplies offsets within the VIC-visible bank; the VIC bank base is determined by system memory configuration (not covered here).

## Source Code
```text
Bit Layout
  Bit 7  Bit 6  Bit 5  Bit 4  Bit 3  Bit 2  Bit 1  Bit 0
  [  V  ] [  V  ] [  V  ] [  V  ] [  C  ] [  C  ] [  C  ] [  x  ]

Bits:
  Bits 7-4 (VVVV): Video Matrix (Screen Memory) base address offset
  Bits 3-1 (CCC): Character Dot-Data base address offset
  Bit 3:           Also selects bitmap base in bitmap mode (0 = bank base + $0000, 1 = bank base + $2000)
  Bit 0:           Unused

Default value: $15 / #21 / %00010101
  - Screen at offset $0400 (VVVV = %0001)
  - Charset at offset $1000 (CCC = %010) -> ROM charset in bank 0

Screen memory offsets (VVVV * $0400)
  VVVV  Offset(hex)
  0     $0000
  1     $0400
  2     $0800
  3     $0C00
  4     $1000
  5     $1400
  6     $1800
  7     $1C00
  8     $2000
  9     $2400
  10    $2800
  11    $2C00
  12    $3000
  13    $3400
  14    $3800
  15    $3C00

Character/bitmap offsets (CCC * $0800)
  CCC  Offset(hex)
  0    $0000
  1    $0800
  2    $1000
  3    $1800
  4    $2000
  5    $2800
  6    $3000
  7    $3800

Bitmap mode special-case:
  - When VIC is in bitmap mode, Bit 3 selects the bitmap base within the bank:
      Bit 3 = 0  -> bitmap base = VIC_bank_base + $0000
      Bit 3 = 1  -> bitmap base = VIC_bank_base + $2000
  (This is the same physical bit used as the MSB of CCC; bitmap mode treats only that MSB as the primary selector for the 8KB half.)
```

## Key Registers
- $D018 - VIC-II - Video matrix (screen) base offset (bits 7-4, VVVV; each step = $0400) and character/bitmap base offset (bits 3-1, CCC; each step = $0800). Bit 0 unused.

## References
- "d018_vmcsb_overview" — expands on what $D018 controls
- "screen_memory_offsets" — expands on detail mapping of bits 7-4
- "character_memory_offsets" — expands on detail mapping of bits 3-1