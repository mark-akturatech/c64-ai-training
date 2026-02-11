# MOS 6569 (VIC-II) — ASCII Timing Diagram: Bad Line, No Sprites

**Summary:** ASCII timing diagram for the MOS 6569 (VIC-II) illustrating a Bad Line with no sprites active. The diagram includes cycle numbering, IRQ/BA/AEC signal traces, VIC-II access-type symbols (c, g, p, s, r, i), 6510 CPU access markers (x, X), and a projected 40-column graph with X coordinates for visualization.

**Timing Diagram Overview**

This diagram provides a detailed view of the VIC-II's behavior during a Bad Line without active sprites. It features:

- **Cycle Numbering:** Displays the sequence of cycles across the raster line, grouped by phases.
- **Signal Traces:** Illustrates the states of IRQ, BA, and AEC signals.
- **VIC-II Access Types:** Marks internal access types using symbols:
  - **c:** Character pointer fetch
  - **g:** Graphics data fetch
  - **p:** Sprite pointer fetch
  - **s:** Sprite data fetch
  - **r:** Refresh cycle
  - **i:** Idle access
- **CPU Access Markers:** Indicates 6510 CPU accesses:
  - **x:** CPU read access
  - **X:** CPU write access
- **Graphical Representation:** A 40-column projected graph with X coordinates to aid in visualization.

The diagram serves as a compact visualization; for comprehensive symbol definitions and expanded timing context, refer to the referenced documents listed below.

## Source Code

```text
6569, Bad Line, no sprites:

Cycl-# 6                   1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 3 3 3 3 3 3 3 3 3 3 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 6 6 6 6
       3 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 1
        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
       __
   IRQ   ________________________________________________________________________________________________________________________________
       ________________________                                                                                      ____________________
    BA                         ______________________________________________________________________________________
        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
   AEC _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _________________________________________________________________________________ _ _ _ _ _ _ _ _ _ _ _

   VIC i 3 i 4 i 5 i 6 i 7 i r r r r rcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcgcg i i 0 i 1 i 2 i 3
  6510  x x x x x x x x x x x x X X X                                                                                 x x x x x x x x x x

Graph.                      |===========01020304050607080910111213141516171819202122232425262728293031323334353637383940=========

X coo. \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
       1111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111
       89999aaaabbbbccccddddeeeeff0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff000011112222333344445555666677778888999
       c048c048c048c048c048c048c04048c048c048c048c048c048c048c048c048c048c048c048c048c048c048c048c048c048c048c048c048c048c048c048c048c048
```

## References

- "raster_line_timing_intro" — Definition of raster line start and the line-0 exception used as context for diagrams.
- "raster_line_signals_and_access_types_explained" — Legend and meaning of access-type symbols (c, g, p, s, r, i) and CPU markers (x, X).
- "timing_diagram_6569_nobadline_no_sprites" — Comparison: 6569 behavior when there is no Bad Line.