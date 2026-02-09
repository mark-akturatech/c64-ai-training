# Commodore 1540/1541 Disk Physical Layout (Appendix D)

**Summary:** Appendix D header and diagram showing the physical layout of a Commodore 1540/1541 5.25" disk: outer rim, Track 1, Track 18 (directory), Track 35, index hole, and center hub. Searchable terms: Track 1, Track 18, Track 35, index hole, 1541, disk formats.

## Physical layout
The physical disk layout shows concentric tracks from the outer rim (Track 1) inward to the center hub (Track 35), with Track 18 identified as the directory track and an index hole near the inner tracks. A visual diagram is provided in the Source Code section below. This page serves as the introduction to the disk formats section that follows.

## Source Code
```text
           [ Outer Rim ]
 ------------------------------------
              Track 1
  ----------------------------------

   --------------------------------
         Track 18 (Directory)
    ------------------------------

     ----------------------------
              Track 35    O Index Hole
      --------------------------
           [ Center Hub ]
```

## References
- "sector_format_single_sector_1541" — Expanded view of a single sector  
- "block_distribution_by_track" — How sectors/blocks are distributed by track