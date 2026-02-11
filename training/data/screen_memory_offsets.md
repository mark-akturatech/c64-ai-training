# VIC-II Memory Banking and Screen Memory ($D018 bits 7-4)

**Summary:** Describes how VIC-II register $D018 bits 7-4 select one of 16 screen memory positions spaced $0400 (1024) bytes apart; offset = (bits7-4) * $0400 added to the currently selected bank base. Includes examples and an assembly sequence to modify only the screen bits.

## Screen offset behavior (bits 7-4)
Bits 7-4 of $D018 select the screen memory position within the currently selected VIC bank. There are 16 positions (0–15), each separated by $0400 (1024) bytes. The absolute screen start address is:

absolute_screen_address = bank_base + (value_of_bits7-4 * $0400)

Examples given:
- Bank 0 (bank_base = $0000): bits = %0001 → $0000 + $0400 = $0400 (default)
- Bank 1 (bank_base = $4000): bits = %0001 → $4000 + $0400 = $4400

When changing $D018 you typically want to preserve the lower bits that control character/bitmap mode (bits 3-0). Mask-and-set is used to change only bits 7-4.

## Source Code
```asm
; Example: change only screen bits in $D018 (preserve character/bitmap bits)
    LDA $D018
    AND #%00001111       ; preserve character/bitmap bits (bits 3-0)
    ORA #%xxxx0000       ; set desired screen offset in bits 7-4
    STA $D018
```

```text
$D018 Bits 7-4 -> Offset from Bank Base (each position = $0400 = 1024 bytes)

Bits7-4 pattern | Offset (hex) | Offset (dec)
--------------- | ------------ | ------------
%0000xxxx       | $0000        | 0
%0001xxxx       | $0400        | 1024
%0010xxxx       | $0800        | 2048
%0011xxxx       | $0C00        | 3072
%0100xxxx       | $1000        | 4096
%0101xxxx       | $1400        | 5120
%0110xxxx       | $1800        | 6144
%0111xxxx       | $1C00        | 7168
%1000xxxx       | $2000        | 8192
%1001xxxx       | $2400        | 9216
%1010xxxx       | $2800        | 10240
%1011xxxx       | $2C00        | 11264
%1100xxxx       | $3000        | 12288
%1101xxxx       | $3400        | 13312
%1110xxxx       | $3800        | 14336
%1111xxxx       | $3C00        | 15360
```

Additional short examples:
```text
; Example 1: Bank 0, bits = %0001 => address = $0000 + $0400 = $0400
; Example 2: Bank 1, bits = %0001 => address = $4000 + $0400 = $4400
```

## Key Registers
- $D018 - VIC-II - Screen memory/charset/bitmap control register; bits 7-4 select screen memory position within the current bank (16 positions, each $0400 apart)

## References
- "d018_bit_layout_and_defaults" — expands on bits 7-4 meaning
- "address_calculation_quick_reference" — expands on formula for absolute screen address

## Labels
- D018
