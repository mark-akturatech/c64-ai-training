# MOB memory layout and MOB pointer placement (63-byte MOB blocks)

**Summary:** Describes the MOB (Movable Object Block) memory layout: each MOB occupies 63 consecutive bytes, selected by an 8-bit MOB pointer stored at video matrix locations VM base + $3F8..VM base + $3FF (MOB 0–7). The 14-bit fetch address is formed from MP7–MP0 (pointer bits) and MC5–MC0 (internal MOB byte counter bits); pointers are re-read at the end of each raster line and, when a MOB’s Y matches the raster, 63 bytes are fetched (three bytes per raster line).

## MOB memory access
- Each MOB (Movable Object Block) uses 63 consecutive bytes of memory.
- MOB pointers are stored at the end of the video matrix. In normal display modes the video matrix uses 1000 bytes, leaving the video matrix addresses VM base + $3F8 through VM base + $3FF available for MOB pointers 0–7 respectively.
- The effective 14-bit address used to fetch MOB data is formed by concatenating the 8-bit MOB pointer from the video matrix (MP7..MP0) as the high bits and the 6-bit internal MOB byte counter (MC5..MC0) as the low bits:
  - A13..A06 = MP7..MP0 (MOB pointer bits from video matrix)
  - A05..A00 = MC5..MC0 (internally generated MOB counter bits)
- MOB pointers are read from the video matrix at the end of every raster line.
- When a MOB’s Y position register equals the current raster line, the VIC (hardware) begins fetching the MOB’s data. Internal counters step through the 63 bytes of the MOB block; three bytes are fetched (and displayed) on each raster line, so a full MOB block spans 21 raster lines (63 / 3 = 21).
- Terminology: MPx = MOB pointer bits read from the video matrix; MCx = internal MOB counter bits used to index the 63-byte block.

## Source Code
```text
MOB address bit mapping (14-bit address A13..A00):

 A13| A12| A11| A10| A09| A08| A07| A06| A05| A04| A03| A02| A01| A00
 ----+----+----+----+----+----+----+----+----+----+----+----+----+----
  MP7| MP6| MP5| MP4| MP3| MP2| MP1| MP0| MC5| MC4| MC3| MC2| MC1| MC0

Where:
- MP7..MP0 = 8-bit MOB pointer read from video matrix (VM base + $3F8 .. VM base + $3FF for MOB 0..7)
- MC5..MC0 = 6-bit internal MOB byte counter (steps through MOB block)

Notes:
- MOB block size = 63 bytes (consecutive)
- Fetch/display rate = 3 bytes per raster line -> block covers 21 raster lines
- MOB pointers are re-read each raster line (at end of line)
```

## References
- "movable_object_block_overview_and_layout" — expands on the 63-byte MOB block layout and how it maps to on-screen pixels
- "mob_enable_and_positioning" — expands on Y-position matching and start of MOB data fetches on the raster

## Labels
- MP
- MC
