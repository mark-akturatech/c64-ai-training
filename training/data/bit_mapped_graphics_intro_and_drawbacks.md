# Commodore 64 — Bitmapped Graphics (320×200, 8K bitmap)

**Summary:** Describes C64 high-resolution bitmapped graphics: one bit per pixel for a 320×200 display (320*200/8 = 8000 bytes). Notes drawbacks (8 KB memory cost; slow in BASIC) and recommends machine language or the VSP cartridge; mentions standard and multicolor bitmap modes.

**Overview**

Bit mapping on the Commodore 64 assigns one memory bit to each display pixel: bit=1 → pixel on, bit=0 → pixel off. The full character display is 40 columns × 25 rows of 8×8 character cells, giving an overall resolution of 320 pixels (horizontal) × 200 pixels (vertical) = 64,000 dots. At one bit per pixel that requires 64,000 bits = 8,000 bytes (8 KB) to store a full-screen bitmap.

Practical consequences noted in the source:

- **Memory usage:** A full bitmap consumes 8 KB of RAM, which is substantial on the C64.
- **Performance:** Typical high-resolution graphics routines are short and repetitive; these are slow in BASIC but efficient in machine language. The source recommends implementing graphics routines in machine language or invoking ML subroutines from BASIC via SYS. The VSP cartridge is also suggested to provide high-resolution commands for BASIC.

The source indicates that examples in the section are (or will be) in BASIC for clarity, and that two bitmap display variants are standard: the standard (hi-res) bitmap mode and a multicolor bitmap mode.

**Standard (Hi-Res) Bitmap Mode**

In standard bitmap mode, the screen resolution is 320×200 pixels, with each pixel represented by a single bit (1 for on, 0 for off). The bitmap data occupies 8 KB of memory, typically starting at address $2000 or $0000, depending on the VIC-II memory configuration.

Each 8×8 pixel block (character cell) can display two colors: a foreground and a background color. These colors are defined in the screen memory area:

- **Screen Memory:** Located at $0400–$07FF (1 KB), each byte corresponds to an 8×8 pixel block. The high nibble (bits 4–7) defines the foreground color, and the low nibble (bits 0–3) defines the background color. ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-03-programming_graphics.pdf?utm_source=openai))

To enable standard bitmap mode:

1. **Set the VIC-II to bitmap mode:** Set bit 5 of the control register at $D011 to 1.
2. **Configure the memory layout:** Set the video matrix and bitmap pointers in register $D018.
   This sets the screen memory to $0400 and the bitmap to $2000. ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-03-programming_graphics.pdf?utm_source=openai))

**Multicolor Bitmap Mode**

Multicolor bitmap mode reduces the horizontal resolution to 160 pixels (each pixel is twice as wide) but allows four colors per 8×8 pixel block. Each pixel is represented by two bits, allowing for four possible values (00, 01, 10, 11), each mapping to a different color.

Color assignment in multicolor mode:

- **00:** Background color 0, defined in register $D021.
- **01:** Color from the high nibble of the corresponding screen memory byte.
- **10:** Color from the low nibble of the corresponding screen memory byte.
- **11:** Color from the corresponding color RAM byte at $D800–$DBFF. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Multicolor_Bitmap_Mode?utm_source=openai))

To enable multicolor bitmap mode:

1. **Set the VIC-II to bitmap mode:** Set bit 5 of the control register at $D011 to 1.
2. **Enable multicolor mode:** Set bit 4 of the control register at $D016 to 1.
3. **Configure the memory layout:** Set the video matrix and bitmap pointers in register $D018.
   This sets the screen memory to $0400 and the bitmap to $2000. ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-03-programming_graphics.pdf?utm_source=openai))

**BASIC Example: Setting Up Standard Bitmap Mode**

The following BASIC program sets up the standard bitmap mode, clears the screen, and sets the background and foreground colors for each 8×8 block:


This program:

1. Enables bitmap mode.
2. Sets the screen memory and bitmap memory locations.
3. Clears the bitmap memory.
4. Sets the screen memory to display white foreground on black background.
5. Enables the display. ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-03-programming_graphics.pdf?utm_source=openai))

## Source Code

   ```basic
   POKE 53265, PEEK(53265) OR 32
   ```

   ```basic
   POKE 53272, (PEEK(53272) AND 240) OR 8
   ```

   ```basic
   POKE 53265, PEEK(53265) OR 32
   ```

   ```basic
   POKE 53270, PEEK(53270) OR 16
   ```

   ```basic
   POKE 53272, (PEEK(53272) AND 240) OR 8
   ```

```basic
10 POKE 53265, PEEK(53265) OR 32 : REM Enable bitmap mode
20 POKE 53272, (PEEK(53272) AND 240) OR 8 : REM Set screen memory to $0400 and bitmap to $2000
30 FOR I = 0 TO 7999 : POKE 8192 + I, 0 : NEXT I : REM Clear bitmap memory
40 FOR I = 0 TO 999 : POKE 1024 + I, 81 : NEXT I : REM Set screen memory to white on black
50 POKE 53265, PEEK(53265) OR 16 : REM Enable display
```


## References

- "standard_bitmap_mode_enable_disable_and_types" — expands on enabling standard bitmap mode and types (enabling/disabling and mode specifics).