# VIC-II (MOS 6569) Raster Line Timing — No Bad Line, No Sprites (Abbreviated)

**Summary:** Abbreviated ASCII timing diagram for the MOS 6569 (VIC-II) showing a single raster line with no Bad Line and no sprites; includes cycle numbering, IRQ/BA/AEC signals, VIC access-type phases (including g-access), 6510 CPU access markers, a simple graphical projection ("Graph."), and X column coordinates.

**Description**

This chunk presents an abbreviated raster-line timing diagram for the MOS 6569 (VIC-II), illustrating signal phases and access types when no Bad Line and no sprites are present. Rows represent (top→bottom):

- **Cycl-#**: Cycle numbering across the raster line.
- **IRQ**: Interrupt request signal.
- **BA**: Bus Available signal.
- **AEC**: Address Enable Control signal for CPU bus contention.
- **VIC**: VIC internal access-type markers, including g-access phases and sequential i/r/g markers.
- **6510**: 6510 CPU bus-use markers.
- **Graph.**: A compact visual projection of visible column regions.
- **X coo.**: X coordinate columns used for column positioning.

Key points:

- The diagram is specific to the 6569 (VIC-II) and is intentionally abbreviated.
- It shows cycle numbering across the raster line and marks where VIC internal fetch phases (i, r, g) occur.
- IRQ, BA, and AEC timing traces are shown relative to the VIC phases and CPU/bus markers.
- The "Graph." row provides a compact visual projection of visible column regions; the "X coo." rows show repeating column indices used for mapping character columns.
- The diagram is meant to be compared with alternative diagrams (Bad Line, sprite-active cases) referenced in the References.

## Source Code

```text
6569, no Bad Line, no sprites (abbreviated):

Cycl-# 6                   1 1 1 1 1 1 1 1 1 1 |5 5 5 5 5 5 5 6 6 6 6
       3 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 |3 4 5 6 7 8 9 0 1 2 3 1
        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _| _ _ _ _ _ _ _ _ _ _ _ _
    ø0 _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|_ _ _ _ _ _ _ _ _ _ _ _
       __                                      |
   IRQ   ______________________________________|________________________
       ________________________________________|________________________
    BA                                         |
        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|_ _ _ _ _ _ _ _ _ _ _ _
   AEC _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|_ _ _ _ _ _ _ _ _ _ _ _
                                               |
   VIC i 3 i 4 i 5 i 6 i 7 i r r r r r g g g g |g g g i i 0 i 1 i 2 i 3
  6510  x x x x x x x x x x x x x x x x x x x x|x x x x x x x x x x x x
                                               |
Graph.                      |===========0102030|7383940=========
                                               |
X coo. \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|\\\\\\\\\\\\\\\\\\\\\\\\
       1111111111111111111111111110000000000000|111111111111111111111111
       89999aaaabbbbccccddddeeeeff0000111122223|344445555666677778888999
       c048c048c048c048c048c048c04048c048c048c0|c048c048c048c048c048c048
```

## Key Registers

- **$D011**: Control Register 1
  - Bit 3: DEN (Display Enable) — Enables or disables the display. When DEN is set, the display is enabled; when cleared, the display is disabled, showing only the border color. ([oxyron.de](https://www.oxyron.de/html/registers_vic2.html?utm_source=openai))
- **$D012**: Raster Counter
  - Holds the current raster line number. ([oxyron.de](https://www.oxyron.de/html/registers_vic2.html?utm_source=openai))
- **$D016**: Control Register 2
  - Bit 3: CSEL (Column Select) — Selects 38 or 40 columns. ([oxyron.de](https://www.oxyron.de/html/registers_vic2.html?utm_source=openai))

## References

- "timing_diagram_6569_badline_no_sprites" — contrast with Bad Line diagram for the 6569
- "raster_line_signals_and_access_types_explained" — legend for access types and CPU signal conventions
- "timing_diagram_6567r56a_badline_sprites5_7" — timing when sprites are active on other VIC variants

## Labels
- $D011
- $D012
- $D016
