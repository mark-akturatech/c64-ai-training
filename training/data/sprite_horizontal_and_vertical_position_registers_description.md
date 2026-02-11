# Sprite Horizontal and Vertical Position Registers ($D000-$D010)

**Summary:** VIC-II sprite position registers ($D000-$D00F, $D010) control each sprite's horizontal (0–511 using MSB) and vertical (0–255) placement; vertical values mark the top line of the sprite's 21-line height and the MSB register ($D010) supplies the 9th X bit (per-sprite). Includes visible ranges (vertical: lines 50–249; horizontal: dots 24–344) and power-up initialization (all zero).

## Details
- Registers $D000-$D00F (decimal 53248–53263) provide each sprite with its own horizontal and vertical position byte (16 bytes total for 8 sprites). Vertical values run 0–255 and represent the vertical position of the sprite's top scanline; each sprite is 21 scanlines high.
  - Visible picture vertical raster span (as used in this source) is lines 50 through 249. Because sprite positions are the top line:
    - Vertical position ≤ 29 ($1D) → sprite entirely above visible area.
    - Vertical position = 30 ($1E) → sprite bottom line (top+20) first appears at top of visible area (line 50).
    - Vertical position = 230 ($E6) → sprite bottom line is lost off the bottom.
    - Vertical position = 250 ($FA) → sprite entirely off the bottom.
- Horizontal positions use an 8-bit register plus one MSB per sprite to produce a 9-bit X (0–511). The shared Most Significant Bit (MSB) register is at $D010 (decimal 53264); each bit corresponds to one sprite and, when set, adds 256 to that sprite's 8-bit X register value.
  - Visible horizontal dot positions (from this source) are 24..344 (320 visible dots). Interpretations given:
    - Horizontal position 0 → sprite entirely left of visible area.
    - Position 1 → rightmost dot enters.
    - Position 24 ($18) → entire 24-dot-wide sprite fully visible.
    - Position 321 ($141) → rightmost dot passes right edge.
    - Position 355 ($158) → entire sprite off the right edge.
- Initialization: All these registers are cleared (0) on power-up.
- Example (from source): to set sprite 5 to X=30, POKE the low byte and clear that sprite's bit in $D010. (See Source Code for the BASIC example.)
- **[Note: Source may contain an error — the BASIC mask example for clearing “Bit 5” uses 255-16, which clears bit value 16 (bit 4) not 32 (bit 5) if sprites are numbered 0..7. Confirm bit numbering when applying masks.]**

## Source Code
```basic
REM Example from source (BASIC)
POKE 53258,30
POKE 53264,PEEK(53264)AND(255-16)
```

```text
Register map (reference):
$D000-$D00F  (53248-53263)  Sprite horizontal/vertical position registers (8 sprites, two bytes each)
$D010        (53264)        Most Significant X bits register (one bit per sprite; add 256 when bit=1)
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0-7 horizontal and vertical position registers (each sprite: 0–255 vertical; low 8 bits of horizontal)
- $D010 - VIC-II - Most Significant X bits (MSB) for sprites 0–7 (each bit adds 256 to that sprite's X)

## References
- "sprite_position_registers_list" — expands on List of $D000-$D00F registers
- "d010_msigx_register" — expands on Most significant X bits register ($D010)

## Labels
- $D000-$D00F
- $D010
