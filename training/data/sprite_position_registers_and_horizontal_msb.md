# Sprite position registers ($D000-$D010)

**Summary:** VIC-II sprite position registers $D000-$D010 control sprite vertical (Y) and horizontal (X) placement for sprites 0–7. Vertical Y registers are 0–255, representing the sprite's top line (sprite height = 21 lines). Horizontal X positions use 8-bit low bytes plus a 9th bit in $D010 (bits 0–7) to form 0–511 X coordinates.

**Registers and behavior**

- **Vertical positions**
  - Sprite Y registers ($D001, $D003, $D005, $D007, $D009, $D00B, $D00D, $D00F) contain an 8-bit value (0–255) representing the top scan line of the 21-line sprite. The sprite covers that top line and the next 20 lines (21 lines total).
  - On a standard VIC-II display, the visible raster lines (where sprites can appear on-screen) are approximately 50–249; whether a sprite is visible depends on its top-line value and the visible-vertical window. (Exact visible lines depend on border/timing and PAL/NTSC variations.)

- **Horizontal positions**
  - Each sprite has an 8-bit low X byte and a 1-bit MSB to address a 9-bit horizontal coordinate (0–511 dots).
  - Low bytes for sprite X are contiguous VIC-II registers ($D000, $D002, $D004, $D006, $D008, $D00A, $D00C, $D00E); the ninth bit for each sprite is in $D010 (one bit per sprite). Combine low byte and MSB to get full X: X = (MSB<<8) + low_byte.
  - Example logic:
    - To place sprite N at X < 256: write low byte to sprite X register and clear bit N in $D010.
    - To place sprite N at X ≥ 256 (e.g., X = 300): write low byte = 300 & 0xFF (44), and set bit N in $D010.

- **$D010 (sprite X MSBs)**
  - Bits 0–7 correspond to sprites 0–7 respectively. Set bit for a sprite to add 256 to its low X byte; clear it to use the low byte alone.

- **Visible horizontal dot range**
  - The standard visible screen width is 320 pixels, corresponding to horizontal dot positions 24–343. Sprites positioned outside this range will not be visible on-screen.

- **Sprite enable and size/zoom registers**
  - **Sprite Enable Register ($D015):** Each bit (0–7) corresponds to sprites 0–7. Setting a bit to 1 enables the corresponding sprite; setting it to 0 disables it.
  - **Sprite Double-Width Register ($D01D):** Each bit (0–7) corresponds to sprites 0–7. Setting a bit to 1 doubles the width of the corresponding sprite; setting it to 0 uses normal width.
  - **Sprite Double-Height Register ($D017):** Each bit (0–7) corresponds to sprites 0–7. Setting a bit to 1 doubles the height of the corresponding sprite; setting it to 0 uses normal height.

## Source Code

```text
VIC-II register quick map (addresses hex and decimal)

$D000 (53248) - Sprite 0 X (low 8 bits)
$D001 (53249) - Sprite 0 Y (top line)
$D002 (53250) - Sprite 1 X
$D003 (53251) - Sprite 1 Y
$D004 (53252) - Sprite 2 X
$D005 (53253) - Sprite 2 Y
$D006 (53254) - Sprite 3 X
$D007 (53255) - Sprite 3 Y
$D008 (53256) - Sprite 4 X
$D009 (53257) - Sprite 4 Y
$D00A (53258) - Sprite 5 X
$D00B (53259) - Sprite 5 Y
$D00C (53260) - Sprite 6 X
$D00D (53261) - Sprite 6 Y
$D00E (53262) - Sprite 7 X
$D00F (53263) - Sprite 7 Y

$D010 (53264) - Sprite X MSBs
  Bit 0 = Sprite 0 X MSB (adds 256 when set)
  Bit 1 = Sprite 1 X MSB
  Bit 2 = Sprite 2 X MSB
  Bit 3 = Sprite 3 X MSB
  Bit 4 = Sprite 4 X MSB
  Bit 5 = Sprite 5 X MSB
  Bit 6 = Sprite 6 X MSB
  Bit 7 = Sprite 7 X MSB

$D015 (53269) - Sprite Enable Register
  Bit 0 = Sprite 0 enable
  Bit 1 = Sprite 1 enable
  Bit 2 = Sprite 2 enable
  Bit 3 = Sprite 3 enable
  Bit 4 = Sprite 4 enable
  Bit 5 = Sprite 5 enable
  Bit 6 = Sprite 6 enable
  Bit 7 = Sprite 7 enable

$D01D (53277) - Sprite Double-Width Register
  Bit 0 = Sprite 0 double width
  Bit 1 = Sprite 1 double width
  Bit 2 = Sprite 2 double width
  Bit 3 = Sprite 3 double width
  Bit 4 = Sprite 4 double width
  Bit 5 = Sprite 5 double width
  Bit 6 = Sprite 6 double width
  Bit 7 = Sprite 7 double width

$D017 (53271) - Sprite Double-Height Register
  Bit 0 = Sprite 0 double height
  Bit 1 = Sprite 1 double height
  Bit 2 = Sprite 2 double height
  Bit 3 = Sprite 3 double height
  Bit 4 = Sprite 4 double height
  Bit 5 = Sprite 5 double height
  Bit 6 = Sprite 6 double height
  Bit 7 = Sprite 7 double height
```

```basic
; BASIC examples (decimal addresses)

; Place sprite 0 at X=300, Y=120:
POKE 53248, 44            ; $D000 = low X byte (300 & 0xFF)
POKE 53249, 120           ; $D001 = Y (sprite 0 top line)
POKE 53264, PEEK(53264) OR 1    ; $D010 bit0 = 1 -> MSB set

; Move sprite 0 back to X=100:
POKE 53248, 100           ; low X byte = 100
POKE 53264, PEEK(53264) AND 254  ; clear bit0 (AND with 11111110b)
```

```asm
; 6502 example: set sprite1 X to 280 (280 = 0x118)
; low = 0x18, MSB set -> bit1 in $D010
    LDA #$18
    STA $D002        ; sprite1 low X
    LDA $D010
    ORA #$02         ; set bit1
    STA $D010
```

## Key Registers

- $D000-$D010 - VIC-II - Sprite 0-7 vertical (Y) and horizontal (X low + MSB) position registers
- $D015 - VIC-II - Sprite Enable Register
- $D01D - VIC-II - Sprite Double-Width Register
- $D017 - VIC-II - Sprite Double-Height Register

## References

- "sprite_display_enable_position_and_color_registers" — expands on enable bits and colors necessary to make sprite visible