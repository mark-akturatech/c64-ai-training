# VMCSB ($D018) — Video Matrix & Character Set Selection; VIC-II Color Registers ($D020-$D02E)

**Summary:** VMCSB ($D018) controls the VIC-II Video Matrix (screen) start and the character (font/charset) dot-data base within the selected VIC 16K bank; upper nybble = Video Matrix 1K boundary (0–15), lower 3 bits = character dot-data offset in 1K (only even 1K multiples valid). Color registers $D020–$D02E (border, backgrounds, sprite multicolor, sprite colors) return valid values in their lower 4 bits only (mask with AND 15).

## VMCSB ($D018) — behaviour and address calculations

- Register layout (logical):
  - Bits 7–4 (upper nybble): Video Matrix (screen memory) start, expressed in 1K blocks (0–15) inside the current VIC 16K bank.
  - Bits 2–0 (lower 3 bits): Character (dot-data / charset) base, expressed in 1K blocks — but only even 1K multiples are valid (character data is 2K-aligned). The low bit of this 3-bit field should be treated as zero; valid values are 0,2,4,6,8,10,12,14 (0–14 in steps of 2).

- VIC bank bases (16K banks the VIC uses):
  - $0000, $4000, $8000, $C000 (these are the four possible 16K VIC banks). The selected VIC bank is set elsewhere (system memory configuration); VMCSB provides offsets inside the selected bank.

- Formulas
  - VideoMatrixAddress = VIC_bank_base + ((D018 >> 4) & $0F) * $0400
    - (1K = $400)
  - CharacterBaseAddress = VIC_bank_base + ( ( (D018 & $07) & ~$01 ) * $0400 )
    - (clear the low bit of the lower-3-bit field to force an even multiple of 1K; equivalent to using only even values 0,2,4,...)
  - BASIC screen page (used by BASIC’s screen pointer at decimal location 648): ScreenPage = VideoMatrixAddress / 256. When you move the Video Matrix you must update BASIC’s screen page with POKE 648, ScreenPage so BASIC text routines point to the new screen memory.

- Practical notes (calculation examples)
  - Example 1 — small values:
    - VIC bank = $0000, D018 = $12 (hex) = %0001 0010
      - Upper = $1 → VideoMatrixAddress = $0000 + 1 * $400 = $0400
      - Lower = $2 (even) → CharacterBaseAddress = $0000 + 2 * $400 = $0800
      - BASIC screen page = $0400 / $100 = $04 → POKE 648,4
  - Example 2 — different bank:
    - VIC bank = $C000, D018 = $3A (hex) = %0011 1010
      - Upper = $3 → VideoMatrixAddress = $C000 + 3 * $400 = $CC00
      - Lower = $2 (even) → CharacterBaseAddress = $C000 + 2 * $400 = $C800
      - BASIC screen page = $CC00 / $100 = $CC = 204 decimal → POKE 648,204
  - Example 3 — forcing even lower value:
    - VIC bank = $4000, D018 = $2F (hex) lower 3 bits = 7 (odd)
      - Treat lower value as 6 (clear bit0): CharacterBaseAddress = $4000 + 6 * $400 = $5800
      - VideoMatrixAddress = $4000 + 2 * $400 = $4800
      - BASIC screen page = $4800 / $100 = $48 = 72 → POKE 648,72

- Important: when relocating the Video Matrix you must update BASIC’s screen pointer (POKE 648, page) to keep BASIC’s PRINT/INPUT etc. operating on the moved screen memory.

## VIC-II color registers — reading and defaults

- All VIC-II color registers (border, background, sprite multicolor, sprite colors) only have their lower 4 bits physically connected. When reading these registers you must mask with AND 15 to get the true color value.
  - Example in BASIC: BORDERCOLOR = PEEK(53280) AND 15

- Common registers and their meaning (brief):
  - $D020 ($53280) — Border color register (default 14, light blue). When blanking (bit 4 of $D011) is set, the entire screen uses this color.
  - $D021 ($53281) — Background color 0 (default 6, blue). Used for text modes and hi-res/multicolor sprite/backgrounds.
  - $D022 ($53282) — Background color 1 (default 1, white). Used for multicolor pair 01 and extended-background characters (screen codes 64–127).
  - $D023 ($53283) — Background color 2 (default 2, red). Used for multicolor pair 10 and extended-background characters (128–191).
  - $D024 ($53284) — Background color 3 (default 3, cyan). Used for extended-background characters (192–255).
  - $D025 ($53285) — Sprite multicolor 0 (default 4, purple) — color for multicolor pair 01 in sprites.
  - $D026 ($53286) — Sprite multicolor 1 (default 0, black) — color for multicolor pair 11 in sprites.
  - $D027–$D02E ($53287–$53294) — Sprite 0–7 individual color registers (defaults listed below).

## Source Code
```text
VIC-II color and VMCSB registers (reference listing)

53280    $D020    EXTCOL   Border Color Register         default 14 (light blue)
53281    $D021    BGCOL0   Background Color 0           default 6  (blue)
53282    $D022    BGCOL1   Background Color 1           default 1  (white)
53283    $D023    BGCOL2   Background Color 2           default 2  (red)
53284    $D024    BGCOL3   Background Color 3           default 3  (cyan)
53285    $D025    SPMC0    Sprite Multicolor Register 0 default 4  (purple)
53286    $D026    SPMC1    Sprite Multicolor Register1  default 0  (black)

Sprite color registers:
53287    $D027    SP0COL   Sprite 0 Color   default 1  (white)
53288    $D028    SP1COL   Sprite 1 Color   default 2  (red)
53289    $D029    SP2COL   Sprite 2 Color   default 3  (cyan)
53290    $D02A    SP3COL   Sprite 3 Color   default 4  (purple)
53291    $D02B    SP4COL   Sprite 4 Color   default 5  (green)
53292    $D02C    SP5COL   Sprite 5 Color   default 6  (blue)
53293    $D02D    SP6COL   Sprite 6 Color   default 7  (yellow)
53294    $D02E    SP7COL   Sprite 7 Color   default 12 (medium gray)

Not connected (reads as $FF):
53295-53311   $D02F-$D03F    Not connected (reads $FF)
```

## Key Registers
- $D018 - VIC-II - VMCSB: video matrix (upper 4 bits → 1K boundary 0–15) and character dot-data selector (lower 3 bits → 1K units; only even 1K multiples valid)
- $D020-$D02E - VIC-II - Border, Backgrounds, Sprite multicolor, Sprite color registers (read lower 4 bits only)

## References
- "bitmap_mode_selection_and_memory_control_$D018" — expands on Bitmap placement constraints when using VMCSB and additional VM/bitmap interactions

## Labels
- VMCSB
- EXTCOL
- BGCOL0
- BGCOL1
- BGCOL2
- BGCOL3
- SPMC0
- SPMC1
