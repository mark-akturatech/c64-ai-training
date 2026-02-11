# VIC-II Graphics Display Modes (Commodore 64)

**Summary:** Overview of VIC-II display families: Character modes (Standard, Multi-Color, Extended Background), Bitmap modes (Standard, Multi-Color), and Sprites (Standard, Multi-Color). Contains key practical details: resolutions, memory sizes (screen RAM 1,000 bytes, color RAM 1,000 nybbles, charset 2 KB with 4 KB alignment), bitmap size (8,000 bytes), sprite format (24×21 pixels, 63 bytes each), and the VIC-II register block ($D000-$D02E) that controls these modes.

**Character Display Modes**

General notes common to character modes:
- Logical screen is 40×25 character cells (40 columns × 25 rows) → 1,000 character positions.
- Character cell size: 8×8 pixels.
- Screen RAM: 1,000 bytes (one byte per character cell, holds character code).
- Color RAM: 1,000 bytes (one nybble used per cell; low 4 bits select one of 16 colors).
- Character generator (charset) uses 256 glyphs × 8 bytes = 2,048 bytes (2 KB). VIC-II addresses character memory in 4 KB-aligned blocks (the chip requires the character base to be placed on a 4 KB boundary even though glyph table is 2 KB).
- The VIC-II fetches character bytes (from ROM or RAM) and per-cell color from color RAM to render pixels; ROM vs RAM character selection is a matter of where the character memory is located (ROM image vs RAM block selectable by VIC-II memory pointers).
- Multicolor character modes halve horizontal pixel resolution (each displayed "pixel" is two hardware pixels wide) because data are interpreted as 2 bits per pixel.

1) Standard Character Mode
- Pixel depth: 1 bit per pixel within each character byte (each bit = foreground or background).
- Effective screen resolution: 320×200 (character grid 40×25 × 8×8).
- Color sources: global background color(s) + per-cell foreground color from color RAM.
- Use cases: text, typical tiling graphics with per-character single-color foreground.

ROM vs RAM characters:
- ROM characters: use the built-in character ROM glyphs (unmodifiable at runtime).
- RAM-programmable characters: place a custom charset in RAM (on an allowed 4 KB boundary) so glyphs can be redefined at runtime (used for animation, custom fonts, etc.).

2) Multi-Color Character Mode
- Each byte is interpreted as four 2-bit pixels (2 bits per pixel → 4 color choices per pixel).
- Horizontal resolution halved (effective 160×200 for distinct pixel columns), characters appear wider.
- Color choices per pixel:
  - **00**: Background color from register $D021.
  - **01**: Multicolor 1 from register $D022.
  - **10**: Multicolor 2 from register $D023.
  - **11**: Per-cell color from color RAM (lower 4 bits).
- ROM vs RAM characters: same distinction as standard character mode; interpretation of glyph bytes changes (2 bpp instead of 1 bpp).

3) Extended Background Color Mode (Character-based)
- A character-mode variant that changes how color RAM and the available color sources are interpreted to allow additional background color control per cell (mode commonly referred to as ECM/extended-background).
- Both ROM and RAM character sets are supported; the rendering fetch/interpretation differs from standard character mode.
- Note: this is a distinct VIC-II character-mode variant used to increase color variety per character cell (implementation details depend on VIC-II control bits).

**Bitmap Modes**

General bitmap notes:
- Bitmap modes render pixel data directly from a contiguous bitmap area instead of via a character generator.
- Bitmap memory must be placed in VIC-addressable RAM blocks selected via VIC-II memory pointer registers.
- Bitmap modes still use screen RAM (1,000 bytes) for character-cell attributes and color RAM (1,000 nybbles) for per-cell color information (the bitmap bytes supply pixel pattern; the color RAM supplies colors at character-cell granularity).

1) Standard Bitmap Mode
- Pixel depth: 1 bit per pixel.
- Resolution: 320×200 pixels.
- Bitmap memory size: 320 × 200 / 8 = 8,000 bytes (full-screen bitmap).
- Color: color RAM provides per-8×8-cell color control (typically foreground color), plus global background color registers.

2) Multi-Color Bitmap Mode
- Pixel depth: interpreted as 2 bits per pixel (4 color choices), which halves effective horizontal resolution (160×200 logical columns).
- Memory footprint: still organized to occupy 8,000 bytes (VIC-II's bitmap layout and addressing produce same 8 KB usage).
- Color sources: per-cell color RAM plus shared multicolor registers and global background color(s); color granularity is typically per character cell (8×8) even though pixel interpretation is multicolor.

**Sprites**

General sprite facts:
- Hardware sprites: up to 8 independent hardware sprites.
- Sprite pixel dimensions (normal): 24×21 pixels.
- Sprite bitmap memory per sprite: 24×21 bits = 504 bits = 63 bytes per sprite.
- Total sprite memory for all 8 sprites: 63 bytes × 8 = 504 bytes.
- Sprite memory is placed in VIC-addressable RAM and selected via VIC memory-pointer registers (sprites must be stored in allowed locations).
- Sprite priority, collision detection, expansion, and multiplexing are managed by VIC-II control registers and raster-timed techniques.

1) Standard (Single-Color) Sprites
- Each sprite has one color register selecting one of the 16 colors (plus transparent pixels).
- Pixel encoding: 1 bit per pixel → foreground or transparent.

2) Multi-Color Sprites
- Pixel encoding: 2 bits per pixel → 3 color values + transparent (one of the colors is taken from the per-sprite color register; two other colors are taken from shared multicolor registers; the exact mapping is set by VIC-II mode bits).
- Horizontal sprite expansion (double-width) is commonly used together with multicolor sprites to align with character/multicolor bitmap resolution.

Rendering/usage notes (summary):
- Character modes are memory-efficient for tile-based graphics and text (1,000 bytes screen + charset).
- Bitmap modes provide per-pixel control at cost of 8 KB bitmap + 1 KB screen + 1 KB color RAM.
- Multicolor modes trade horizontal resolution for more colors (useful for game graphics/art where blocky multicolor is acceptable).
- Sprites are hardware-accelerated, overlay the bitmap/character layers, and can be multiplexed with raster timing to display more than 8 visible on screen (technique not detailed here).

## Source Code
```text
Memory & format reference (concise)
- Screen RAM (character map): 40 × 25 = 1,000 bytes (one byte per cell)
- Color RAM (per-cell color nybble): 1,000 bytes (low 4 bits used), typically at $D800-$DBE7
- Charset (glyph data): 256 chars × 8 bytes = 2,048 bytes (2 KB). Must be placed on a 4 KB-aligned block selectable by VIC-II.
- Bitmap (full-screen): 320 × 200 / 8 = 8,000 bytes (8 KB)
- Sprite bitmap: 24 × 21 bits = 504 bits = 63 bytes per sprite; 8 sprites → 504 bytes total
- Hardware sprites: up to 8 sprites, each has a per-sprite color register; multicolor sprites use 2bpp interpretation with shared multicolor colors.

Typical memory layout examples (common defaults / conventions)
- Color RAM typical address: $D800–$DBE7 (1000 bytes, 4-bit values)
- BASIC default screen (not VIC pointer): $0400 (used by BASIC; VIC reads screen location from VIC memory pointers)
- Character/bitmap/sprite base addresses: selected via VIC-II memory pointer registers (VIC expects aligned blocks: charset on 4 KB boundary, bitmap on 8 KB space for some alignments)

Sprite byte count example (per-sprite)
- 63 bytes per sprite layout (rows of 3 bytes for 24 pixels per row × 21 rows = 63 bytes)
```

## Key Registers
- $D000-$D02E - VIC-II - all VIC-II control & status registers (raster, control bits, sprite position/enable/color registers, memory pointers for screen/charset/bitmap, interrupts)

## References
- "standard_character_mode" — expands details on standard character mode
- "bit_map_modes" — expands on bitmap modes description
- "sprites_overview" — expands on sprites section