# Sprite vertical (Y) positioning — visible ranges and BASIC example

**Summary:** Sprite vertical (Y) positioning for the VIC-II: 200 visible dot rows (0..199), sprite Y registers accept 0..255 for smooth on/off-screen movement; sprite design area is 24x21 (width x height). Includes BASIC POKE example using VIC-II base $D000 (53248) and registers $D000, $D001, $D010, $D015, $D027.

**Vertical positioning details**
- Sprite placement is measured from the top-left corner of the sprite's design area (24 dots wide × 21 dots high). All Y calculations start from that top-left corner regardless of how many pixels of the sprite are actually set.
- The visible screen has 200 programmable dot positions in Y (0..199). VIC sprite Y registers are 8-bit (0..255) to allow stepping sprites smoothly on and off-screen.
- Key Y thresholds (values are register contents):
  - First on-screen Y (top-most visible row) for an unexpanded sprite: 30
  - First on-screen Y for a vertically expanded sprite: 9 (each dot is twice as tall)
  - First Y where a sprite (expanded or not) is fully on-screen (all 21 lines displayed): 50
  - Last Y where an unexpanded sprite is fully on-screen: 229
  - Last Y where a vertically expanded sprite is fully on-screen: 208
  - First Y where a sprite is fully off-screen: 250
- Unexpanded sprite height (design area): 21 scanlines. Vertical expansion doubles the effective dot height (so the sprite covers up to 42 scanlines when expanded); reported thresholds above take that into account.
- Use the sprite Y register values (0..255) to move sprites smoothly through the on-screen and off-screen thresholds; values outside 0..199 are used to position sprites off-screen or partially off-screen.

## Source Code
```basic
10 PRINT"{CLEAR}"                : REM clear screen
20 POKE 2040,13                  : REM get sprite 0 data from block 13
30 FOR I=0 TO 62: POKE 832+I,129: NEXT : REM poke sprite data into block 13
40 V=53248                       : REM set beginning of video chip ($D000)
50 POKE V+21,1                    : REM enable sprite 0            (V+21 = $D015)
60 POKE V+39,1                    : REM set sprite 0 color         (V+39 = $D027)
70 POKE V+1,100                   : REM set sprite 0 Y position    (V+1  = $D001)
80 POKE V+16,0: POKE V,100        : REM set sprite 0 X position    (V   = $D000, V+16 = $D010)
```

## Key Registers
- $D000 - VIC-II - Sprite 0 X position (low byte)
- $D001 - VIC-II - Sprite 0 Y position (low byte; example uses POKE V+1)
- $D002 - VIC-II - Sprite 1 X position (low byte)
- $D003 - VIC-II - Sprite 1 Y position (low byte)
- $D004 - VIC-II - Sprite 2 X position (low byte)
- $D005 - VIC-II - Sprite 2 Y position (low byte)
- $D006 - VIC-II - Sprite 3 X position (low byte)
- $D007 - VIC-II - Sprite 3 Y position (low byte)
- $D008 - VIC-II - Sprite 4 X position (low byte)
- $D009 - VIC-II - Sprite 4 Y position (low byte)
- $D00A - VIC-II - Sprite 5 X position (low byte)
- $D00B - VIC-II - Sprite 5 Y position (low byte)
- $D00C - VIC-II - Sprite 6 X position (low byte)
- $D00D - VIC-II - Sprite 6 Y position (low byte)
- $D00E - VIC-II - Sprite 7 X position (low byte)
- $D00F - VIC-II - Sprite 7 Y position (low byte)
- $D010 - VIC-II - Sprite X MSB / high-bit flags (sprite X high bits; example uses POKE V+16)
- $D015 - VIC-II - Sprite enable register (bits enable sprite 0-7; example uses POKE V+21)
- $D027 - VIC-II - Sprite 0 color register (example uses POKE V+39)

## References
- "sprite_position_registers_and_addresses" — expands on register addresses for sprite X/Y and full VIC-II mapping

## Labels
- SP0X
- SP0Y
- SPRITE_X_MSB
- SPRITE_ENABLE
- SP0COLOR
