# VIC-II: Horizontal Fine Scrolling ($D016) and Sprite Registers ($D013-$D02E)

**Summary:** Describes VIC-II horizontal fine-scrolling and control register $D016 (bits 0-7), sprite collision interrupt enables at $D013-$D014, sprite priority ($D01B), sprite multicolor ($D01C), horizontal expansion ($D01D), collision status registers ($D01E-$D01F), and sprite color/multicolor registers ($D025-$D02E).

**Horizontal Fine Scrolling and Control Register ($D016)**

- **Bits 0–2:** Fine horizontal scroll (0–7) — selects pixel offset within a character cell for smooth horizontal scrolling.
- **Bit 3:** Select 38/40 column mode (0 = 38 columns, 1 = 40 columns).
- **Bit 4:** Enable multicolor mode for text/bitmap (1 = multicolor mode enabled).
- **Bit 5:** VIC-II reset (1 = video output off).
- **Bits 6–7:** Unused.

**Default/Power-on Value:** $C8 (11001000 in binary) — 40-column mode, multicolor mode disabled, fine scroll set to 0. ([c64-wiki.de](https://www.c64-wiki.de/wiki/VIC?utm_source=openai))

**Notes:**

- Fine scroll (bits 0–2) works together with coarse character-column scrolling (the character memory base/column offset). Changing bits 0–2 shifts the displayed pixels horizontally within each character cell; coarse column updates must be adjusted when fine-scroll wraps.
- The register affects whole-screen horizontal fine scroll. Partial-screen fine-scrolling (different fine-scroll values in top/bottom regions) requires raster-synchronized updates (raster interrupts) to change $D016 mid-frame.

**Sample BASIC Program Demonstrating Smooth Horizontal Scrolling and Partial-Screen Raster-Sync Scrolling:**


This program demonstrates smooth horizontal scrolling by adjusting the fine scroll bits in $D016. For partial-screen scrolling, raster interrupts are required to change $D016 mid-frame. ([atarimagazines.com](https://www.atarimagazines.com/compute/issue40/mixing_graphics_modes.php?utm_source=openai))

**Sprite Collision Interrupt Enables ($D013-$D014)**

- **Bit 2:** Enable Sprite–Foreground collision interrupt. Triggered when any sprite pixel overlaps a foreground display pixel (text or bitmap).
- **Bit 3:** Enable Sprite–Sprite collision interrupt. Triggered when any pixel of one sprite overlaps a pixel of another sprite.

When these interrupts fire, the interrupt handler should read:

- **Sprite–Sprite Collision Register** at 53278 ($D01E) to see which sprites collided.
- **Sprite–Foreground Collision Register** at 53279 ($D01F) to see which sprites touched foreground graphics.

**Sprite Priority, Multicolor, and Expansion**

**Sprite to Foreground Display Priority Register (53275 / $D01B — SPBGPR):**

- **Bits 0–7:** Set sprite priority vs foreground for sprites 0–7.
  - 0 = sprite appears in front of foreground graphics.
  - 1 = foreground graphics appear in front of sprite.
- Default power-on value is 0 (all sprites in front).
- Multicolor "01" bit-pair in foreground graphics is considered background for priority purposes (i.e., appears behind sprites even if foreground has priority).
- Sprite–sprite internal priority is fixed: lower-numbered sprites have priority over higher-numbered sprites (Sprite 0 in front of all others).

**Sprite Multicolor Register (53276 / $D01C — SPMC):**

- **Bits 0–7:** Enable multicolor mode per sprite (1 = multicolor, 0 = hi-res).
- Multicolor mode groups sprite shape bits into pairs, producing double-wide dots (sprite appears effectively 12 dots wide instead of 24); four bit-pair combinations map to:
  - 00: Background Color Register 0 (transparent)
  - 01: Sprite Multicolor Register 0 (53285 / $D025)
  - 10: Sprite Color Registers (53287–53294 / $D027–$D02E)
  - 11: Sprite Multicolor Register 1 (53286 / $D026)
- Each sprite has one unique color register; the two multicolor registers are shared among all sprites.

**Sprite Horizontal Expansion Register (53277 / $D01D — XXPAND):**

- **Bits 0–7:** Per-sprite horizontal expansion (1 = double-width sprite, 0 = normal).

**Collision Status Registers (for reading which sprites are involved):**

- **Sprite–Sprite Collision Register:** 53278 ($D01E)
- **Sprite–Foreground Collision Register:** 53279 ($D01F)

## Source Code

```basic
10 POKE 53270,PEEK(53270) AND 248 ' Reset fine scroll bits
20 FOR I = 0 TO 7
30 POKE 53270,(PEEK(53270) AND 248) OR I ' Set fine scroll
40 FOR J = 1 TO 100:NEXT J ' Delay
50 NEXT I
60 GOTO 20
```


```text
; Horizontal Fine Scrolling and Control Register
; 53270  $D016  HSCROL/CONTROL
; Bit 0-2: Fine horizontal scroll (0-7)
; Bit 3:  38/40 column select
; Bit 4:  Multicolor enable (text/bitmap)
; Bit 5:  VIC-II reset (video off when 1)
; Bit 6-7: unused

; Sprite collision interrupt enable registers (53267-8 / $D013-$D014)
; Bit 2: Sprite-Foreground collision interrupt enable
; Bit 3: Sprite-Sprite collision interrupt enable
; (Read collision status at $D01E/$D01F)

; Sprite to Foreground Display Priority Register
; 53275  $D01B  SPBGPR
; Bit 0: Sprite 0 priority vs foreground (0 = sprite in front)
; Bit 1: Sprite 1 ...
; ...
; Bit 7: Sprite 7 ...

; Sprite Multicolor Register
; 53276  $D01C  SPMC
; Bit 0: Sprite 0 multicolor (1 = multicolor)
; Bit 1: Sprite 1 ...
; ...
; Bit 7: Sprite 7 ...

; Sprite Horizontal Expansion Register
; 53277  $D01D  XXPAND
; Bit 0: Expand Sprite 0 horizontally (1 = double-width)
; ...
; Bit 7: Expand Sprite 7

; Sprite color mapping (multicolor sources)
; 00 -> Background Color Register 0 (transparent)
; 01 -> Sprite Multicolor Register 0 (53285 / $D025)
; 10 -> Sprite Color Registers (53287-53294 / $D027-$D02E)
; 11 -> Sprite Multicolor Register 1 (53286 / $D026)

; Collision status registers
; 53278  $D01E  Sprite-Sprite Collision Register
; 53279  $D01F  Sprite-Foreground Collision Register

; Sprite color registers:
; 53285  $D025  Sprite Multicolor Register 0
; 53286  $D026  Sprite Multicolor Register 1
; 53287  $D027  Sprite 0 color
; ...
; 53294  $D02E  Sprite 7 color
```

## Key Registers

- $D013-$D014 - VIC-II - Sprite collision interrupt enable bits (sprite-foreground and sprite-sprite)
- $D016 - VIC-II - Horizontal fine scroll and control (fine scroll bits, 38/40 column, multicolor enable, VIC-II reset)
- $D01B-$D01D - VIC-II - Sprite-to-foreground priority (SPBGPR), Sprite multicolor enable (SPMC), Sprite horizontal expansion (XXPAND)
- $D01E-$D01F - VIC-II - Sprite-sprite and Sprite-foreground collision status registers
- $D025-$D02E - VIC-II - Sprite multicolor registers and Sprite color registers ($D025 multicolor 0, $D026 multicolor 1, $D027-$D02E sprite colors)

## References

- "vertical_fine_scrolling_and_control_register_$D011" — paired register controlling vertical vs horizontal fine-scrolling (see for complementary vertical-fine-scroll behavior and raster timing)

## Labels
- HSCROL
- SPBGPR
- SPMC
- XXPAND
