# Commodore 64 VIC-II (6566) — Sprite Register Layout

**Summary:** VIC-II sprite registers at $D000-$D02E map sprite X/Y positions, colors, and per-sprite control bits (X MSB, enable, expand, multicolor, priority, collision interrupts). Contains addresses and ranges for Sprite 0–7 position bytes and control/status bits.

## Sprite register layout
This chunk documents the VIC-II (6566) registers used for hardware sprites (8 sprites, numbered 0–7).

- Sprite X position low bytes are mapped in the $D000-$D00E range (one byte per sprite). These are the low 8 bits of each sprite's horizontal coordinate.
- Sprite Y positions are mapped in the interleaved odd addresses $D001-$D00F (one byte per sprite).
- Sprite color bytes are in $D027-$D02E (one byte per sprite).
- The ninth (high) X bit and per-sprite control/status flags are single-bit fields located in the listed control registers ($D010, $D015, $D017, $D01B, $D01C, $D01D, $D01E, $D01F). Each bit in those bytes corresponds to one sprite (one bit per sprite). The source lists the function of each control register but does not enumerate which bit maps to which sprite — standard VIC-II convention is bit0 → sprite 0, bit1 → sprite 1, etc. (short parenthetical).

Behavioral notes included in source:
- X positions require combining the low byte from $D000-$D00E with the corresponding high X bit from $D010 to form a 9-bit X coordinate.
- Sprite enable, expand, multicolor, priority, and collision interrupt flags are controlled/read via single-bit registers; these are per-sprite bits grouped into bytes.

## Source Code
```text
                            Sprite (1 byte each)
                        0   1   2   3   4   5   6   7
                      +---+---+---+---+---+---+---+---+
        $D000 - $D00E |  X Position (even addresses)  | 53248 - 53262
                      +-------------------------------+
        $D001 - $D00F |  Y Position (odd addresses)   | 53249 - 53263
                      +-------------------------------+
                      +-------------------------------+
        $D027 - $D02E |             Color             | 53287 - 53297
                      +-------------------------------+

                             Sprite (1 bit each)
                        7   6   5   4   3   2   1   0
                      +---+---+---+---+---+---+---+---+
                $D010 |      X-Position High Bit      | 53264
                      +-------------------------------+
                      +-------------------------------+
                $D015 |         Sprite Enable         | 53269
                      +-------------------------------+
                      +-------------------------------+
                $D017 |           Y-Expand            | 53271
                      +-------------------------------+
                      +-------------------------------+
                $D01B |      Background Priority      | 53275
                      +-------------------------------+
                $D01C |       Multicolor Enable       | 53276
                      +-------------------------------+
                $D01D |           X-Expand            | 53277
                      +-------------------------------+
                $D01E | Interrupt:  Sprite Collision  | 53278
                      +-------------------------------+
                $D01F |Interrupt:  Sprite/bg Collision| 53279
                      +-------------------------------+
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0–7 X/Y positions (even addresses = X low byte $D000-$D00E; odd addresses = Y positions $D001-$D00F)
- $D027-$D02E - VIC-II - Sprite 0–7 color bytes
- $D010 - VIC-II - Sprite X-position high bit (one bit per sprite)
- $D015 - VIC-II - Sprite enable (one bit per sprite)
- $D017 - VIC-II - Sprite Y-expand (one bit per sprite)
- $D01B - VIC-II - Sprite background priority (one bit per sprite)
- $D01C - VIC-II - Sprite multicolor enable (one bit per sprite)
- $D01D - VIC-II - Sprite X-expand (one bit per sprite)
- $D01E - VIC-II - Sprite-to-sprite collision status/interrupt (one bit per sprite)
- $D01F - VIC-II - Sprite-to-background collision status/interrupt (one bit per sprite)

## References
- "c64_memory_map_high_memory" — expands on VIC-II registers live in the $D000 video region