# VIC-II Sprite Registers ($D000-$D00F, $D010)

**Summary:** VIC-II sprite coordinate registers: $D000-$D00F contain sprite X/Y position bytes (two bytes per sprite: low X (bits 0–7) and Y), and $D010 holds the X-coordinate MSB (bit #8) for sprites 0–7. Searchable terms: $D000, $D010, VIC-II, sprite X MSB, sprite coordinates.

## Description
The VIC-II provides per-sprite position data in I/O space. The 16 bytes at $D000-$D00F hold the X (low 8 bits) and Y bytes for sprites 0–7 (two bytes per sprite). Because the visible horizontal range requires a ninth bit for X, the high bit (bit #8) for each sprite's X coordinate is kept together in register $D010: each bit 0–7 of $D010 corresponds to the MSB of sprite X for sprites 0–7 respectively.

To form the full 9-bit X coordinate for a sprite n (0..7):
- Read the low 8-bit X from the appropriate byte in $D000-$D00F.
- Extract bit n from $D010; that bit is X bit #8.
- Combine: X_full = X_low + ((($D010 >> n) & 1) << 8)

The resulting X_full is a 9-bit value (0..511). Y coordinates are stored in the paired byte (same 16-byte block) and are 8-bit values (0..255).

## Source Code
```text
VIC-II Sprite Registers (summary)

$D000-$D00F  Sprite Coords      Sprites 0-7 X/Y positions (two bytes per sprite: X low (bits 0-7) and Y)
$D010        Sprite X MSB       Bit #0 = sprite 0 X bit8, Bit #1 = sprite 1 X bit8, ... Bit #7 = sprite 7 X bit8
```

```asm
; Example: read full X coordinate for sprite 0 (assembly)
; A = low 8 bits from $D000 (sprite 0 X low)
LDA $D000        ; load X low for sprite 0
STA temp         ; store low byte
LDA $D010        ; load X MSB bits for sprites 0-7
AND #$01         ; isolate bit 0 (sprite 0 MSB)
LSL A            ; shift into bit position 1 (for combining)
LSL A            ; ...continue until bit 8 position (or use shift-and-add technique)
; simpler combine in C-like pseudocode: X = Xlow + (((peek($D010) >> 0) & 1) << 8)
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0-7 X/Y positions (X bits 0-7 only; two bytes per sprite: low X and Y)
- $D010 - VIC-II - Sprite X MSB bits for sprites 0-7 (each bit = X bit #8 for corresponding sprite)

## References
- "vic_screen_control_registers" — screen control registers $D011-$D018
- "default_screen_memory" — sprite pointers at $07F8-$07FF

## Labels
- $D000
- $D010
