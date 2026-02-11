# VIC-II Sprite Color Registers ($D027-$D02E)

**Summary:** VIC-II sprite color registers at $D027..$D02E (decimal 53287..53294) hold a 4-bit color index (0–15) selecting the foreground color for sprites 0–7; non-foreground pixels in the sprite are transparent. See also multicolor mode registers $D025/$D026.

## Sprite Color Registers
Each sprite (0–7) has a dedicated color register in the VIC-II I/O area. The register contains a color index 0..15 (the VIC-II palette entries). Any pixel bit set in the sprite bitmap is displayed using that register's value; unset bits are transparent and show whatever is behind the sprite.

- Sprite numbers 0 through 7 map to consecutive color registers $D027 through $D02E (decimal 53287 through 53294).
- Color values are 0..15 (4 bits) selecting one of the VIC-II's 16 colors.
- Multicolor sprites use additional multicolor palette registers ($D025/$D026) — see referenced chunk for details.

## Source Code
```text
ADDRESS (DEC)   (HEX)    DESCRIPTION
53287           ($D027)  SPRITE 0 COLOR REGISTER
53288           ($D028)  SPRITE 1 COLOR REGISTER
53289           ($D029)  SPRITE 2 COLOR REGISTER
53290           ($D02A)  SPRITE 3 COLOR REGISTER
53291           ($D02B)  SPRITE 4 COLOR REGISTER
53292           ($D02C)  SPRITE 5 COLOR REGISTER
53293           ($D02D)  SPRITE 6 COLOR REGISTER
53294           ($D02E)  SPRITE 7 COLOR REGISTER

All sprite bitmap 'on' dots display in the color held in the sprite color register (0..15); the rest of the sprite is transparent (shows background or underlying layers).
```

## Key Registers
- $D027-$D02E - VIC-II - Sprite 0-7 color registers

## References
- "sprite_multicolor_mode_bit_pairs" — expands on multicolor mode and the extra multicolor registers $D025/$D026

## Labels
- SPRITE0_COLOR
- SPRITE1_COLOR
- SPRITE2_COLOR
- SPRITE3_COLOR
- SPRITE4_COLOR
- SPRITE5_COLOR
- SPRITE6_COLOR
- SPRITE7_COLOR
