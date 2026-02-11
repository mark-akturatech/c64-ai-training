# Sprite position registers — SPR6X, SPR6Y, SPR7X, SPR7Y, and XMSB

**Summary:** VIC-II sprite position registers SPR6X/SPR6Y ($D00C/$D00D) and SPR7X/SPR7Y ($D00E/$D00F) hold the low 8 bits of sprite 6/7 horizontal/vertical positions; $D010 (XMSB) holds the most-significant (9th) bit for all sprite X positions (bits 0–7 = sprites 0–7).

**Description**

- Sprite horizontal (X) and vertical (Y) positions are 9-bit (X) / 8-bit (Y) values on the C64 VIC-II. The low 8 bits of each sprite's X and Y are stored in the per-sprite registers; the 9th (most significant) X bit for every sprite is stored in a single shared register (XMSB).
- Register layout (standard VIC-II mapping):
  - Sprite n low X  = $D000 + 2*n
  - Sprite n low Y  = $D000 + 2*n + 1
  - XMSB            = $D010
- To form a sprite's full X coordinate:
  - X_full = ( (XMSB >> n) & 1 ) * 256 + SPRnX
  - Where n = sprite number (0..7). Bit 0 of $D010 is sprite 0 MSB, bit 6 is sprite 6 MSB, bit 7 is sprite 7 MSB.
- Example implications:
  - To place a sprite at X >= 256, set the corresponding bit in $D010 and write the low byte into the sprite's SPRnX register.
  - Y is only 8 bits (0..255) and uses the individual SPRnY register; there is no shared MSB for Y.
- Note on source data: the provided raw table contained OCR errors and shifted addresses (e.g., "SDOOE"); the table below uses the correct, standard VIC-II addresses.

## Source Code

```text
Register map (VIC-II, corrected):

Sprite 6:
  SPR6X  - Sprite 6 horizontal (low 8 bits)  - $D00C
  SPR6Y  - Sprite 6 vertical   (low 8 bits)  - $D00D

Sprite 7:
  SPR7X  - Sprite 7 horizontal (low 8 bits)  - $D00E
  SPR7Y  - Sprite 7 vertical   (low 8 bits)  - $D00F

X MSB register:
  XMSB   - Sprite X most-significant-bit register (bits 0..7 = sprites 0..7) - $D010
```

```asm
; Example: set Sprite 6 X = 300 (0x12C)
        LDA #$2C        ; low byte 0x2C
        STA $D00C       ; SPR6X
        LDA $D010
        ORA #$40        ; set bit 6 (1 << 6) for sprite 6 MSB
        STA $D010
```

## Key Registers

- $D000-$D00F - VIC-II - Sprite 0-7 X/Y position registers (low 8 bits; pattern: SPRnX = $D000+2*n, SPRnY = $D000+2*n+1)
- $D010 - VIC-II - Sprite X MSB register (bits 0-7 carry MSB for sprites 0-7 respectively)

## References

- "sprite_position_registers_0_1" — expands on position registers for sprites 0 and 1 and the table header
- "sprite_position_registers_2_3" — expands on position registers for sprites 2 and 3
- "sprite_position_registers_4_5" — expands on position registers for sprites 4 and 5

## Labels
- SPR6X
- SPR6Y
- SPR7X
- SPR7Y
- XMSB
