# Sprite expansion and collision registers (VIC-II: $D017, $D018, $D01E-$D01F)

**Summary:** Per-sprite sprite expansion (horizontal/vertical) and sprite collision registers for the VIC-II: includes horizontal expansion register $D01D, vertical expansion register $D017, VIC-II memory control register $D018 (selects character dot-data and video matrix base), and the Sprite-to-Sprite / Sprite-to-Foreground collision registers at $D01E/$D01F.

**Sprite expansion**
The VIC-II supports per-sprite horizontal and vertical expansion, allowing a sprite to be displayed at double width and/or double height without altering its stored resolution. Setting an expansion bit for a sprite causes each dot of that sprite’s shape to be duplicated in the corresponding axis (horizontal expansion duplicates each dot horizontally; vertical expansion duplicates each scanline). Horizontal and vertical expansion can be used independently or combined to produce sprites that cover twice the size in one or both axes.

The horizontal expansion is controlled by register $D01D (53277), where each bit corresponds to a sprite:

- Bit 0: Expand Sprite 0 horizontally (1=double-width sprite, 0=normal width)
- Bit 1: Expand Sprite 1 horizontally (1=double-width sprite, 0=normal width)
- Bit 2: Expand Sprite 2 horizontally (1=double-width sprite, 0=normal width)
- Bit 3: Expand Sprite 3 horizontally (1=double-width sprite, 0=normal width)
- Bit 4: Expand Sprite 4 horizontally (1=double-width sprite, 0=normal width)
- Bit 5: Expand Sprite 5 horizontally (1=double-width sprite, 0=normal width)
- Bit 6: Expand Sprite 6 horizontally (1=double-width sprite, 0=normal width)
- Bit 7: Expand Sprite 7 horizontally (1=double-width sprite, 0=normal width)

The vertical expansion is controlled by register $D017 (53271), with a similar bit layout for each sprite.

Use of expansion does not change the sprite’s internal pixel matrix; it only repeats pixels to double the visible size.

**VIC-II memory control register ($D018)**
The VIC-II memory control register at $D018 (53272) determines the base addresses for the video matrix (screen memory) and character dot-data (character memory) within the current VIC bank. The register's bit layout is as follows:

- Bits 0–3: Character Dot-Data Base Address (CB11–CB13)
- Bits 4–7: Video Matrix Base Address (VM10–VM13)

**Character Dot-Data Base Address (Bits 1–3):**

These bits select the starting address for character memory in 2 KB increments within the current VIC bank:

- %000: $0000–$07FF
- %001: $0800–$0FFF
- %010: $1000–$17FF
- %011: $1800–$1FFF
- %100: $2000–$27FF
- %101: $2800–$2FFF
- %110: $3000–$37FF
- %111: $3800–$3FFF

**Video Matrix Base Address (Bits 4–7):**

These bits select the starting address for screen memory in 1 KB increments within the current VIC bank:

- %0000: $0000–$03FF
- %0001: $0400–$07FF
- %0010: $0800–$0BFF
- %0011: $0C00–$0FFF
- %0100: $1000–$13FF
- %0101: $1400–$17FF
- %0110: $1800–$1BFF
- %0111: $1C00–$1FFF
- %1000: $2000–$23FF
- %1001: $2400–$27FF
- %1010: $2800–$2BFF
- %1011: $2C00–$2FFF
- %1100: $3000–$33FF
- %1101: $3400–$37FF
- %1110: $3800–$3BFF
- %1111: $3C00–$3FFF

**Example:**

To set the character memory to start at $2000 and the screen memory to start at $0400 within the current VIC bank, you would set $D018 to %10001001 (binary) or $89 (hexadecimal).

**Sprite collision detection**
- The VIC-II signals sprite collisions in the IRQ status (sprite-sprite and sprite-background flags). Separate read-only registers list which sprites were involved.
- Reading the collision registers clears them, so copy the values to RAM if you need to test them multiple times.
- Collision registers indicate which sprites were involved, not necessarily which specific pair collided. For example, three touching sprites can cause all three bits to be set even if only two touch each neighbor.
- A sprite dot only counts for collision if the sprite shape data bit (or the multicolor pair) produces a non-background pixel:
  - Sprite shape bits equal to 0 (or multicolor bit-pair 00) are background and do not participate in collisions.
  - A sprite whose shape bytes are all 0 will never be involved in collisions.
  - A sprite whose shape bytes are 255 (all ones) can be involved in collisions even if its display color matches the background (it still produces nonzero data).
  - Exception: multicolor bit-pair pattern 01 is treated as part of the background and cannot cause collision.
- Collisions can be detected even when sprites (or foreground graphics) are in the border region (offscreen areas visible when display is reduced to 38 columns / 24 rows).

## Source Code
```text
53277   $D01D   SPHSEL
Sprite Horizontal Expansion Register
Bit 0: Expand Sprite 0 horizontally (1=double-width sprite, 0=normal width)
Bit 1: Expand Sprite 1 horizontally (1=double-width sprite, 0=normal width)
Bit 2: Expand Sprite 2 horizontally (1=double-width sprite, 0=normal width)
Bit 3: Expand Sprite 3 horizontally (1=double-width sprite, 0=normal width)
Bit 4: Expand Sprite 4 horizontally (1=double-width sprite, 0=normal width)
Bit 5: Expand Sprite 5 horizontally (1=double-width sprite, 0=normal width)
Bit 6: Expand Sprite 6 horizontally (1=double-width sprite, 0=normal width)
Bit 7: Expand Sprite 7 horizontally (1=double-width sprite, 0=normal width)

53271   $D017   SPVSEL
Sprite Vertical Expansion Register
Bit 0: Expand Sprite 0 vertically (1=double-height sprite, 0=normal height)
Bit 1: Expand Sprite 1 vertically (1=double-height sprite, 0=normal height)
Bit 2: Expand Sprite 2 vertically (1=double-height sprite, 0=normal height)
Bit 3: Expand Sprite 3 vertically (1=double-height sprite, 0=normal height)
Bit 4: Expand Sprite 4 vertically (1=double-height sprite, 0=normal height)
Bit 5: Expand Sprite 5 vertically (1=double-height sprite, 0=normal height)
Bit 6: Expand Sprite 6 vertically (1=double-height sprite, 0=normal height)
Bit 7: Expand Sprite 7 vertically (1=double-height sprite, 0=normal height)

53272   $D018   VMCSB
VIC-II Memory Control Register
Bit 7: VM13 - Video Matrix Base Address bit 3
Bit 6: VM12 - Video Matrix Base Address bit 2
Bit 5: VM11 - Video Matrix Base Address bit 1
Bit 4: VM10 - Video Matrix Base Address bit 0
Bit 3: CB13 - Character Dot-Data Base Address bit 2
Bit 2: CB12 - Character Dot-Data Base Address bit 1
Bit 1: CB11 - Character Dot-Data Base Address bit 0
Bit 0: Unused

53278   $D01E   SPSPCL
Sprite-to-Sprite Collision Register
Bit 0: Did Sprite 0 collide with another sprite?  (1=yes)
Bit 1: Did Sprite 1 collide with another sprite?  (1=yes)
Bit 2: Did Sprite 2 collide with another sprite?  (1=yes)
Bit 3: Did Sprite 3 collide with another sprite?  (1=yes)
Bit 4: Did Sprite 4 collide with another sprite?  (1=yes)
Bit 5: Did Sprite 5 collide with another sprite?  (1=yes)
Bit 6: Did Sprite 6 collide with another sprite?  (1=yes)
Bit 7: Did Sprite 7 collide with another sprite?  (1=yes)

53279   $D01F   SPBGCL
Sprite-to-Foreground Collision Register
Bit 0: Did Sprite 0 collide with the foreground display?  (1=yes)
Bit 1: Did Sprite 1 collide with the foreground display?  (1=yes)
Bit 2: Did Sprite 2 collide with the foreground display?  (1=yes)
Bit 3: Did Sprite 3 collide with the foreground display?  (1=yes)
Bit 4: Did Sprite 4 collide with the foreground display?  (1=yes)
Bit 5: Did Sprite 5 collide with the foreground display?  (1=yes)
Bit 6: Did Sprite 6 collide with the foreground display?  (1=yes)
Bit 7: Did Sprite 7 collide with the foreground display?  (1=yes)

Location Range: 53278-53279 ($D01E-$D01F)  -- Sprite Collision Detection Registers

Location Range (other VIC registers referenced): 53280-53294 ($D020-$D02E)
```

## Key Registers
- $D017 - VIC-II - Sprite vertical expansion register (per-sprite double-height control)
- $D018 - VIC-II - Memory control register (selects Character Dot-Data base and Video Matrix base)
- $D01D - VIC-II - Sprite horizontal expansion register (per-sprite double-width control)
- $D01E-$D01F - VIC-II - Sprite-to-Sprite and Sprite-to-Foreground collision registers (bit per sprite)

## References
- "sprite_display_enable_position_and_color_registers" — expands on sprite expansion, position and color registers

## Labels
- SPHSEL
- SPVSEL
- VMCSB
- SPSPCL
- SPBGCL
