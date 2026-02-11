# Sprite animation and optional sprite features (Commodore 64 / VIC-II)

**Summary:** Moving and animating hardware sprites is achieved by writing to sprite position registers and updating the Sprite Data Pointers. Optional VIC-II features include X/Y expansion (double width/height), sprite collision detection ($D01E-$D01F), sprite/background priority ($D01B), and sprite multicolor mode via $D01C, with shared multicolor registers at $D025-$D026.

**Description**

- **Animation methods:**
  - **Move a sprite:** Update its position registers. Each sprite has X and Y position registers:
    - **X Position Registers:** Located at $D000, $D002, $D004, $D006, $D008, $D00A, $D00C, and $D00E for sprites 0 through 7, respectively.
    - **Y Position Registers:** Located at $D001, $D003, $D005, $D007, $D009, $D00B, $D00D, and $D00F for sprites 0 through 7, respectively.
    - **Most Significant Bit of X Position:** The 9th bit for each sprite's X position is controlled by bits in register $D010. Each bit corresponds to a sprite (bit 0 for sprite 0, bit 1 for sprite 1, etc.). ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_137.html?utm_source=openai))
  - **Change the Sprite Data Pointer:** Each sprite has a pointer located in memory addresses 2040 to 2047 ($07F8 to $07FF). These pointers specify the starting address of the sprite's shape data, divided by 64. For example, if sprite 0's shape data starts at address 832, the pointer at address 2040 should be set to 13 (832 / 64). ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_134.html?utm_source=openai))

- **Expansion (scaling):**
  - **Horizontal Expansion:** Controlled by register $D01D. Each bit corresponds to a sprite (bit 0 for sprite 0, bit 1 for sprite 1, etc.). Setting a bit to 1 doubles the sprite's width.
  - **Vertical Expansion:** Controlled by register $D017. Each bit corresponds to a sprite (bit 0 for sprite 0, bit 1 for sprite 1, etc.). Setting a bit to 1 doubles the sprite's height. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_137.html?utm_source=openai))

- **Collision detection:**
  - **Sprite-to-Sprite Collision:** Register $D01E indicates collisions between sprites. Each bit corresponds to a sprite; if a bit is set, that sprite has collided with another sprite.
  - **Sprite-to-Background Collision:** Register $D01F indicates collisions between sprites and background graphics. Each bit corresponds to a sprite; if a bit is set, that sprite has collided with the background. ([c64-wiki.com](https://www.c64-wiki.com/wiki/sprite?utm_source=openai))

- **Priority (sprite vs foreground):**
  - **Sprite Priority Register ($D01B):** Controls whether sprites appear in front of or behind background graphics. Each bit corresponds to a sprite (bit 0 for sprite 0, bit 1 for sprite 1, etc.). Setting a bit to 1 places the sprite behind the background; setting it to 0 places the sprite in front. ([c64-wiki.com](https://www.c64-wiki.com/wiki/sprite?utm_source=openai))

- **Multicolor sprites:**
  - **Multicolor Mode Enable ($D01C):** Each bit enables multicolor mode for a sprite (bit 0 for sprite 0, bit 1 for sprite 1, etc.). Setting a bit to 1 enables multicolor mode for the corresponding sprite.
  - **Shared Multicolor Registers:**
    - **$D025:** Defines the first shared multicolor value used by all multicolor sprites.
    - **$D026:** Defines the second shared multicolor value used by all multicolor sprites.
  - In multicolor mode, each pair of bits in the sprite data selects a color:
    - **00:** Transparent
    - **01:** Sprite's individual color (set in registers $D027 to $D02E for sprites 0 to 7)
    - **10:** Color from $D025
    - **11:** Color from $D026 ([c64-wiki.com](https://www.c64-wiki.com/wiki/sprite?utm_source=openai))

## Source Code

```assembly
; Example: Move sprite 0 to position (100, 50)
LDA #100
STA $D000  ; Set sprite 0 X position
LDA #50
STA $D001  ; Set sprite 0 Y position

; Example: Change sprite 0's data pointer to point to shape data at $2000
LDA #$20
STA 2040   ; Set sprite 0 data pointer (2040 = $07F8)

; Example: Enable sprite 0
LDA $D015
ORA #1
STA $D015  ; Set bit 0 to enable sprite 0

; Example: Check for sprite 0 collision with background
LDA $D01F
AND #1
BEQ NoCollision
; Collision detected, handle it here
NoCollision:
```

## Key Registers

- **$D000-$D00F:** Sprite X and Y position registers for sprites 0 to 7.
- **$D010:** Most significant bit of sprite X positions.
- **$D015:** Sprite enable register.
- **$D017:** Sprite vertical expansion register.
- **$D01B:** Sprite priority register.
- **$D01C:** Sprite multicolor mode enable register.
- **$D01D:** Sprite horizontal expansion register.
- **$D01E:** Sprite-to-sprite collision register.
- **$D01F:** Sprite-to-background collision register.
- **$D025:** Shared sprite multicolor register 1.
- **$D026:** Shared sprite multicolor register 2.
- **$D027-$D02E:** Individual sprite color registers for sprites 0 to 7.

## References

- "xexpand_and_yexpand_registers" — expands on Horizontal ($D01D) and vertical ($D017) expansion registers
- "sprite_collision_registers" — expands on Collision detection ($D01E-$D01F) and IRQ sources
- "spmc_sprite_multicolor_registers" — expands on Sprite multicolor config ($D01C, $D025-$D026)

## Labels
- $D000-$D00F
- $D010
- $D015
- $D017
- $D01B
- $D01C
- $D01D
- $D01E
- $D01F
- $D025
- $D026
- $D027-$D02E
