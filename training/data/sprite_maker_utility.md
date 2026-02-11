# Sprite Maker (Listing C-17) — overview and controls

**Summary:** Description of the Sprite Maker utility (Listing C-17) for the Commodore 64; uses ML routines SLIB.O and CLSP2 (Listings C-18/C-19). Creates one-color or multicolor 24x21 sprites, edit with joystick/FIRE, toggle plotting and multicolor modes, change sprite/background colors and multicolor registers; sprite binary data written at $4000-$403F.

**Using the Sprite Maker**
This utility (BASIC program Listing C-17) provides an interactive sprite editor that combines a zoomed plotting area with a true-size preview:
- **Editing grid:** 24 by 21 array of squares (zoomed area, left side of screen).
- **True-size preview:** shown at upper right in the correct color(s).
- **Plot mode indicator:** upper-left corner shows a white box when plotting is enabled; blank when plotting is off.
- **ML dependencies:** the BASIC program loads two machine-language routines (SLIB.O — Listing C-18, and CLSP2 — Listing C-19) required for operation.

**Controls:**
- **Joystick:** move the cursor across the zoomed sprite grid.
- **FIRE button:** plot or unplot the square under the cursor (depends on current plot mode).
- **F1:** toggle plot mode (initial state: OFF).
- **F3:** enable multicolor mode (initial state: OFF).
- **F4:** disable multicolor mode.
- **F5:** increment the sprite color register (cycles sprite color).
- **F6:** increment the background color.
- **F7:** increment multicolor register 1 (affects display only when multicolor mode is enabled).
- **F8:** increment multicolor register 2 (affects display only when multicolor mode is enabled).
- **S:** save the current sprite to disk using the filename entered at program start.
- **L:** load a sprite from disk using the filename entered at program start.

**Operation notes:**
- On program start, the user is prompted to `LOAD "SPRITE MAKER",8` and `RUN`; the program asks for the disk filename to use for saves/loads.
- When editing is finished, the sprite binary pattern occupies memory at $4000 for the duration of the program; the full sprite pattern length described is $4000–$403F (48 bytes per sprite pattern as used by the utility).
- If you plan to create multiple sprites or merge them into existing sprite data, move the $4000–$403F block to a safer area of RAM before loading another sprite or running other utilities.

## Key Registers
- **$4000-$403F** - Memory - sprite binary data written by the Sprite Maker (48 bytes used for the pattern as produced by this utility)

## References
- "Listing C-17" — BASIC Sprite Maker program (this chunk describes its behavior; code listing missing)
- "Listing C-18 (SLIB.O)" — machine-language support routine (referenced, listing missing)
- "Listing C-19 (CLSP2)" — machine-language support routine (referenced, listing missing)
- "screen_maker_utility" — related utility for building character screens (related material)
