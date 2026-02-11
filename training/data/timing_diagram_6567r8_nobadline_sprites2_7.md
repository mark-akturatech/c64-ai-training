# 6567R8 Timing Diagram (Abbreviated) — No Bad Line, Sprites 2–7 Active

**Summary:** This document provides an abbreviated ASCII timing diagram for the MOS 6567R8 (VIC‑II) variant, illustrating cycle numbering, IRQ, BA, and AEC signals, VIC access types (including sprite access markers such as "ss3", "sss4", etc.), CPU access markers, and the graphical and X coordinate projections used for sprite positioning. The diagram depicts sprites 2–7 active on the current raster line and sprites 0–4 active on the subsequent line.

**Diagram Overview**

This timing diagram for the 6567R8 (VIC‑II) variant on a raster line without a Bad Line includes:

- **Cycle Numbering:** Displays the cycle numbers across the video line.
- **Signal Waveforms:** Shows IRQ, BA, and AEC signals.
- **VIC Access Types:** Utilizes compact markers for multiple sprite fetches (e.g., "ss3sss4sss5...").
- **CPU Access Markers:** Labeled as "6510", indicating CPU access points ("x").
- **Graphical and X Coordinate Projections:** The "Graph." row and "X coo." row provide projections and repetition patterns used to determine sprite horizontal positioning.
- **Sprite Activity:** Indicates which sprites are fetched on this line (sprites 2–7) and suggests that sprites 0–4 are active on the following line.

This diagram serves as a concise reference for comparing VIC‑II timing and sprite access patterns. It does not include a formal legend for the access-type abbreviations or a full-cycle expanded timing table.

## Source Code

```text
6567R8, no Bad Line, sprites 2-7 active in this line, sprites 0-4 in the
next line (abbreviated):

Cycl-# 6                   1 1 1 1 1 1 1 1 1 1 |5 5 5 5 5 5 5 6 6 6 6 6 6
       5 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 |3 4 5 6 7 8 9 0 1 2 3 4 5 1
        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _| _ _ _ _ _ _ _ _ _ _ _ _ _
    ø0 _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ |_ _ _ _ _ _ _ _ _ _ _ _ _
       __                                      |
   IRQ   ______________________________________|____________________________
                             __________________|________
    BA ______________________                  |        ____________________
                              _ _ _ _ _ _ _ _ _| _ _ _ _ _ _ _
   AEC _______________________ _ _ _ _ _ _ _ _ _ |_ _ _ _ _ _ _ ______________
                                               |
   VIC ss3sss4sss5sss6sss7sssr r r r r g g g g |g g g i i i i 0sss1sss2sss3s
  6510                        x x x x x x x x x| x x x x X X X
                                               |
Graph.                      |===========0102030|7383940============
                                               |
X coo. \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|\\\\\\\\\\\\\\\\\\\\\\\\\\\\
       1111111111111111111111111110000000000000|1111111111111111111111111111
       999aaaabbbbccccddddeeeeffff0000111122223|344445555666677778888889999a
       48c048c048c048c048c048c048c048c048c048c0|c048c048c048c048c04cccc04c80
```

## Source Code

```text
Cycl-# 6                   1 1 1 1 1 1 1 1 1 1 |5 5 5 5 5 5 5 6 6 6 6 6 6
       5 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 |3 4 5 6 7 8 9 0 1 2 3 4 5 1
        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _| _ _ _ _ _ _ _ _ _ _ _ _ _
    ø0 _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ |_ _ _ _ _ _ _ _ _ _ _ _ _
       __                                      |
   IRQ   ______________________________________|____________________________
                             __________________|________
    BA ______________________                  |        ____________________
                              _ _ _ _ _ _ _ _ _| _ _ _ _ _ _ _
   AEC _______________________ _ _ _ _ _ _ _ _ _ |_ _ _ _ _ _ _ ______________
                                               |
   VIC ss3sss4sss5sss6sss7sssr r r r r g g g g |g g g i i i i 0sss1sss2sss3s
  6510                        x x x x x x x x x| x x x x X X X
                                               |
Graph.                      |===========0102030|7383940============
                                               |
X coo. \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|\\\\\\\\\\\\\\\\\\\\\\\\\\\\
       1111111111111111111111111110000000000000|1111111111111111111111111111
       999aaaabbbbccccddddeeeeffff0000111122223|344445555666677778888889999a
       48c048c048c048c048c048c048c048c048c048c0|c048c048c048c048c04cccc04c80
```

## References

- "timing_diagram_6567r56a_badline_sprites5_7" — expands on comparing 6567R8 timing and sprite access ordering with the 6567R56A example.
- "raster_line_signals_and_access_types_explained" — expands on the legend and details of the access-type symbols and CPU markers used in the diagrams.
