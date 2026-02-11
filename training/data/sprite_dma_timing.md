# VIC-II Sprite DMA Timing and CPU Impact

**Summary:** VIC-II sprite DMA steals CPU cycles via sprite pointer (p-access) and sprite data (s-access) fetches; key terms: VIC-II, sprite DMA, BA line, phi1/phi2, bad-line, raster ($D012). This describes per-sprite fetch sequence (1 p-access + 3 s-accesses), BA timing, and a PAL worst-case example with 8 sprites on a bad line.

## Sprite DMA timing and CPU effect
Each active sprite on a raster line causes VIC-II memory accesses that remove CPU bus time:

- Per sprite, per raster line:
  - 1 p-access (sprite pointer fetch) — occurs in the VIC-II phi1 half-cycle.
  - 3 s-accesses (sprite data fetches) — occur in the three half-cycles immediately after the p-access.

- BA/Bus handover:
  - The BA line is asserted low (bus available/hand-over signal) 3 cycles before the first s-access for that sprite.
  - This pre-assertion causes the CPU to lose approximately 2 additional cycles per sprite for the bus handover (overhead), before the 3 s-accesses occur.

- Effective cost per active sprite:
  - Approximately 2 cycles overhead for bus handover + the time of the 3 s-accesses (the three s-access half-cycles themselves are also effectively stolen).
  - Sprite DMA positions (timing of p- and s-accesses) vary slightly between VIC-II chip variants (different total cycles per line), so exact cycle alignment can shift.

- Combined effects and worst-case example (PAL bad line):
  - A PAL bad line by itself leaves roughly ~23 CPU cycles available (after bad-line character fetches).
  - With 8 sprites active, sprite DMA imposes an additional ~16 cycles of penalty (approximate — 2 cycles overhead per sprite × 8).
  - Remaining CPU cycles after both bad-line stealing and 8-sprite penalty: ~7 cycles (very tight for CPU work).

## Key Registers
- $D000-$D02E - VIC-II - sprite registers, raster/timing and control registers (includes raster counter $D012)

## References
- "bad_lines" — combined effect of bad-line character fetches and sprite DMA on CPU availability
- "vicii_memory_access_pattern" — how sprite p-/s-accesses fit into VIC-II phi1/phi2 access phases
