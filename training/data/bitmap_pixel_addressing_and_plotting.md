# Bitmap memory layout (character-interleaved) and BASIC plotting

**Summary:** Character-interleaved bitmap memory layout for the VIC‑II; formula to compute the bitmap byte BY for pixel (X,Y) given BASE (bitmap base address), correct byte/bit calculations, BASIC POKE/PEEK examples to set/reset bits, and an optimization using a precomputed BI() power‑of‑two array. Also notes on BASIC screen page (POKE 648) and VIC bank interaction ($D018).

**Bitmap layout and address formula**

The VIC‑II bitmap is stored in a character-like interleaved order: the screen is 320×200 pixels, organized as 40 bytes per character row (320/8) and 25 character rows (25*8 = 200). Memory is arranged so that for each character row (Y\8) the eight scanlines (Y AND 7) are interleaved.

Correct formula (integer division for Y\8):
BY = BASE + 40*(Y \ 8) + (Y AND 7) + (X AND 504)

Explanations:
- BASE = starting byte address of the bitmap (e.g. selected by $D018 and VIC bank).
- X AND 504 (504 decimal = 0x1F8) clears the low 3 bits of X, i.e. X rounded down to the nearest multiple of 8 = 8*(X\8). This gives the byte-column offset (0..312).
- 40*(Y \ 8) moves to the character row (each character row contributes 40 bytes).
- (Y AND 7) selects the scanline within the character (0..7).
- BY is the byte address that contains the 8 horizontal pixels covering X..X+7.
- Bit within that byte for pixel X: bit_index = X AND 7 (0..7). The mask for that bit is typically 128 >> bit_index (bit 7 = leftmost pixel of the byte).

**[Note: Source may contain an error — an OCR'd version showed "40*(Y AND 256)"; that is incorrect. The correct operand is Y\8 (Y integer-divided by 8).]**

BASIC-style expressions (conceptual):
- byte_col = X AND 504         ' 8 * (X\8)
- char_row_offset = 40 * (Y \ 8)
- scanline_offset = Y AND 7
- BY = BASE + char_row_offset + scanline_offset + byte_col
- mask = 128 >> (X AND 7)

POKE 648 note (BASIC screen pointer):
- BASIC uses location 648 (decimal) to store the page number of the starting address of screen memory (page = address/256). If you relocate screen memory (or change VIC bank), POKE 648 with the page number so text‑mode BASIC prints/draws to the expected location.
- The actual physical address of the screen depends on both the offset you select and which 16K VIC bank is active (see $D018 for bitmap/charset/bank selection).

**VIC-II $D018 Register Bit Layout**

The VIC-II's $D018 register (53272 decimal) controls the memory locations for screen and character data. Its bit layout is as follows:

- Bits 7–4: Screen Memory Base Address (VM13–VM10)
  - These bits select the starting address for screen memory within the current VIC bank. The address is calculated as:  
    `Screen Memory Address = (Bits 7–4) * 1024`
  - Possible values:
    - %0000: $0000–$03FF
    - %0001: $0400–$07FF
    - %0010: $0800–$0BFF
    - %0011: $0C00–$0FFF
    - %0100: $1000–$13FF
    - %0101: $1400–$17FF
    - %0110: $1800–$1BFF
    - %0111: $1C00–$1FFF
    - %1000: $2000–$23FF
    - %1001: $2400–$27FF
    - %1010: $2800–$2BFF
    - %1011: $2C00–$2FFF
    - %1100: $3000–$33FF
    - %1101: $3400–$37FF
    - %1110: $3800–$3BFF
    - %1111: $3C00–$3FFF

- Bits 3–1: Character Memory Base Address (CB13–CB11)
  - These bits select the starting address for character memory within the current VIC bank. The address is calculated as:  
    `Character Memory Address = (Bits 3–1) * 2048`
  - Possible values:
    - %000: $0000–$07FF
    - %001: $0800–$0FFF
    - %010: $1000–$17FF
    - %011: $1800–$1FFF
    - %100: $2000–$27FF
    - %101: $2800–$2FFF
    - %110: $3000–$37FF
    - %111: $3800–$3FFF

- Bit 0: Unused

**Note:** The actual physical addresses depend on the current VIC bank, which is selected via bits 0 and 1 of the CIA-2 Port A register at $DD00. The VIC-II can access one of four 16 KB banks:

- %00: Bank 3 ($C000–$FFFF)
- %01: Bank 2 ($8000–$BFFF)
- %10: Bank 1 ($4000–$7FFF)
- %11: Bank 0 ($0000–$3FFF)

**Computing BASE from $D018 and VIC Bank**

To compute the BASE address for bitmap data:

1. **Determine the VIC Bank:**
   - Read the value at $DD00 (CIA-2 Port A).
   - Bits 0 and 1 select the VIC bank:
     - %00: Bank 3 ($C000–$FFFF)
     - %01: Bank 2 ($8000–$BFFF)
     - %10: Bank 1 ($4000–$7FFF)
     - %11: Bank 0 ($0000–$3FFF)
   - Calculate the base address of the selected VIC bank:
     - `VIC Bank Base Address = (3 - (DD00 AND 3)) * 16384`

2. **Read $D018 to Determine Bitmap Offset:**
   - Read the value at $D018.
   - Bit 3 (CB13) determines the bitmap offset within the VIC bank:
     - 0: Bitmap starts at $0000 within the VIC bank.
     - 1: Bitmap starts at $2000 within the VIC bank.
   - Calculate the bitmap offset:
     - `Bitmap Offset = (D018 AND 8) * 512`

3. **Compute the Absolute BASE Address:**
   - `BASE = VIC Bank Base Address + Bitmap Offset`

**Example Calculation:**

- Suppose $DD00 = %00000010 and $D018 = %00011000:
  - VIC Bank Base Address:
    - `VIC Bank Base Address = (3 - (2 AND 3)) * 16384 = (3 - 2) * 16384 = 1 * 16384 = 16384 ($4000)`
  - Bitmap Offset:
    - `Bitmap Offset = (24 AND 8) * 512 = 8 * 512 = 4096 ($1000)`
  - BASE Address:
    - `BASE = 16384 + 4096 = 20480 ($5000)`

## Source Code
```basic
REM Precompute bit masks (BI array) - BI(I) = mask for bit I (0..7)
FOR I = 0 TO 7
  BI(I) = 128 / (2^I)        : REM equals 128 >> I; yields 128,64,32,...,1
NEXT I

REM Example: set a pixel (plot) at X,Y using BASE (bitmap base address)
REM X: 0..319, Y:0..199, BASE: numeric address of bitmap start
X = 123 : Y = 45 : BASE = 8192   : REM example
BY = BASE + 40*(Y\8) + (Y AND 7) + (X AND 504)
B = PEEK(BY)
POKE BY, B OR BI(X AND 7)          : REM set the pixel

REM Example: clear a pixel (unplot)
B = PEEK(BY)
POKE BY, B AND (255 - BI(X AND 7)) : REM clear the pixel

REM Faster plot sub using precomputed BI() and local variables (fewer PEEK/POKE calls)
REM CALL: GOSUB PlotPixel (X,Y,BASE)  or inline similar code
```

```text
VIC-II interrupt registers (reference bit layouts)

$D019 (53273) VICIRQ - IRQ Status (bits set = latched source)
  Bit 0: Raster compare match (1 = source pending)
  Bit 1: Sprite-to-background collision
  Bit 2: Sprite-to-sprite collision
  Bit 3: Light-pen trigger (or joystick fire on port 1)
  Bits 4-6: not used
  Bit 7: Any VIC-II IRQ pending (OR of bits 0..3)

$D01A (53274) IRQMASK - IRQ Enable bits
  Bit 0: Enable raster compare IRQ (1=enabled)
  Bit 1: Enable sprite-bg collision IRQ
  Bit 2: Enable sprite-sprite collision IRQ
  Bit 3: Enable light-pen IRQ
  Bits 4-7: not used

$D012 (53266) Raster register
  Holds raster compare line (0..255). When current raster equals this, raster IRQ can be flagged.
```

## Key Registers
- $D000-$D02E - VIC-II - all VIC-II registers (control, sprites, bitmap, raster, IRQ, etc.)
- $D012 - VIC-II - Raster Compare register (raster line number)
- $D018 - VIC-II - Memory/bitmap/charset/bank control (selects bitmap base and VIC bank)
- $D019 - VIC-II - IRQ Status (VICIRQ)
- $D01A - VIC-II - IRQ Mask (IRQ enable)

## References
- "bitmap_mode_selection_and_memory_control_$D018" — expands on

## Labels
- D018
- D012
- D019
- D01A
- DD00
