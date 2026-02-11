# VIC-II DRAM refresh (MOS 6567/6569)

**Summary:** VIC-II performs five DRAM refresh read accesses per raster line using an 8-bit refresh counter (REF). REF is reset to $FF on raster line 0 and decremented after each refresh access; refresh addresses are formed as $3F00 | REF (e.g. $3FFF..$3FFB on line 0).

## DRAM refresh
- The VIC-II issues five read accesses every raster line dedicated to DRAM refresh.
- An 8-bit refresh counter (REF) provides the low 8 address bits for refresh; high address bits are fixed to ones for these accesses.
- REF is initialized (reset) to $FF in raster line 0 and is decremented by 1 after each refresh access (so successive refresh accesses use REF = $FF, $FE, $FD, ...).
- As a result the refresh addresses are $3F00 + REF. Example sequences:
  - Raster line 0 refresh accesses: $3FFF, $3FFE, $3FFD, $3FFC, $3FFB (REF = $FF..$FB).
  - Raster line 1 refresh accesses: $3FFA, $3FF9, $3FF8, $3FF7, $3FF6 (continuing REF decrement).
- The REF bits map directly into the low-address lines presented to DRAM; the VIC fixes the upper address bits (13..8) to ones during refresh cycles.

## Source Code
```text
Refresh address bit map (bits 13..0):

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |  1 |  1 |  1 |  1 |  1 |  1 |REF7|REF6|REF5|REF4|REF3|REF2|REF1|REF0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

Example refresh address sequences (REF decremented after each refresh access):

 Raster line 0: REF = $FF..$FB -> addresses: $3FFF, $3FFE, $3FFD, $3FFC, $3FFB
 Raster line 1: REF = $FA..$F6 -> addresses: $3FFA, $3FF9, $3FF8, $3FF7, $3FF6
```

## References
- "memory_access_timing" — per-line access schedule showing where DRAM refresh accesses occur in the raster-line access sequence
