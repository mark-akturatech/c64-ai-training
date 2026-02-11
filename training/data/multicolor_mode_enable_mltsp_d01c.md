# MLTSP ($D01C) — Per-sprite Multicolor Enable

**Summary:** The VIC-II register $D01C (MLTSP) selects multicolor mode on a per-sprite basis; setting a bit enables multicolor for that sprite and clearing it disables multicolor.

**Multicolor per-sprite selection**

MLTSP ($D01C) is the VIC-II register whose bits enable or disable multicolor mode individually for hardware sprites. Each bit in the byte corresponds to one sprite; a bit set to 1 enables multicolor for that sprite, a bit cleared to 0 disables multicolor for that sprite. (Multicolor mode changes sprite pixel interpretation to 2-bit pairs, halving horizontal resolution — see referenced chunks for details.)

The register is written to to change the per-sprite multicolor state. Use bit masking to change individual sprite settings without affecting the other bits.

## Source Code

```text
; Enable multicolor mode for sprite 3
LDA $D01C
ORA #%00001000  ; Set bit 3
STA $D01C

; Disable multicolor mode for sprite 3
LDA $D01C
AND #%11110111  ; Clear bit 3
STA $D01C
```

## Key Registers

- $D01C - VIC-II - Per-sprite multicolor enable bits (bit N → sprite N, 0..7)

## References

- "multicolor_sprite_mode_overview" — effect of multicolor on resolution and bit interpretation
- "multicolor_bitpair_color_mapping_table_7_4" — which registers/colors correspond to each multicolor bit-pair value

## Labels
- MLTSP
