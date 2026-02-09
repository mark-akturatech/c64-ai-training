# VIC-II Memory Banking and Address Configuration Guide

**Summary:** Quick formulas to compute absolute addresses from $D018 for VIC-II memory banking: screen memory, character (charset) memory, and bitmap mode base using bank base addresses (Bank 0 $0000, Bank 1 $4000, Bank 2 $8000, Bank 3 $C000).

## Address Calculation
Use the bits in $D018 to compute absolute addresses inside the selected 16KB bank:

- Screen address = Bank base + (bits 7-4) * $0400  
- Charset (character) address = Bank base + (bits 3-1) * $0800  
- Bitmap address = Bank base + (bit 3) * $2000

Notes:
- "Bank base" selects one of the four 16KB banks (Bank 0..3).
- Bits are taken directly from $D018 (e.g., bits 7-4 means the four high bits).

## Source Code
```text
Address Calculation Quick Reference

Screen address = Bank base + (bits 7-4) * $0400
Charset address = Bank base + (bits 3-1) * $0800
Bitmap address = Bank base + (bit 3) * $2000

Bank base addresses:
  Bank 0 = $0000
  Bank 1 = $4000
  Bank 2 = $8000
  Bank 3 = $C000
```

## Key Registers
- $D018 - VIC-II - Memory configuration (screen, charset, and bitmap bank selection bits)

## References
- "screen_memory_offsets" — expands on screen offset table  
- "character_memory_offsets" — expands on charset offset table  
- "bitmap_mode_base" — expands on bitmap base selection