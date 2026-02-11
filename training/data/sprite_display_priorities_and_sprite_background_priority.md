# SPRITE DISPLAY PRIORITIES (VIC-II)

**Summary:** Sprite-to-sprite priority on the VIC-II is fixed by sprite number (lower-numbered sprite drawn in front). Sprite-to-background priority is controlled by the SPRITE-BACKGROUND PRIORITY register at 53275 ($D01B): one bit per sprite (0 = sprite in front of background, 1 = sprite behind background).

**Explanation**
- **Sprite-to-sprite:** Fixed ordering by sprite number. Sprite 0 has the highest priority (drawn foremost), sprite 1 next, ... sprite 7 lowest (drawn last). When sprites overlap, the lower-numbered sprite appears on top of higher-numbered sprites.
- **Sprite-to-background:** Controlled by the SPRITE-BACKGROUND PRIORITY register ($D01B, decimal 53275). Each bit in this register corresponds to one sprite: bit 0 = sprite 0, bit 1 = sprite 1, ... bit 7 = sprite 7. If the bit is 0, the sprite is shown in front of the background; if the bit is 1, the sprite is shown behind the background.
- **Transparency / "window" effect:** Sprite pixels that are transparent allow what is behind them to show through. If a higher-priority sprite has transparent pixels, lower-priority sprites (or the background, depending on $D01B) can be visible through those holes, producing a "window" effect.

**[Note: Source may contain an error — original phrasing implied "not set to 1 and thus turned ON"; correct behavior is: sprite pixel bits set (non-zero) are visible, zero bits are transparent.]**

**COLLISION DETECTS**
The VIC-II chip provides hardware support for detecting collisions between sprites and between sprites and background graphics:

- **Sprite-to-sprite collisions:** Detected via the SPRITE-TO-SPRITE COLLISION register at 53278 ($D01E). Each bit in this register corresponds to a sprite: bit 0 = sprite 0, bit 1 = sprite 1, ..., bit 7 = sprite 7. If a bit is set to 1, the corresponding sprite is involved in a collision with another sprite. The register is cleared automatically upon reading. ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-03-programming_graphics.pdf?utm_source=openai))

- **Sprite-to-background collisions:** Detected via the SPRITE-TO-BACKGROUND COLLISION register at 53279 ($D01F). Each bit in this register corresponds to a sprite: bit 0 = sprite 0, bit 1 = sprite 1, ..., bit 7 = sprite 7. If a bit is set to 1, the corresponding sprite is involved in a collision with background graphics. The register is cleared automatically upon reading. ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-03-programming_graphics.pdf?utm_source=openai))

**Note:** In multicolor mode, sprite pixels with a value of '01' are considered transparent for collision detection purposes, even though they are visible on the screen. ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-03-programming_graphics.pdf?utm_source=openai))

## Source Code
```text
; SPRITE-BACKGROUND PRIORITY register map (VIC-II)
; Address: $D01B (decimal 53275)
; Bit 7 Bit 6 Bit 5 Bit 4 Bit 3 Bit 2 Bit 1 Bit 0
;  S7    S6    S5    S4    S3    S2    S1    S0
; Each bit: 0 = sprite in front of background; 1 = sprite behind background

; BASIC examples:
10 REM Put sprite 3 behind background (set bit 3)
20 POKE 53275, 8    : REM bit3 = 1 -> sprite 3 behind background

10 REM Put sprites 0 and 1 behind background (set bits 0 and 1)
20 POKE 53275, 3    : REM bit0+bit1 = 1 -> sprites 0 and 1 behind background

; Assembly examples:
; Store immediate value into $D01B to set sprite/background priorities
    LDA #$08       ; set bit 3 -> sprite 3 behind background
    STA $D01B

; To set multiple bits without disturbing other bits:
; (read-modify-write)
    LDA $D01B
    ORA #$03       ; set bits 0 and 1
    STA $D01B
```

## Key Registers
- $D01B - VIC-II - Sprite-background priority (bit per sprite; 0 = sprite in front, 1 = sprite behind)
- $D01E - VIC-II - Sprite-to-sprite collision detection (bit per sprite; 1 = collision detected)
- $D01F - VIC-II - Sprite-to-background collision detection (bit per sprite; 1 = collision detected)

## References
- "sprite_multicolor_mode_bit_pairs" — discusses how multicolor sprite bit pairs and transparent areas affect priority/blending
- Commodore 64 Programmer's Reference Guide, Chapter 3: Programming Graphics

## Labels
- $D01B
- $D01E
- $D01F
