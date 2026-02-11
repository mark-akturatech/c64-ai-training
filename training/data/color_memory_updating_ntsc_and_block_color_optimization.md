# Multidirectional Scrolling — Color-memory update considerations

**Summary:** Color RAM ($D800-$DBFF) cannot be double-buffered and must be updated only when the portion being written is not being displayed; for NTSC compatibility split updates into two halves and buffer the row at the split. When colors are per-block (e.g. 4x4 tiles) instead of per-character, update frequency can be reduced (roughly 1/4th) by only touching every Nth column.

## Color-memory update considerations
- Color RAM on the C64 is single-buffered (one byte per screen character at $D800-$DBFF). It must be written while the target area is off-screen to avoid visible tearing or flicker.
- If you can ignore strict NTSC timing, you typically have time during vertical blank to shift ~20–21 raster lines of color RAM data. With NTSC compatibility you must be more careful: split the color update into two phases to avoid visible corruption.
  - Phase 1: While the lower half of the screen is being displayed, shift/update the upper half of color RAM.
  - Phase 2: After the game screen display has ended (end of frame — be careful on machines like the SuperCPU where timing can differ), shift/update the lower half of color RAM.
- When splitting top/bottom updates, the row at the split boundary must be buffered (copied to temporary RAM) before shifting so you can restore continuity when switching halves. (See Metal Warrior 2 & 3 source for an implementation example.)
- On machines or situations where the frame end timing is uncertain (accelerators, nonstandard hardware), you must detect or otherwise ensure the display has ended before performing the second half of updates.

## Inefficient per-character lookup (avoid)
- A common but very slow method is to rebuild color RAM by per-character table lookups and storing each color individually. Example (inefficient):
  ```asm
                ldy screen,x
                lda charcolortable,y
                sta colormemory,x
                ldy screen+40,x
                lda charcolortable,y
                sta colormemory+40,x
                ...
  ```
- This approach wastes roughly 4 cycles per byte compared to a plain shift/memcopy of color RAM and is so slow that NTSC-compatible split updating becomes impractical when using it. Avoid this method for scrolling updates.

## Optimization when colors are per-block (4x4 block example)
- If color granularity is coarser than per-character (e.g., one color per 4x4 character block, as in some SEUCK titles), most columns do not change when the tilemap scrolls horizontally.
- Example pattern (each digit = a block color) before/after a single-column horizontal scroll shows only every 4th column actually changes, allowing you to reduce color writes to roughly 1/4th of naive per-character updates.
- Use the block-size to compute which color RAM columns must be updated after a scroll and only write those columns; this reduces cycle usage substantially and helps preserve NTSC compatibility.

## Source Code
```asm
; Inefficient per-character lookup example (from source)
                ldy screen,x
                lda charcolortable,y
                sta colormemory,x
                ldy screen+40,x
                lda charcolortable,y
                sta colormemory+40,x
                ...
```

```text
; 4x4 block colour ASCII diagram (before -> after) — example from text

111122223333111122223333111122223333    111222233331111222233331111222233331
111122223333111122223333111122223333    111222233331111222233331111222233331
111122223333111122223333111122223333    111222233331111222233331111222233331
111122223333111122223333111122223333    111222233331111222233331111222233331
222233331111222233331111222233331111    222333311112222333311112222333311112
222233331111222233331111222233331111 -> 222333311112222333311112222333311112
222233331111222233331111222233331111    222333311112222333311112222333311112
222233331111222233331111222233331111    222333311112222333311112222333311112
333311112222333311112222333311112222    333111122223333111122223333111122223
333311112222333311112222333311112222    333111122223333111122223333111122223
333311112222333311112222333311112222    333111122223333111122223333111122223
333311112222333311112222333311112222    333111122223333111122223333111122223

Only every 4th column changes:
   2   3   1   2   3   1   2   3   1
   2   3   1   2   3   1   2   3   1
   2   3   1   2   3   1   2   3   1
   2   3   1   2   3   1   2   3   1
   3   1   2   3   1   2   3   1   2
   3   1   2   3   1   2   3   1   2
   3   1   2   3   1   2   3   1   2
   3   1   2   3   1   2   3   1   2
   1   2   3   1   2   3   1   2   3
   1   2   3   1   2   3   1   2   3
   1   2   3   1   2   3   1   2   3
   1   2   3   1   2   3   1   2   3
```

## Key Registers
- $D800-$DBFF - Color RAM - one byte per screen character (1 KB), single-buffered; must be written only while target area is off-screen.

## References
- "scrolling_overview_doublebuffering" — explains why doublebuffering doesn't solve color memory update timing
- "drawing_new_data_on_sides_block_examples" — discusses side drawing optimizations when colors are block-based

## Labels
- COLORRAM
