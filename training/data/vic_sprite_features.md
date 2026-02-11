# VIC-II Sprite Feature Registers ($D01B-$D01F)

**Summary:** VIC-II sprite feature registers $D01B-$D01F control sprite priority, multicolor mode, double-width stretching, and report sprite-sprite and sprite-background collisions (bits correspond to sprites 0–7). Search terms: $D01B, $D01C, $D01D, $D01E, $D01F, VIC-II, sprite priority, multicolor, double-width, collisions.

**Description**
These VIC-II registers (one byte each) provide per-sprite feature control and collision status for the eight hardware sprites (0–7). In all feature-control registers, each bit maps to a sprite (bit 0 → sprite 0, bit 1 → sprite 1, … bit 7 → sprite 7).

- **$D01B — Sprite Priority**
  - **Function:** Controls whether each sprite is displayed in front of or behind background graphics.
  - **Bit Definition:** Each bit corresponds to a sprite; setting a bit to 0 places the sprite in front of the background, while setting it to 1 places the sprite behind the background. ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

- **$D01C — Sprite Multicolor**
  - **Function:** Enables or disables multicolor mode for each sprite.
  - **Bit Definition:** Each bit corresponds to a sprite; setting a bit to 1 enables multicolor mode for that sprite, while setting it to 0 keeps the sprite in single-color mode. ([c64-wiki.com](https://www.c64-wiki.com/wiki/sprite?utm_source=openai))

- **$D01D — Sprite Width**
  - **Function:** Controls horizontal stretching (double-width) of each sprite.
  - **Bit Definition:** Each bit corresponds to a sprite; setting a bit to 1 doubles the width of that sprite, while setting it to 0 maintains the normal width. ([c64-wiki.com](https://www.c64-wiki.com/wiki/sprite?utm_source=openai))

- **$D01E — Sprite-Sprite Collision**
  - **Function:** Indicates collisions between sprites.
  - **Bit Definition:** Each bit corresponds to a sprite; a bit is set to 1 when that sprite has collided with any other sprite.
  - **Read/Write Behavior:** This register is read-only. Reading the register clears all bits, resetting the collision status. ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

- **$D01F — Sprite-Background Collision**
  - **Function:** Indicates collisions between sprites and background graphics.
  - **Bit Definition:** Each bit corresponds to a sprite; a bit is set to 1 when that sprite overlaps non-sprite (background) graphics.
  - **Read/Write Behavior:** This register is read-only. Reading the register clears all bits, resetting the collision status. ([scribd.com](https://www.scribd.com/document/649803058/Commodore-64-Programmer-s-Reference-Guide?utm_source=openai))

**Notes:**
- **Bit-to-Sprite Mapping:** Follows the standard convention (bit N → sprite N).
- **Collision Detection Timing:** Collisions are detected during the screen refresh cycle. The collision registers are updated immediately when a collision occurs, and the corresponding interrupt flags are set if enabled. ([scribd.com](https://www.scribd.com/document/493495106/The-MOS-6567-6569-video-controller-VIC-II?utm_source=openai))

## Source Code
```text
Sprite Features:

$D01B   Sprite Priority         Behind/in-front-of background register
$D01C   Sprite Multicolor       Multicolor mode register for sprites 0-7
$D01D   Sprite Width            Double-width stretch register for sprites 0-7
$D01E   Sprite-Sprite Collision Sprite collision detection register
$D01F   Sprite-BG Collision     Sprite-background collision register
```

## Key Registers
- $D01B-$D01F - VIC-II - Sprite feature registers: priority, multicolor, double-width, sprite-sprite collision, sprite-background collision (bits map to sprites 0–7)

## References
- "vic_sprite_registers" — expands on sprite position/pointer registers and related VIC-II sprite details

## Labels
- D01B
- D01C
- D01D
- D01E
- D01F
