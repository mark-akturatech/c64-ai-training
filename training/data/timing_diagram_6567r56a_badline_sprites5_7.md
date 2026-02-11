# MOS 6567R56A — Abbreviated VIC-II Bad Line Timing Diagram (Sprites 5–7 Active)

**Summary:** This document provides an abbreviated ASCII timing diagram for the MOS 6567/6569 (VIC-II) 6567R56A variant, illustrating a Bad Line with sprites 5–7 active on the current raster line and sprite 0 active on the subsequent line. The diagram includes cycle numbers, IRQ/BA/AEC traces, VIC access-type markers (such as sprite data 'sss' and sprite pointer/data 'p'/'s' markers), CPU access markers, graphical representation, and X coordinate projection.

**Diagram Description**

This document presents an abbreviated line-timing ASCII diagram for the 6567R56A, detailing:

- **Cycle Numbering:** Displays microcycles across the 40-cycle raster line.
- **Control/Handshake Traces:** Includes IRQ (Interrupt Request), BA (Bus Available), and AEC (Address Enable Control) signals.
- **VIC Activity Trace:** Shows access-type markers, including sprite pointer/data and other VIC fetches. The diagram uses 'sss' for sprite data accesses and 'p'/'s' markers to indicate sprite pointer and sprite data fetches, respectively.
- **6510 (CPU) Access/Activity:** Depicts CPU activities aligned with the cycle grid.
- **Graphical Representation:** Provides a compact "Graph." row and an X coordinate projection consisting of three rows (binary/hex-like column markers and X coordinate pattern).
- **Context:** Represents a Bad Line scenario where the VIC performs additional memory accesses during CPU-visible cycles.

**Access-Type Legend:**

- **c:** Access to video matrix and Color RAM (c-access).
- **g:** Access to character generator or bitmap (g-access).
- **0–7:** Reading the sprite data pointer for sprites 0–7 (p-access).
- **s:** Reading the sprite data (s-access).
- **r:** DRAM refresh.
- **i:** Idle access.
- **x:** CPU read or write access.
- **X:** CPU may perform write accesses; stops on first read (BA is low and so is RDY).

**Graph. Row Explanation:**

The "Graph." row provides a projection of the 40-column display window and the border to the X coordinates, aiding in sprite positioning. This representation does not correspond directly to the VIC video output signal. Additionally, the border unit generates the border approximately 8 pixels later than indicated in the "Graph." row.

## Source Code

```text
6567R56A, Bad Line, sprites 5–7 active in this line, sprite 0 in the next
line (abbreviated):

Cycl-# 6                   1 1 1 1 1 1 1 1 1 1 |5 5 5 5 5 5 5 6 6 6 6 6
       4 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 |3 4 5 6 7 8 9 0 1 2 3 4 1
        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _| _ _ _ _ _ _ _ _ _ _ _ _ _
    ø0 _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ |_ _ _ _ _ _ _ _ _ _ _ _ _ 
       __                                      |
   IRQ   ______________________________________|__________________________
       ____                  __                |    __          __________
    BA     __________________  ________________|____  __________
        _ _ _ _ _             _ _ _ _          |     _ _ _ _     _ _ _ _ _
   AEC _ _ _ _ _ _____________ _ _ _ __________|_____ _ _ _ _____ _ _ _ _ 
                                               |
   VIC i 3 i 4 i 5sss6sss7sssr r r r rcgcgcgcgc|gcgcg i i i 0sss1 i 2 i 3 
  6510  x x X X X             x X X X          |     x X X X     x x x x x
                                               |
Graph.                      |===========0102030|7383940===========
                                               |
X coo. \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|\\\\\\\\\\\\\\\\\\\\\\\\\\
       1111111111111111111111111110000000000000|11111111111111111111111111
       999aaaabbbbccccddddeeeeffff0000111122223|3444455556666777788889999a
       48c048c048c048c048c048c048c048c048c048c0|c048c048c048c048c048c048c0
```

## Key Registers

- **$D000–$D02E:** VIC-II registers and internal access timing (VIC-II base register range; diagram concerns VIC memory accesses during a Bad Line).

## References

- "raster_line_timing_intro" — Context about line start and line 0 timing.
- "raster_line_signals_and_access_types_explained" — Explanation of symbols such as 'sss' for sprite accesses and the access-type legend.
- "timing_diagram_6567r8_nobadline_sprites2_7" — Another VIC variant (6567R8) diagram with multiple sprites active for comparison.