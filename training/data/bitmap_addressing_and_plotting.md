# C64 Bitmap Plotting — Byte Calculation and POKE Formulas

**Summary:** This document details the VIC-II bitmap mode layout and provides formulas for calculating the byte address to plot individual pixels in a 320x200 bitmap. It includes corrected BASIC POKE/PEEK examples for setting and clearing pixel bits, along with explanations on determining the bitmap base address and color map placement.

**Bitmap Addressing and Bitmap/Color-Map Placement**

- **VIC-II Memory Configuration:**
  - The VIC-II chip accesses memory in 16K banks. The specific bank is selected by bits 0 and 1 of the CIA #2 Port A register at address $DD00 (56576 decimal). The combinations are:
    - 00: Bank 3 ($C000–$FFFF)
    - 01: Bank 2 ($8000–$BFFF)
    - 10: Bank 1 ($4000–$7FFF)
    - 11: Bank 0 ($0000–$3FFF)
  - To select a bank, use:
    where `bank_value` is 0 to 3 corresponding to the desired bank.

- **Bitmap and Color Map Placement:**
  - Within the selected 16K bank, the bitmap and color map addresses are determined by the VIC-II register at $D018 (53272 decimal):
    - **Bits 4–7:** Define the starting address of the color map in 1K increments. The value (0–15) is multiplied by 1024 to get the color map start address.
    - **Bit 3:** Selects the bitmap start address within the 16K bank:
      - 0: Bitmap starts at the beginning of the bank.
      - 1: Bitmap starts at offset 8192 ($2000) within the bank.
  - To configure these, use:
    where `color_map_value` is 0–15 and `bitmap_value` is 0 or 1.

- **Calculating the Bitmap Base Address (BASE):**
  - The BASE address is calculated as:
    where `bank_value` is 0–3 and `bitmap_value` is 0 or 1.

- **Pixel Addressing:**
  - To set or clear an individual pixel at coordinates (X, Y) where X ranges from 0 to 319 and Y from 0 to 199:
    1. **Compute the byte address (BY) containing the pixel:**
       - `Y AND 248` isolates the upper 5 bits of Y, effectively `Y / 8 * 8`.
       - `(X AND 504) / 8` calculates the byte offset within the row.
       - `Y AND 7` adds the fine Y offset within the character row.
    2. **Determine the bit mask for the pixel within the byte:**
       - `X AND 7` gives the bit position within the byte (0–7).
       - `7 - (X AND 7)` inverts the bit position since bits are ordered from left (MSB) to right (LSB).

## Source Code

    ```basic
    POKE 56576, (PEEK(56576) AND 252) OR bank_value
    ```

    ```basic
    POKE 53272, (color_map_value * 16) + (bitmap_value * 8)
    ```

    ```basic
    BASE = (bank_value * 16384) + (bitmap_value * 8192)
    ```

       ```basic
       BY = BASE + (Y AND 248) * 40 + (X AND 504) / 8 + (Y AND 7)
       ```

       ```basic
       BIT_MASK = 2 ^ (7 - (X AND 7))
       ```


```basic
REM Set the desired pixel at (X, Y)
POKE BY, PEEK(BY) OR BIT_MASK

REM Clear the desired pixel at (X, Y)
POKE BY, PEEK(BY) AND (255 - BIT_MASK)
```

## Key Registers

- **$D011 (53265):** Control Register 1
  - Bit 5 (BMM): Set to 1 to enable bitmap mode.
- **$D018 (53272):** Memory Control Register
  - Bits 4–7: Define the color map start address.
  - Bit 3: Selects the bitmap start address within the 16K bank.
- **$DD00 (56576):** CIA #2 Port A
  - Bits 0 and 1: Select the VIC-II memory bank.

## References

- "d011_bit5_bitmap_mode_and_bitmap_memory_layout" — Details on Bitmap memory layout and BASE address derivation.
- "bitmap_basic_sample_program" — BASIC sample demonstrating plotting loop and BIT_MASK array usage.