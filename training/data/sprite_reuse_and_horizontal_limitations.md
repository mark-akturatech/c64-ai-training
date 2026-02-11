# VIC-II sprite reuse limits (vertical reuse vs horizontal limit)

**Summary:** VIC-II (MOS 6567/6569) sprite reuse: sprites can be reused vertically by changing their Y coordinate after (or during) display completion so comparisons re-match; horizontal reuse is not possible because the sprite shift register (24 displayed pixels) empties, limiting sprites to 8 per raster line.

**Vertical reuse (multiple uses down the screen)**

If a sprite's Y coordinate is changed to a later raster line during or after the sprite's display has completed, the VIC-II's sprite-comparison logic can match again. When those comparisons match a second time, the sprite is displayed again at the new Y coordinate. At that point, the program may set a new X coordinate and a new sprite data pointer for the reused sprite. This allows displaying more than eight sprites on the overall screen by reusing the same sprite hardware on different raster lines.

**Horizontal limit (maximum 8 sprites per raster line)**

Horizontal reuse within the same raster line is not possible. The VIC-II's sprite data is shifted out through a 24-pixel shift register during display; after these 24 displayed pixels, the shift register has emptied. Even if the sprite X-comparison were to match again later on the same raster line (for example, by changing the sprite X coordinate mid-line), there is no remaining sprite data to display. Therefore, no additional sprite image can be produced on that same raster line, and the hardware limits you to a maximum of 8 sprites visible on any single raster line.

## Source Code

```text
Timing Diagram: Sprite Data Fetch and Display

Raster Line: |<--- Left Border --->|<--- Display Area --->|<--- Right Border --->|
             |                     |                      |                      |
Cycle:       | 1  2  3  4  5  6  7 | 8  9 10 11 12 13 14  | 15 16 17 18 19 20 21 |
             |_____________________|______________________|______________________|
             |                     |                      |                      |
Sprite 0:    | Fetch Pointer        | Fetch Data           | Display              |
Sprite 1:    | Fetch Pointer        | Fetch Data           | Display              |
Sprite 2:    | Fetch Pointer        | Fetch Data           | Display              |
Sprite 3:    | Fetch Pointer        | Fetch Data           | Display              |
Sprite 4:    | Fetch Pointer        | Fetch Data           | Display              |
Sprite 5:    | Fetch Pointer        | Fetch Data           | Display              |
Sprite 6:    | Fetch Pointer        | Fetch Data           | Display              |
Sprite 7:    | Fetch Pointer        | Fetch Data           | Display              |
             |_____________________|______________________|______________________|

Note: Each sprite fetches its pointer and data during specific cycles. The display occurs after data fetching.
```

## Key Registers

- **$D000–$D00F**: Sprite X and Y position registers
- **$D010**: Most significant bit of sprite X position
- **$D015**: Sprite enable register
- **$D017**: Sprite Y expansion register
- **$D01C**: Sprite multicolor mode register
- **$D01D**: Sprite X expansion register
- **$D027–$D02E**: Sprite color registers

## References

- "sprite_data_sequencer_and_registers" — expands on shift register length (24 bits) and sprite data sequencing
- "sprite_y_position_offset_and_start_timing" — expands on how Y coordinate and timing affect vertical reuse and start timing