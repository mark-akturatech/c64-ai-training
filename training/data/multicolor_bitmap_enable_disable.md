# Multi-color bitmap mode (C64 / VIC-II)

**Summary:** Multi-color bitmap mode (VIC-II) uses an 8K bitmap and sources colors from background color register 0, the video matrix (upper/lower nybbles of screen memory), and color RAM ($D800-$DBFF). Enable by setting bit 5 of $D011 (53265) and bit 4 of $D016 (53270); disable by clearing those bits with AND masks.

**Multi-color bitmap mode — description**
- **Purpose:** Multi-color bitmap mode displays up to four different colors within each 8×8 bitmap cell, at the cost of horizontal resolution (320 → 160 pixels).
- **Memory:** The bitmap occupies an 8K block of memory (bitmap data separate from screen/character memory).
- **Color sources (three possible within each 8×8 region):**
  1. Background color register 0 (the screen background color).
  2. The video matrix (screen memory): the upper 4 bits (high nybble) supply one possible color and the lower 4 bits (low nybble) supply another.
  3. Color memory (color RAM).
- **Mode enable bits (VIC-II registers):**
  - Set bit 5 of $D011 (53265) to enable bitmap mode.
  - Set bit 4 of $D016 (53270) to enable multicolor bitmap (combine with bitmap enable).
- **Memory configuration:**
  - **VIC-II memory bank selection:** The VIC-II can access one of four 16K memory banks. This is controlled by bits 0 and 1 of CIA #2 Port A ($DD00/56576). The bank selection is as follows:
    - 00: Bank 3 ($C000–$FFFF)
    - 01: Bank 2 ($8000–$BFFF)
    - 10: Bank 1 ($4000–$7FFF)
    - 11: Bank 0 ($0000–$3FFF)
  - **Bitmap memory location:** Within the selected 16K bank, the 8K bitmap can reside in either the lower or upper half:
    - Bit 3 of $D018 (53272) selects the bitmap memory location:
      - 0: Lower half of the bank (e.g., $0000–$1FFF in Bank 0)
      - 1: Upper half of the bank (e.g., $2000–$3FFF in Bank 0)
  - **Video matrix (screen memory) location:** The video matrix occupies 1K and can be placed at any 1K boundary within the 16K bank:
    - Bits 4–7 of $D018 (53272) select the video matrix location:
      - Value × 1024 = Start address within the bank (e.g., a value of 1 selects $0400–$07FF in Bank 0)

## Source Code
```basic
! Enable multi-color bitmap mode (corrected PEEK):
POKE 53265, PEEK(53265) OR 32
POKE 53270, PEEK(53270) OR 16

! Disable multi-color bitmap mode (clear the bits with AND masks):
POKE 53265, PEEK(53265) AND 223   ! 223 = 255 - 32  ($DF)
POKE 53270, PEEK(53270) AND 239   ! 239 = 255 - 16  ($EF)

! Original source contained a typo in the first PEEK:
!   POKE 53265,PEEK(53625)OR 32   <-- typo (53625) ; corrected above.

! Select VIC-II memory bank (e.g., Bank 2):
POKE 56576, (PEEK(56576) AND 252) OR 1

! Set bitmap memory to upper 8K and video matrix to $0400 within the selected bank:
POKE 53272, (PEEK(53272) AND 7) OR 8  ! Set bit 3 for upper 8K bitmap
POKE 53272, (PEEK(53272) AND 240) OR 16  ! Set bits 4–7 to 1 for video matrix at $0400
```

## Key Registers
- $D011 (53265) - VIC-II - Control register (bit 5 = bitmap enable for bitmap modes)
- $D016 (53270) - VIC-II - Control register (bit 4 = selects multicolor bitmap configuration alongside bitmap enable)
- $D018 (53272) - VIC-II - Memory control register:
  - Bit 3: Selects bitmap memory location within the 16K bank (0 = lower 8K, 1 = upper 8K)
  - Bits 4–7: Select video matrix (screen memory) location within the 16K bank (value × 1024 = start address)
- $D021 (53281) - VIC-II - Background color 0 (screen background color) **[used as one color source]**
- $D800–$DBFF - Color RAM - Per-character/color memory used as one of the color sources in multicolor bitmap mode
- $DD00 (56576) - CIA #2 Port A - VIC-II memory bank selection (bits 0 and 1)

## References
- "multicolor_bitmap_color_sources" — expands on bit codes for which source supplies color
- "Commodore 64 Programmer's Reference Guide" — details on VIC-II memory configuration and control registers
- "Mapping the Commodore 64" — comprehensive memory map and register descriptions

## Labels
- D011
- D016
- D018
- D021
- D800-DBFF
- DD00
