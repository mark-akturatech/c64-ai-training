# Sprite horizontal movement — two BASIC examples (full-range and expanded sprites)

**Summary:** Two Commodore 64 BASIC examples showing horizontal movement of sprite 0 using VIC-II registers $D000 and $D010 (X low byte and X MSB), plus related VIC-II pokes; demonstrates full 0..347 horizontal range and handling of expanded sprites that must start off-screen on the right and wrap across the 255 boundary.

## Description
These two short BASIC programs move sprite 0 horizontally by POKEing the sprite X low byte and the X MSB (9th bit) in the VIC-II registers. The programs use v = 53248 (decimal) — that's $D000, the VIC-II base register for sprite positions used here. The MSB for sprites (bits 0..7 correspond to sprites 0..7) is at v+16 = $D010.

Key behaviors illustrated:
- Example 1 (p142_1.prg): loops J from 0 to 347 and computes HX = INT(J/256) (MSB 0 or 1) and LX = J - 256*HX (low byte). It POKEs LX into $D000 and HX into $D010 to move sprite 0 across the full 0..347 range.
- Example 2 (p142_2.prg): for expanded sprites (wider than normal) you must start the sprite off-screen on the right. The program sets expansion bits and starts J at 488 (off-screen right), increments J with wrap (if J>511 then J=0) and writes low/MSB bytes accordingly; it only updates while J is outside the central range, producing the required offscreen start and wrap behavior. The HX calc (INT(J/256)) toggles the MSB when J passes 255.

Notes preserved from source:
- sprite must be 0 (sprite index 0 — turned OFF/controlled individually).
- Bits 0..7 of the X MSB register correspond to sprites 0..7 (bit set = high X bit = 1 for that sprite).

## Source Code
```basic
10 print"{clear}"
20 poke2040,13
30 for i=0 to 62: poke832+i,129: next
40 v=53248
50 pokev+21,1
60 pokev+39,1
70 pokev+1,100
80 for j=0 to 347
90 hx=int(j/256): lx=j-256*hx
100 pokev,lx: pokev+16,hx: next
```

```basic
10 print"{clear}"
20 poke2040,13
30 for i=0 to 62: poke832+i,129: next
40 v=53248
50 pokev+21,1
60 pokev+39,1: pokev+23,1: pokev+29,1
70 pokev+1,100
80 j=488
90 hx=int(j/256): lx=j-256*hx
100 pokev,lx: pokev+16,hx
110 j=j+1: if j>511 then j=0
120 if j>488 or j<348 goto 90
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0–7 X (low byte, even offsets) and Y (low byte, odd offsets) positions
- $D010 - VIC-II - Sprite X MSB (bits 0..7 = sprites 0..7)
- $D015 - VIC-II - Sprite enable / display control (used here to enable sprite 0)

## References
- "sprite_horizontal_positioning_and_X_MSB_explanation" — expands on how examples use MSB and low-byte POKE sequence