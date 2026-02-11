# $D015 (53269) SPENA — Sprite Display Enable Register

**Summary:** $D015 (VIC-II SPENA) controls sprite display enable bits 0-7 (1=on). Enabling a sprite requires its bit set, a non-zero sprite data pointer, a non-background sprite color, and X/Y positions inside the visible screen ranges.

## Description
Bits 0–7 in $D015 individually enable sprites 0–7 when set to 1 (default 0 = off). Setting a sprite's enable bit alone does not guarantee it will be shown — the following conditions must also be met:

- Sprite Pointer (sprite data pointer) must point to sprite data that is not all zero.
- Sprite Color Register must contain a color different from the background color.
- Sprite Horizontal and Vertical Position Registers must place the sprite within the visible screen ranges (see sprite position registers $D000-$D00F).

This register is part of the VIC-II ($D000-$D02E) register block. Typical use: set the appropriate bit in $D015 to enable a sprite after initializing its pointer, color, and X/Y positions.

## Source Code
```text
$D015        SPENA        Sprite Enable Register

                     0    Enable Sprite 0 (1=sprite is on, 0=sprite is off)
                     1    Enable Sprite 1 (1=sprite is on, 0=sprite is off)
                     2    Enable Sprite 2 (1=sprite is on, 0=sprite is off)
                     3    Enable Sprite 3 (1=sprite is on, 0=sprite is off)
                     4    Enable Sprite 4 (1=sprite is on, 0=sprite is off)
                     5    Enable Sprite 5 (1=sprite is on, 0=sprite is off)
                     6    Enable Sprite 6 (1=sprite is on, 0=sprite is off)
                     7    Enable Sprite 7 (1=sprite is on, 0=sprite is off)

                          In order for any sprite to be displayed, the corresponding bit in this
                          register must be set to 1 (the default for this location is 0).  Of
                          course, just setting this bit along will not guarantee that a sprite
                          will be shown on the screen.  The Sprite Data Pointer must indicate a
                          data area that holds some values other than 0.  The Sprite Color
                          Register must also contain a value other than that of the background
                          color.  In addition, the Sprite Horizontal and Vertical Position
                          Registers must be set for positions that lie within the visible screen
                          range in order for a sprite to appear on screen.
```

## Key Registers
- $D015 - VIC-II - Sprite Enable Register (SPENA) — bits 0-7 enable sprites 0–7

## References
- "sprite_position_registers_list" — expands on Positions must be set in $D000-$D00F
- "sprite_color_registers" — expands on Sprite colors are set in $D027-$D02E

## Labels
- SPENA
