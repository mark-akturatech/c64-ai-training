# VIC-II Color Registers ($D020-$D02E)

**Summary:** VIC-II color registers $D020-$D02E select border color, primary and extended background colors, multicolor sprite colors, and individual sprite colors (sprites 0–7). All listed registers use only bits 0–3 (4-bit color index 0–15); color RAM lives at $D800-$DBFF.

## Description
These VIC-II I/O registers hold 4-bit color indices (values 0–15). The high bits of each byte are ignored by the VIC-II; only bits 0–3 are read as the palette index.

- $D020 selects the screen border color.
- $D021 selects the primary background color (background color 0).
- $D022–$D024 are the extended background colors (background colors 1–3) used in hires/multicolor bitmap and character modes that reference them.
- $D025–$D026 are the two shared multicolor sprite color registers (multicolor #1 and #2) used when sprites are in multicolor mode.
- $D027–$D02E are the individual color registers for sprites 0–7; each holds a 4-bit color index (bits 0–3 only). When a sprite is in single-color mode it uses its individual color; in multicolor mode it uses the sprite multicolor registers instead.

Note: Per-character color attributes for text/bitmap character cells are stored separately in color RAM at $D800–$DBFF (4 bits per character cell) and do not overlap these VIC-II color registers.

## Source Code
```text
Color Registers:

$D020   Border Color            Border color (bits 0-3 only)
$D021   Background Color        Primary background color (bits 0-3 only)
$D022   BG Color 1              Extended background color #1 (bits 0-3 only)
$D023   BG Color 2              Extended background color #2 (bits 0-3 only)
$D024   BG Color 3              Extended background color #3 (bits 0-3 only)
$D025   Sprite Color 1          Multicolor sprite color #1 (bits 0-3 only)
$D026   Sprite Color 2          Multicolor sprite color #2 (bits 0-3 only)
$D027-$D02E  Sprite Colors      Individual colors for sprites 0-7 (bits 0-3 only)

Additional note:
- Color RAM (per-character colors): $D800-$DBFF (4 bits per character cell)
```

## Key Registers
- $D020-$D02E - VIC-II - Border, background (primary + extended), multicolor and individual sprite color registers (bits 0-3 used)

## References
- "color_ram" — color RAM stores per-character color data at $D800-$DBFF