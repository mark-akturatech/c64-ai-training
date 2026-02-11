# Sprite Collision Detection Registers ($D01E-$D01F)

**Summary:** VIC-II sprite collision registers $D01E (sprite-sprite) and $D01F (sprite-foreground) report which sprites participated in collisions; reading either register clears its detection latch. These are used together with the IRQ flags in $D019 (VIC-II interrupt register).

## Description
- $D01E and $D01F are 8-bit read-only registers. Each bit corresponds to one hardware sprite: bit 0 → sprite 0, bit 1 → sprite 1, …, bit 7 → sprite 7. A bit set to 1 means that sprite was involved in the most recent detected collision.
- Reading either register clears that register’s collision latch so it can record the next collision. If you need the value for multiple checks, copy it to RAM immediately after reading.
- Collisions are only signalled when the sprite pixel(s) involved are nonzero (transparent pixels do not trigger collisions). In multicolor mode, certain bit-pair values (for example, the 01 pair) are treated as background and do not count as a sprite pixel for collision detection.
- The VIC-II interrupt flags (see $D019) indicate that collisions have occurred; these collision registers specify which sprites were involved. Use the IRQ bits as a notification and read $D01E/$D01F to identify participants.
- Behavior note: a sprite-sprite collision requires overlapping sprite shape bits from both sprites at the same screen pixel; sprite-foreground requires overlapping sprite shape bits with non-sprite foreground (character/bitmap) pixels.

## Source Code
```text
Register bit mapping (each register 8 bits):
Bit 7 6 5 4 3 2 1 0
    S7 S6 S5 S4 S3 S2 S1 S0
Where Sx = 1 indicates sprite x was involved in the detected collision.
```

```asm
; Example: read sprite-sprite collision register and store to zero-page
        LDA #$00
        STA CollMask        ; clear variable (optional)
        LDA $D01E           ; read sprite-sprite collision register (clears latch)
        STA CollMask        ; save for later tests

; Example: read sprite-foreground collision register
        LDA $D01F
        STA CollFGMask
```

```text
Notes:
- $D01E = sprite-sprite collision register (read-only)
- $D01F = sprite-foreground collision register (read-only)
- Reading either register clears that register's latch.
```

## Key Registers
- $D01E-$D01F - VIC-II - Sprite collision detection registers (bits correspond to sprites 0–7; read clears latch)

## References
- "d01e_sprite_sprite_collision_register" — expands on $D01E Sprite-Sprite Collision register details
- "d01f_sprite_foreground_collision_register" — expands on $D01F Sprite-Foreground Collision register details

## Labels
- D01E
- D01F
