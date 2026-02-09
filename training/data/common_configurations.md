# VIC-II Memory Banking and Address Configuration Guide

**Summary:** Examples and formulas for configuring VIC-II memory (screen, charset, bitmap) using $DD00 bank bits and VIC register $D018; includes address-calculation method and three common configuration examples ($DD00, $D018, bank base addresses, offsets).

**Bank + $D018 Mapping (How to Compute Addresses)**

This section explains how to compute VIC-II screen, charset, and bitmap addresses from the CIA2 bank-selection bits in $DD00 (bits 0-1) and the VIC-II memory register $D018. Use the bank base (selected by $DD00 bits 0-1) plus the offsets encoded in $D018:

- **Bank Base Selection:** $DD00 bits 0-1 select one of four 16 KB memory banks:
  - %00 → Bank 3: $C000–$FFFF
  - %01 → Bank 2: $8000–$BFFF
  - %10 → Bank 1: $4000–$7FFF
  - %11 → Bank 0: $0000–$3FFF (default)

- **$D018 Offsets:**
  - **Screen Offset:** Bits 7-4 of $D018. Screen address = bank_base + (screen_offset * $0400).
  - **Charset/Bitmap Offset:** Bits 3-1 of $D018. Charset/bitmap address = bank_base + (charset_offset * $0800).
    - When charset_offset includes bit 3 set (value has bit3=1), this is commonly used for bitmap modes (bitmap data located at the same charset/bitmap base).

**Formulas (byte/hex):**
- screen_address = bank_base + (((D018 >> 4) & 0x0F) * $0400)
- charset_or_bitmap_address = bank_base + (((D018 >> 1) & 0x07) * $0800)

**Notes:**
- The examples below show typical/default values and how the offsets are derived from $D018 binary nibbles/triples.
- **ROM vs RAM Charsets:** Defaults may reference ROM charset areas (shadowed by I/O/ROM configuration); see referenced bank-selection tables for ROM shadow behavior.

**Common Configuration Examples**

**Default C64 (Bank 0):**
- $DD00 bits 0-1 = %11 → Bank 0 base = $0000–$3FFF
- $D018 = $15 (binary %0001 0101)
  - screen_offset (bits 7-4) = %0001 → screen at $0000 + $0400 = $0400
  - charset_offset (bits 3-1) = %010 → charset at $0000 + (2 * $0800) = $1000 (ROM charset shadow)

**Custom Example — Bank 1 with Custom Charset:**
- $DD00 bits 0-1 = %10 → Bank 1 base = $4000–$7FFF
- $D018 = $18 (binary %0001 1000)
  - screen_offset (bits 7-4) = %0001 → screen at $4000 + $0400 = $4400
  - charset_offset (bits 3-1) = %100 → charset at $4000 + (4 * $0800) = $6000

**Custom Example — Bank 3 with Bitmap:**
- $DD00 bits 0-1 = %00 → Bank 3 base = $C000–$FFFF
- $D018 = $18 (binary %0001 1000)
  - screen/color data at $C000 + $0400 = $C400
  - bitmap at $C000 + (4 * $0800) = $E000 (bit 3 = 1 in charset_offset indicating bitmap placement)

## Source Code

```text
# Examples and calculations (machine-readable)

Default C64 (Bank 0):
DD00 bits0-1 = %11  -> bank_base = $0000
D018 = $15  (0001 0101)
screen_offset = (D018 >> 4) & 0x0F = 0x1  -> screen = $0000 + 0x1 * $0400 = $0400
charset_offset = (D018 >> 1) & 0x07 = 0x2 -> charset = $0000 + 0x2 * $0800 = $1000 (ROM)

Custom Bank 1, custom charset:
DD00 bits0-1 = %10  -> bank_base = $4000
D018 = $18  (0001 1000)
screen_offset = 0x1 -> screen = $4000 + $0400 = $4400
charset_offset = 0x4 -> charset = $4000 + 0x4 * $0800 = $6000

Custom Bank 3, bitmap:
DD00 bits0-1 = %00 -> bank_base = $C000
D018 = $18  (0001 1000)
screen = $C000 + $0400 = $C400
bitmap = $C000 + 0x4 * $0800 = $E000  (bit3=1 indicates bitmap area)
```

## Key Registers

- **$DD00** (CIA 2 Port A): Memory bank select (bits 0-1 select VIC/C64 bank base used for VIC memory references).
- **$D018** (VIC-II Memory Control Register):
  - **Bits 7-4:** Screen memory offset (screen_offset).
  - **Bits 3-1:** Character set or bitmap memory offset (charset_offset).
  - **Bit 0:** Unused/reserved.

## References

- "bank_selection_table" — bank base addresses and ROM shadows
- "d018_bit_layout_and_defaults" — expanded $D018 bit layouts and default values
- "basic_example_switch_bank2" — BASIC bank switching example