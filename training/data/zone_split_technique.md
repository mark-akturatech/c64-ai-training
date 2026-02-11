# Zone split — sprite multiplexing by rewriting Y, frames and colors (Cadaver / Lasse Oorni)

**Summary:** Zone split sprite multiplexing for the VIC-II: reuse sprite hardware by rewriting sprite Y positions ($D007, $D009, $D00B, $D00D, $D00F), sprite color registers ($D02A-$D02E) and frame/color tables in RAM ($C3FB-$C3FF) from a raster interrupt; key constraints are that sprite Y must be written before the raster reaches that Y, and frame/color writes take at least one raster line causing visible timing overlap.

## Zone split technique
Zone split is a raster-interrupt multiplexing method that re-uses the same sprite hardware rows to display multiple logical rows of a large multi-row enemy (example: a 5×4 boss built from 5 sprites per row, 4 rows = 20 logical sprites). X positions are fixed and set once; on each row's raster interrupt the code:

- advances the Y coordinate of a source sprite (example uses the 4th sprite Y at $D007) by a vertical offset and stores that value into the Y registers of the group (here sprites 4–8: $D007, $D009, $D00B, $D00D, $D00F), so the same hardware sprites draw at new vertical positions.
- rewrites frame/index and color tables (the example stores frame entries to RAM at $C3FB-$C3FF and writes color bytes into VIC-II sprite color registers $D02A-$D02E).
- advances a software sprite index by 5 for the next row to fetch the next set of frames/colors.

Hardware constraints and consequences:
- Sprite Y register writes must happen before the raster reaches the target Y line; if too late, that sprite will not appear at all. (Writes can safely occur after the previous sprite row has started rendering.)
- Frame and color register updates require at least one raster line to take effect across affected sprites; consequently you will see timing artifacts:
  - the last pixel line(s) of the previous logical row may already be drawn using the new frame/color data (if writes happen too early), or
  - the first pixel line(s) of the new logical row may still display the previous frame/colors (if writes happen too late).
- Mitigations include careful timing adjustment of the interrupt point and designing sprites so the first/last scanlines are visually tolerant (for example, rely only on multicolor pixels on problematic scanlines so the single-sprite color changes matter less).

This technique trades freedom (you must coordinate rows and timing) for the ability to display more large composite enemies than there are hardware sprites.

## Source Code
```asm
; ASCII diagram of sprite layout (3-player sprites omitted; 5 sprites per row, 4 rows)
; (Place diagrams and reference data here for retrieval)
;                   4 5 6 7 8
;                   4 5 6 7 8
;                   4 5 6 7 8
;              1    4 5 6 7 8
;              2
;     ______________________________

        lda $d007        ; Take the Y-coord of the 4th sprite,
        clc              ; advance it 21 pixels lower and
        adc #21          ; write to Y-coords of sprites 4-8.
        sta $d007        ; This must happen before the raster
        sta $d009        ; line reaches the new Y-coordinate,
        sta $d00b        ; or sprites won't be displayed.
        sta $d00d
        sta $d00f
        ldx spriteindex
        lda frametable,x    ; Here, X has been loaded with an index
        sta $c3fb            ; into the boss enemy's sprite frame &
        lda frametable+1,x   ; color tables. Screen memory is at
        sta $c3fc            ; $c000
        lda frametable+2,x
        sta $c3fd
        lda frametable+3,x
        sta $c3fe
        lda frametable+4,x
        sta $c3ff
        lda colortable,x
        sta $d02a
        lda colortable+1,x
        sta $d02b
        lda colortable+2,x
        sta $d02c
        lda colortable+3,x
        sta $d02d
        lda colortable+4,x
        sta $d02e
        txa              ; Increase the sprite index with 5
        clc              ; for the next sprite row.
        adc #5
        sta spriteindex
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0–7 X/Y positions (X/Y interleaved)
- $D02A-$D02E - VIC-II - Sprite color registers for sprites corresponding to the multiplexed group
- $C3FB-$C3FF - RAM (page $C000) - frametable / color table storage (example use in code)

## References
- "raster_interrupt_code_example_and_notes" — timing and register write ordering in raster interrupts
- "doublebuffering_sorted_sprite_tables" — double-buffering suggestion to avoid tearing while updating tables