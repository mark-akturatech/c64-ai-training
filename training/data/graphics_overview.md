# COMMODORE 64 — Overview of VIC-II (MOS 6567) graphics capabilities

**Summary:** VIC-II (MOS 6567) is the C64's video chip providing all graphics modes: a 40x25 text display, a 320x200 high-resolution bitmap mode, and hardware sprites. Many graphics modes (text, bitmap, character) can be mixed on the same screen and sprites overlay with any mode.

## Graphics Overview
All of the Commodore 64's graphics capabilities are implemented by the MOS 6567 Video Interface Chip (VIC-II). Key capabilities described here:

- Text display: 40 columns by 25 lines character-based text mode.
- High-resolution bitmap: 320 × 200 pixel bitmap mode for per-pixel graphics.
- Sprites: hardware movable objects (multiple sprites) that can overlay and combine with any screen mode, simplifying game object rendering.
- Mixed modes: different graphics modes can coexist vertically on the same screen (for example, the top half of the screen in bitmap mode and the bottom half in text/character mode); sprites combine with all modes.

## References
- "graphics_modes_list" — expands on the list of character, bitmap and sprite modes
