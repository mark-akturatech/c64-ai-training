# Bitmapped graphics overview (C64)

**Summary:** The Commodore 64 offers two primary bitmap display modes:

- **Standard Bitmap Mode:** 320×200 pixels (64,000 pixels), with each pixel represented by a single bit, allowing two colors per 8×8 pixel block.

- **Multicolor Bitmap Mode:** 160×200 effective resolution, with each pixel represented by two bits, allowing four colors per 8×8 pixel block.

Both modes require 8,000 bytes of bitmap memory.

**Enabling Standard Bitmap Mode**

To switch the VIC-II into standard bitmap mode:

1. **Set the Bitmap Mode Bit:**
   - Set bit 5 (BMM) of Control Register 1 ($D011) to 1.
   - This can be achieved with the following assembly instructions:


2. **Configure Memory Pointers:**
   - The VIC-II can access one of four 16 KB memory banks:
     - Bank 0: $0000–$3FFF
     - Bank 1: $4000–$7FFF
     - Bank 2: $8000–$BFFF
     - Bank 3: $C000–$FFFF
   - Select the desired bank by setting bits 0 and 1 of the Memory Control Register ($DD00).
   - Within the selected bank, the bitmap and screen memory locations are determined by Control Register 2 ($D018):
     - Bits 3–0: Screen memory pointer (offset within the bank).
     - Bits 4–7: Character memory pointer (offset within the bank).
   - For example, to set screen memory at $0400 and bitmap memory at $2000 within bank 0:


**Memory Layout and Address Ranges**

In standard bitmap mode:

- **Bitmap Memory:** 8,000 bytes starting at the address specified by the character memory pointer in $D018.

- **Screen Memory:** 1,000 bytes starting at the address specified by the screen memory pointer in $D018.

The bitmap memory is organized into 8×8 pixel blocks corresponding to character cells. Each block consists of 8 consecutive bytes, each representing a row of 8 pixels.

**Color Storage**

In standard bitmap mode:

- **Screen Memory:** Each byte controls the colors of the corresponding 8×8 pixel block.
  - Bits 7–4: Foreground color (for pixels set to 1).
  - Bits 3–0: Background color (for pixels set to 0).

Color RAM ($D800–$DBFF) is not used in standard bitmap mode.

**Multicolor Bitmap Mode Color Sources and Priority**

In multicolor bitmap mode:

- **Bitmap Memory:** Each pair of bits represents a pixel, allowing four possible values:
  - %00: Background color from $D021.
  - %01: Color from the upper nibble of the corresponding screen memory byte.
  - %10: Color from the lower nibble of the corresponding screen memory byte.
  - %11: Color from the lower nibble of the corresponding color RAM byte ($D800–$DBFF).

This setup allows each 8×8 pixel block to display up to four colors: one global background color and three block-specific colors.

**Bitmap Memory Addressing**

The bitmap memory is organized into 8×8 pixel blocks corresponding to character cells. Each block consists of 8 consecutive bytes, each representing a row of 8 pixels.

The memory layout is as follows:

- The first 8 bytes represent the top-left 8×8 block.
- The next 8 bytes represent the block to the right, and so on.
- After 40 blocks (320 bytes), the next 8 bytes represent the first block of the next row.

This non-linear layout mirrors the character mode's organization, facilitating hardware reuse but complicating pixel addressing.

## Source Code

     ```assembly
     LDA $D011
     ORA #%00100000
     STA $D011
     ```

     ```assembly
     LDA #%00001000  ; Screen memory at $0400, bitmap at $2000
     STA $D018
     ```


```text
+----------------+----------------+----------------+----------------+----------------+----------------+----------------+----------------+
| Byte 1         | Byte 9         | Byte 17        | Byte 25        | ...            | Byte 313       | Byte 321       | Byte 329       |
+----------------+----------------+----------------+----------------+----------------+----------------+----------------+----------------+
| Byte 2         | Byte 10        | Byte 18        | Byte 26        | ...            | Byte 314       | Byte 322       | Byte 330       |
+----------------+----------------+----------------+----------------+----------------+----------------+----------------+----------------+
| Byte 3         | Byte 11        | Byte 19        | Byte 27        | ...            | Byte 315       | Byte 323       | Byte 331       |
+----------------+----------------+----------------+----------------+----------------+----------------+----------------+----------------+
| Byte 4         | Byte 12        | Byte 20        | Byte 28        | ...            | Byte 316       | Byte 324       | Byte 332       |
+----------------+----------------+----------------+----------------+----------------+----------------+----------------+----------------+
| Byte 5         | Byte 13        | Byte 21        | Byte 29        | ...            | Byte 317       | Byte 325       | Byte 333       |
+----------------+----------------+----------------+----------------+----------------+----------------+----------------+----------------+
| Byte 6         | Byte 14        | Byte 22        | Byte 30        | ...            | Byte 318       | Byte 326       | Byte 334       |
+----------------+----------------+----------------+----------------+----------------+----------------+----------------+----------------+
| Byte 7         | Byte 15        | Byte 23        | Byte 31        | ...            | Byte 319       | Byte 327       | Byte 335       |
+----------------+----------------+----------------+----------------+----------------+----------------+----------------+----------------+
| Byte 8         | Byte 16        | Byte 24        | Byte 32        | ...            | Byte 320       | Byte 328       | Byte 336       |
+----------------+----------------+----------------+----------------+----------------+----------------+----------------+----------------+
```

This table illustrates the memory layout of the bitmap, where each "Byte" represents a row of 8 pixels in an 8×8 block.

## References

- "standard_bitmapped_mode_and_color_storage" — how to enable standard bitmap and where colors are stored
- "multicolor_bitmapped_mode" — multicolor bitmap mode and color sources