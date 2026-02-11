# Sprite Priorities (VIC-II)

**Summary:** Explains VIC-II sprite display priority: lower-numbered sprites (sprite 0) always appear in front of higher-numbered sprites (sprite 1..7). Mentions sprite-to-background priority register $D01B and gives BASIC POKE example lines to demonstrate layering.

## Sprite priority behavior
The VIC-II enforces a fixed sprite-to-sprite priority: "first come, first served" — lower-numbered sprites always have display priority over higher-numbered sprites when two or more sprites overlap. Concretely:
- Sprite 0 has priority over sprites 1–7.
- Sprite 1 has priority over sprites 2–7.
- ...
- Sprite 7 has the least priority and will be drawn behind any overlapping sprites 0–6.

This priority is a hardware rule of the VIC-II and is not changed by software other than changing which sprite number is used for which graphic. Sprite-to-background priority (whether a sprite can be placed behind the playfield) is controlled separately by the VIC-II sprite-background priority register ($D01B).

You can use this ordering deliberately when animating or composing multiple sprites: place foreground graphics in lower-numbered sprite slots (or swap sprite data between numbers) so they display in front of background or other moving objects without per-pixel masking.

## Source Code
```basic
50 POKEV,24:POKEV+1,50:POKEV+16,0
60 POKEV+2,34:POKEV+3,60
70 POKEV+4,44:POKEV+5,70
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register block (sprite position, enable, control, etc.)
- $D01B - VIC-II - Sprite-to-background priority bits (per-sprite control whether sprite appears behind background)

## References
- "sprite_display_priorities_and_sprite-background_priority" — expands on sprite-to-background priority and register $D01B