# VIC-II Sprite Registers — pointers, coordinates, enable bits, colours

**Summary:** Sprite pointers ($07F8-$07FF), VIC-II control registers ($D000-$D00F, $D010, $D015, $D027-$D02E) for sprite X/Y coordinates, X high bits, enable bits, and single-colour sprite registers.

## Sprite registers and usage
- Sprite pointers: Bytes at $07F8..$07FF select the sprite graphics pointer for sprites 0–7 (the byte at $07F8 is sprite 0’s pointer, $07F9 is sprite 1’s pointer, etc.).
- Enabling sprites: Set the corresponding bits in $D015 (VIC-II) to enable sprites. Bit N (0..7) enables sprite N. Examples from source: POKE $D015,1 enables sprite 0; POKE $D015,3 enables sprites 0 and 1.
- Coordinates (low bytes): X low bytes are at $D000, $D002, $D004, $D006, $D008, $D00A, $D00C, $D00E for sprites 0–7 respectively. Y low bytes are at $D001, $D003, $D005, $D007, $D009, $D00B, $D00D, $D00F for sprites 0–7 respectively.
- X high bit: Because the single-byte X registers hold 0–255 but the screen is 320 pixels wide, high bits for X are stored in $D010. If bit N in $D010 is set, sprite N’s X coordinate is 256 + value in the corresponding $D00x X register (i.e. X = 256 + $D000 when bit 0 of $D010 = 1).
- Colours: Single‑colour sprite colour values are written to $D027, $D028, $D029, $D02A, $D02B, $D02C, $D02D, $D02E for sprites 0–7 respectively. (Multicolour sprite formats and extra options are outside this chunk — see VIC reference for details.)

## Key Registers
- $07F8-$07FF - RAM - Sprite pointers (sprite 0..7)
- $D000-$D00F - VIC-II - Sprite X/Y low bytes (even = X0..X7 low, odd = Y0..Y7)
- $D010 - VIC-II - Sprite X high bits (bit N = high X bit for sprite N)
- $D015 - VIC-II - Sprite enable bits (bit N enables sprite N)
- $D027-$D02E - VIC-II - Sprite colour registers (single-colour sprites 0..7)

## References
- "sprite_example_movement" — example that uses these registers to move a sprite
