# VICSCN — Video Screen Memory ($0400-$07FF)

**Summary:** VICSCN is the VIC-II video screen memory area (1024–2047 / $0400–$07FF) containing the 25×40 video matrix and sprite data pointers; its physical location is selected by the VIC-II control register $D018 and the VIC bank bits on CIA #2 ($DD00). Color RAM (foreground colors) lives at $D800 and must be initialized separately for visible text.

**Description**
This chunk documents the default VIC-II screen memory area and how the VIC displays characters:

- **Default area:** 1024–2047 ($0400–$07FF). It contains the 25-line × 40-column video matrix and the last bytes used for sprite data pointers.
- **Video matrix region:** 1024–2023 ($0400–$07E7). Each byte is a screen code; the first byte maps to the top-left character, subsequent bytes fill columns left-to-right and rows top-to-bottom.
- **Relocation:** The VIC-II memory control register at $D018 (53272) and the VIC bank select bits on CIA #2 Data Port A at $DD00 (56576) determine the current physical 1K-aligned start of screen memory. The screen memory may be moved to any even 1K boundary.

  - **$D018 (53272) - VIC-II Memory Control Register:**
    - **Bits 4–7 (VM13–VM10):** Select the base address of the video matrix (screen memory). The value of these bits, multiplied by 1024, gives the offset from the start of the current VIC bank.
    - **Bits 1–3 (CB13–CB11):** Select the base address of the character set. The value of these bits, multiplied by 2048, gives the offset from the start of the current VIC bank.

  - **$DD00 (56576) - CIA #2 Data Port A:**
    - **Bits 0–1:** Select the current VIC bank:
      - 00: Bank 3 ($C000–$FFFF)
      - 01: Bank 2 ($8000–$BFFF)
      - 10: Bank 1 ($4000–$7FFF)
      - 11: Bank 0 ($0000–$3FFF)

- **Sprite Data Pointers:** The last 8 bytes of the 1K screen memory are reserved for sprite data pointers:
  - **Addresses:** 2040–2047 ($07F8–$07FF)
  - **Function:** Each byte corresponds to one of the 8 hardware sprites (0–7) and contains a pointer to the sprite's data.
  - **Pointer Calculation:** Each sprite pointer value, multiplied by 64, gives the starting address of the sprite data within the current VIC bank. For example, if the pointer value is 192, the sprite data starts at 192 × 64 = 12288 ($3000) within the current VIC bank.

- **Color RAM:** Foreground colors for text are stored in color RAM starting at 55296 ($D800). The OS initializes color RAM to match the background color when the screen is cleared, which can make freshly POKE'd characters invisible if foreground equals background.
- **Remedies:**
  - Directly POKE the color RAM bytes to set foreground colors for characters.
  - Or change the background color to the desired foreground color, clear the screen (letting the OS initialize color RAM), then restore the background color.

See the Source Code section for concrete BASIC examples showing these techniques.

## Source Code
```basic
POKE 1024,1
POKE 1024+54272,1

FOR I=0 TO 255
  POKE 1024+I,I
  POKE 1024+54272+I,1
NEXT

10 POKE 53281,2:REM BACKGROUND IS RED
20 PRINT CHR$(147):REM CLEAR SCREEN
30 POKE 53281,1:REM BACKGROUND IS WHITE
40 POKE 1024,1:REM RED "A" APPEARS IN TOP LEFT CORNER
```

Additional address references from source (for retrieval):
```text
1024-2047     $0400-$07FF      VICSCN
1024-2023     $0400-$07E7      Video Matrix (25×40)
55296         $D800            Color RAM start
53272         $D018            VIC-II memory control register
56576         $DD00            CIA #2 Data Port A (VIC bank select bits)
```

## Key Registers
- $0400-$07FF - VIC-II - Default VICSCN (video screen memory area, 1K)
- $0400-$07E7 - VIC-II - Video matrix (25 lines × 40 columns)
- $D018 - VIC-II - Memory control register (screen/base address select)
- $DD00-$DD0F - CIA 2 - Data Port A and CIA2 register block (VIC bank select bits on Data Port A)
- $D800-$DBFF - Color RAM - character foreground color nybbles (one per screen cell)

## References
- "hibase_screen_memory_top_page" — contains OS variable HIBASE/top-page number for screen memory used by OS print routines
- "sprite_shape_data_pointers" — explains the last bytes of the video matrix used as sprite data pointers