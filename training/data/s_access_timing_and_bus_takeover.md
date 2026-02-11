# MOS 6567/6569 (VIC-II) — s-access (sprite data) timing and bus takeover

**Summary:** Describes VIC-II sprite data fetch timing: s-accesses (three half-cycle sprite reads) occur immediately after the sprite's p-access within the same raster line; VIC-II uses BA/AEC bus takeover (BA asserted low three cycles before access) and performs s-accesses in statically assigned cycles for every raster line the sprite is visible.

**Description**
- **s-access definition:** When the VIC-II needs sprite graphics data for a sprite, it performs three s-access half-cycles (three half-cycle reads of sprite data) that follow directly after that sprite's p-access within the same raster line.
- **Relationship to p-access:** Each sprite's s-accesses are scheduled immediately after that sprite's p-access in the raster line. A p-access (pointer fetch) precedes the s-access for the same sprite.
- **Bus takeover (BA / AEC):** The VIC-II takes control of the bus using signals BA and AEC (the same handshake used for Bad Lines). The VIC requests the bus with BA asserted low; BA goes low three cycles before the intended s-access. The VIC performs these memory accesses in the second clock phase using the AEC/BA handshake.
- **Frequency and assignment:** s-accesses are performed on every raster line in which the sprite is visible. The sprite s-access cycles are statically assigned per sprite (each sprite has its fixed cycle(s) within the raster line).
- **Note about sprites 0–2:** For sprites 0–2, the s-accesses occur in the raster line before the sprite is displayed. This means that the data fetches for these sprites are performed one line earlier than for sprites 3–7. ([janklingel.de](https://janklingel.de/wordpress/wp-content/uploads/2020/08/MOS-6567_6569-Video-Interface-Controller.pdf?utm_source=openai))

## Source Code
```text
Timing diagram illustrating the relation of p-access and the three subsequent s-access half-cycles:

Cycle # | VIC Access
--------|-----------
1       | p-access (Sprite 0)
2       | s-access (Sprite 0) - 1st half-cycle
3       | s-access (Sprite 0) - 2nd half-cycle
4       | s-access (Sprite 0) - 3rd half-cycle
5       | p-access (Sprite 1)
6       | s-access (Sprite 1) - 1st half-cycle
7       | s-access (Sprite 1) - 2nd half-cycle
8       | s-access (Sprite 1) - 3rd half-cycle
...     | ...
```

```text
Explicit mapping of statically assigned cycles for each sprite within a raster line:

Sprite # | p-access Cycle | s-access Cycles
---------|----------------|----------------
0        | 1              | 2, 3, 4
1        | 5              | 6, 7, 8
2        | 9              | 10, 11, 12
3        | 13             | 14, 15, 16
4        | 17             | 18, 19, 20
5        | 21             | 22, 23, 24
6        | 25             | 26, 27, 28
7        | 29             | 30, 31, 32
```

```text
Clarification of the phrase "for the sprites 0-2, it is always in the line before":

For sprites 0–2, the p-access and subsequent s-accesses occur in the raster line preceding the line where the sprite is displayed. This means that the data fetches for these sprites are performed one line earlier than for sprites 3–7.
```

## Key Registers
- **$D015 (Sprite Enable Register):** Controls the visibility of each sprite. Each bit corresponds to a sprite; setting a bit enables the corresponding sprite.
- **$D017 (Sprite Y-Expansion Register):** Controls the vertical expansion of each sprite. Each bit corresponds to a sprite; setting a bit doubles the sprite's height.
- **$D01B (Sprite Priority Register):** Determines the priority of each sprite relative to the background. Each bit corresponds to a sprite; setting a bit gives the sprite higher priority over the background.
- **$D01C (Sprite Multicolor Mode Register):** Controls the multicolor mode of each sprite. Each bit corresponds to a sprite; setting a bit enables multicolor mode for the corresponding sprite.
- **$D01D (Sprite X-Expansion Register):** Controls the horizontal expansion of each sprite. Each bit corresponds to a sprite; setting a bit doubles the sprite's width.
- **$D027–$D02E (Sprite Color Registers):** Define the color of each sprite. Each register corresponds to a sprite and holds the color value.

## References
- "sprite_memory_layout_and_pointer_mechanism" — expands on p-access pointers that precede s-accesses
- "sprite_display_timing_and_rules_1_to_6" — expands on which cycles/situations trigger DMA and s-accesses

## Labels
- $D015
- $D017
- $D01B
- $D01C
- $D01D
- $D027
- $D028
- $D029
- $D02A
- $D02B
- $D02C
- $D02D
- $D02E
