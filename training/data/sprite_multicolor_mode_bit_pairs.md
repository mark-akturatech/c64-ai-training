# Sprite Multi-Color Mode (bit-pair color mapping)

**Summary:** Sprite multi-color mode halves horizontal resolution (24 dots → 12 bit pairs) and maps each 2-bit pair to a color source: 00 = transparent/screen color, 01 = sprite multicolor register #0 ($D025 / 53285), 10 = sprite's own color register (foreground), 11 = sprite multicolor register #1 ($D026 / 53286). Enable per-sprite multicolor by setting bit N in control register $D01C (53276).

**Multi-color bit-pair mapping**
In multi-color sprite mode, each horizontal pair of bits (a BIT PAIR) selects one of four color sources. There are 12 bit pairs across the 24-dot-wide sprite; each bit pair value selects:

- 00 — transparent (shows background / screen color)
- 01 — sprite multicolor register #0 ($D025, decimal 53285)
- 10 — sprite's own color register (the sprite's foreground color)
- 11 — sprite multicolor register #1 ($D026, decimal 53286)

Note: The sprite foreground color is selected by bit pair 10, while character foreground color is selected by bit pair 11. This distinction highlights the difference in bit-pair values between sprite and character multi-color semantics.

Enabling multi-color for a specific sprite:
- Per-sprite multicolor is toggled by setting/clearing the corresponding bit (bit N for sprite N) in the VIC-II control register at $D01C (decimal 53276). Set the bit to enable multicolor for that sprite; clear it to disable.

Horizontal resolution:
- In multi-color sprite mode, the horizontal resolution is halved: sprites use 12 bit pairs instead of 24 individual dots.

**Sprite Color Registers**
Each sprite has its own color register that determines its foreground color in both high-resolution and multi-color modes. The addresses for these registers are:

- Sprite 0: $D027 (53287)
- Sprite 1: $D028 (53288)
- Sprite 2: $D029 (53289)
- Sprite 3: $D02A (53290)
- Sprite 4: $D02B (53291)
- Sprite 5: $D02C (53292)
- Sprite 6: $D02D (53293)
- Sprite 7: $D02E (53294)

These registers allow each sprite to display any of the 16 colors available on the VIC-II chip. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_135.html?utm_source=openai))

**VIC-II Register $D01C: Sprite Multi-Color Mode Control**
The VIC-II register at $D01C (53276) controls the multi-color mode for each sprite. Each bit in this register corresponds to one of the eight sprites:

- Bit 0: Sprite 0
- Bit 1: Sprite 1
- Bit 2: Sprite 2
- Bit 3: Sprite 3
- Bit 4: Sprite 4
- Bit 5: Sprite 5
- Bit 6: Sprite 6
- Bit 7: Sprite 7

Setting a bit to 1 enables multi-color mode for the corresponding sprite; setting it to 0 disables multi-color mode, reverting the sprite to high-resolution mode. ([c64-wiki.com](https://www.c64-wiki.com/wiki/sprite?utm_source=openai))

## Source Code
```text
BIT PAIR   COLOR SOURCE
00         Transparent / Screen color
01         Sprite Multicolor Register #0  ($D025 / 53285)
10         Sprite's own color register    (sprite foreground)
11         Sprite Multicolor Register #1  ($D026 / 53286)
```

```basic
REM Enable multicolor for sprite N (N = 0..7)
REM Set bit N in $D01C (53276)
REM Example: enable sprite 2 (N=2)
POKE 53276, PEEK(53276) OR (2^2)   : REM sets bit 2

REM Disable multicolor for sprite N
REM Clear bit N in $D01C (53276)
REM Example: disable sprite 2
POKE 53276, PEEK(53276) AND (255 - (2^2))   : REM clears bit 2
```

## Key Registers
- $D025 - VIC-II - Sprite multicolor register #0 (color source for bit-pair value 01)
- $D026 - VIC-II - Sprite multicolor register #1 (color source for bit-pair value 11)
- $D01C - VIC-II - Per-sprite multicolor enable/control register (set bit N to enable multicolor for sprite N; clear to disable)
- $D027-$D02E - VIC-II - Sprite color registers for sprites 0-7 (foreground color in both high-resolution and multi-color modes)

## References
- "set_sprite_multicolor_mode" — expands on register to toggle multi-color mode bits
- "defining_sprite_size_and_layout" — expands on multicolor sprites halving horizontal resolution

## Labels
- $D025
- $D026
- $D01C
- $D027
