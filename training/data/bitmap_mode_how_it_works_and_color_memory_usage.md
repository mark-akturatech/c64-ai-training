# Bitmap Mode: Programmable Characters Repurposed

**Summary:** Explains how programmable character RAM becomes bitmap pixel data and how screen memory is repurposed as color nybbles in C64 bitmap mode; upper 4 bits of a screen byte select the color for bits set to 1, lower 4 bits select the color for bits set to 0. Notes that enabling BASE/bitmap and clearing must be done by writing to bitmap RAM (zeroing), not by CLR.

**How it works**
- The display is driven by programmable character patterns stored in RAM. In bitmap mode, those character pattern bytes are used as the pixel bitmap for the whole screen: change the pattern bytes and the corresponding onscreen pixels change.
- Screen memory bytes (formerly holding character codes) no longer select a character; instead, each screen byte supplies color information for the corresponding 8×8 character cell.
- Each screen-memory byte is split into two 4-bit nybbles:
  - Upper 4 bits = color used where the 8×8 pattern has bits set to 1.
  - Lower 4 bits = color used where the 8×8 pattern has bits set to 0.
- Color information for bitmap pixels is therefore taken from screen memory, not from the separate color RAM used in standard character modes.
- The entire visible screen is composed of these programmable-character-shaped 8×8 areas; by writing new bit patterns into the character pattern area in RAM, you directly alter pixels across the screen.

**Clearing and initialization**
- Entering bitmap mode requires selecting the bitmap/character BASE and enabling bitmap mode.
- Clearing the bitmap must be done by zeroing the bitmap RAM area (i.e., writing $00 to the bitmap bytes). The standard BASIC CLR does not clear bitmap character pattern RAM; CLR does not substitute for zeroing the bitmap memory.

## Source Code
To set the BASE and enable bitmap mode, the following steps are required:

1. **Select the VIC-II memory bank:**
   - The VIC-II can access one of four 16 KB memory banks. This is controlled by bits 0 and 1 of the CIA #2 Port A register at address $DD00.
   - To select bank 2 ($4000–$7FFF), which is suitable for bitmap graphics without conflicting with BASIC memory, set bits 0 and 1 to `10` (binary).

2. **Set the bitmap and screen memory locations:**
   - The bitmap and screen memory locations within the selected VIC-II bank are controlled by the VIC-II Memory Control Register at address $D018.
   - In bank 2, setting the bitmap to start at $2000 and the screen memory to start at $1C00 is common.
   - This corresponds to setting bits 3–0 to `1110` (binary) for the screen memory and bit 6 to `1` for the bitmap.

3. **Enable bitmap mode:**
   - Bitmap mode is enabled by setting bit 5 of the VIC-II Control Register 1 at address $D011.
   - Set bit 5 to `1` to enable bitmap mode.

The following assembly code demonstrates these steps:

```assembly
; Select VIC-II memory bank 2 ($4000–$7FFF)
LDA $DD00
AND #%11111100      ; Clear bits 0 and 1
ORA #%00000010      ; Set bits 0 and 1 to 10 (binary)
STA $DD00

; Set bitmap to $2000 and screen memory to $1C00 within bank 2
LDA $D018
AND #%00000111      ; Clear bits 3–0
ORA #%11100000      ; Set bits 3–0 to 1110 (binary) and bit 6 to 1
STA $D018

; Enable bitmap mode
LDA $D011
ORA #%00100000      ; Set bit 5 to 1
STA $D011
```

To clear the bitmap memory (zeroing), the following routine can be used:

```assembly
; Clear bitmap memory at $6000–$7FFF (8 KB)
LDX #$00
LDA #$00
ClearBitmap:
    STA $6000,X
    STA $6100,X
    STA $6200,X
    STA $6300,X
    STA $6400,X
    STA $6500,X
    STA $6600,X
    STA $6700,X
    STA $6800,X
    STA $6900,X
    STA $6A00,X
    STA $6B00,X
    STA $6C00,X
    STA $6D00,X
    STA $6E00,X
    STA $6F00,X
    STA $7000,X
    STA $7100,X
    STA $7200,X
    STA $7300,X
    STA $7400,X
    STA $7500,X
    STA $7600,X
    STA $7700,X
    STA $7800,X
    STA $7900,X
    STA $7A00,X
    STA $7B00,X
    STA $7C00,X
    STA $7D00,X
    STA $7E00,X
    STA $7F00,X
    INX
    BNE ClearBitmap
```

This routine clears the 8 KB bitmap memory area by writing $00 to each byte.

## Key Registers
- **$DD00 (CIA #2 Port A):** Controls the VIC-II memory bank selection.
  - Bits 0 and 1: Select the 16 KB VIC-II memory bank.
    - `00`: Bank 3 ($C000–$FFFF)
    - `01`: Bank 2 ($8000–$BFFF)
    - `10`: Bank 1 ($4000–$7FFF)
    - `11`: Bank 0 ($0000–$3FFF)
- **$D018 (VIC-II Memory Control Register):** Sets the locations of screen memory and character (bitmap) memory within the selected VIC-II bank.
  - Bits 3–0: Screen memory location (in 1 KB steps).
  - Bit 6: Bitmap memory location (0 = $0000, 1 = $2000 within the VIC-II bank).
- **$D011 (VIC-II Control Register 1):** Controls various display settings, including enabling bitmap mode.
  - Bit 5: Bitmap Mode (BMM).
    - `0`: Character mode
    - `1`: Bitmap mode

## References
- Commodore 64 Programmer's Reference Guide
- "Bitmap Graphics on the 64" – Compute! Magazine
- "Standard Bitmap Mode" – C64-Wiki