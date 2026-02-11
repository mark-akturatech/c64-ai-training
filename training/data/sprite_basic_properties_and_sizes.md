# Sprite basics (C64 / VIC-II)

**Summary:** Standard C64 sprites are 24×21 pixels in single-color mode or 12×21 pixels in multicolor mode, with transparent pixels. Sprite pixels can use one of 16 colors; multicolor sprites use three colors plus transparent. The VIC-II can double the horizontal and/or vertical size of sprites (without adding detail), and sprite priority relative to background and other sprites is selectable per sprite.

**Description**

- **Size and Resolution:**
  - **Single-Color Mode:** Each sprite is 24×21 pixels. Pixels set to 1 display one of the 16 VIC-II colors; pixels set to 0 are transparent, allowing the background to show through.
  - **Multicolor Mode:** Each sprite is effectively 12×21 pixels, as horizontal resolution is halved. Multicolor mode provides three visible colors plus transparent for each sprite.

- **Colors:**
  - **Single-Color Mode:** Each 'on' pixel uses one of the 16 available VIC-II colors, set individually per sprite via registers $D027–$D02E (53287–53294).
  - **Multicolor Mode:** Each sprite uses three visible colors plus transparent. The color sources are:
    - **Bit Pair 00:** Transparent (background shows through).
    - **Bit Pair 01:** Multicolor Register #1 at $D025 (53285).
    - **Bit Pair 10:** Individual sprite color from registers $D027–$D02E (53287–53294).
    - **Bit Pair 11:** Multicolor Register #2 at $D026 (53286).

- **Transparency and Layering:**
  - Transparent pixels allow background graphics or other sprites to show through.
  - **Sprite-to-Background Priority:** Controlled by the Sprite-Background Priority Register at $D01B (53275). Each sprite has a corresponding bit:
    - Bit set to 0: Sprite appears in front of background.
    - Bit set to 1: Sprite appears behind background.
  - **Sprite-to-Sprite Priority:** Fixed by hardware; lower-numbered sprites have higher priority. For example, Sprite 0 appears in front of Sprite 1, which appears in front of Sprite 2, and so on.

- **Expansion (Doubling):**
  - The VIC-II can double the horizontal size, vertical size, or both for a sprite. Doubling increases the displayed size but not the detail—each original pixel becomes 2×2 (if both axes are doubled) or doubled in one axis, so pixel block size increases but resolution does not.
  - Expanded sprites therefore look larger, but no additional pixel information is available compared with the non-doubled sprite.

## Key Registers

- **Sprite Multicolor Mode Enable:** $D01C (53276)
- **Sprite Multicolor Registers:**
  - Multicolor Register #1: $D025 (53285)
  - Multicolor Register #2: $D026 (53286)
- **Sprite Color Registers:** $D027–$D02E (53287–53294)
- **Sprite-Background Priority Register:** $D01B (53275)

## References

- "sprites_overview" — expands on general sprite limits (number of sprites, animation via pointers)
- Commodore 64 Programmer's Reference Guide: Programming Graphics - Sprites
- C64-Wiki: Sprite

## Labels
- SPRITE_MULTICOLOR_MODE_ENABLE
- MULTICOLOR_REGISTER_1
- MULTICOLOR_REGISTER_2
- SPRITE_COLOR_REGISTERS
- SPRITE_BACKGROUND_PRIORITY_REGISTER
