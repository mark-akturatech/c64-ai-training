# Sprite color registers (VIC-II): POKE V+39..V+46 to set sprite colors

**Summary:** Sprite color registers are at $D027-$D02E (V+39..V+46) on the VIC-II; use POKE (DIRECT mode) to change a sprite's 4-bit color value (0–15). Changes via DIRECT take effect immediately; RUNning a BASIC program restores colors coded in the program.

## Description
LINE 60 in the original BASIC example writes the color for sprite 0. Each sprite (0–7) has a dedicated color register at VIC-II base + offset: V+39 through V+46 (V = $D000). Each register holds a 4-bit color index from 0 to 15 (0 = black, 15 = grey in the source; examples show 1 = white, 8 = orange).

Because sprite bitmap and color values remain in memory until changed, you can edit color, position, or shape interactively in DIRECT (immediate) mode using POKE. A POKE in DIRECT mode updates the screen immediately; if you then RUN the program that contains its own POKE(s), the program's values overwrite the interactive changes and restore the colors defined in program code.

Examples from the source:
- POKE V+39,1 — sets sprite 0 to color value 1 (white).
- POKE V+39,8 — (DIRECT) sets sprite 0 to color value 8 (orange).
- POKE V+46,15 — sets sprite 7 to color value 15 (grey).

No other behavior, timing, or palette mapping beyond the numeric color range (0–15) is asserted by the source.

## Source Code
```basic
POKE V+39,1     : REM sets sprite 0 color to 1 (white)
POKE V+39,8     : REM in DIRECT mode makes sprite 0 orange
POKE V+46,15    : REM sets sprite 7 color to 15 (grey)
```

```text
V-based offsets and corresponding VIC-II addresses:
V = $D000 (53248 decimal)

V+39  -> $D027  : Sprite 0 color
V+40  -> $D028  : Sprite 1 color
V+41  -> $D029  : Sprite 2 color
V+42  -> $D02A  : Sprite 3 color
V+43  -> $D02B  : Sprite 4 color
V+44  -> $D02C  : Sprite 5 color
V+45  -> $D02D  : Sprite 6 color
V+46  -> $D02E  : Sprite 7 color

Valid color values: 0..15 (4-bit)
Examples from source: 0=black, 1=white, 8=orange, 15=grey
```

## Key Registers
- $D027-$D02E - VIC-II - Sprite 0-7 color registers (4-bit value 0–15)

## References
- "sprite_enable_bitmask_table" — enabling sprites before changing their colors
- "sprite_bitmap_memory_blocks_and_manual_editing" — editing sprite bitmap/shape in memory while color registers control appearance