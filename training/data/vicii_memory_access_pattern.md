# VIC-II / CPU Two-Phase Bus Timing (PAL bad-line example)

**Summary:** VIC-II and 6502 share the C64 DRAM bus via two-phase clocking (phi1 = VIC-II accesses, phi2 = CPU accesses). Describes VIC-II access types (g-access, sprite p/s-access, DRAM refresh, idle), AEC/BA interaction, and a 63-cycle PAL bad-line access sequence (cycles 1–63).

## VIC-II memory access pattern
The VIC-II uses the phi1 phase to perform all memory accesses required for graphics and DRAM maintenance; the CPU normally uses phi2. VIC-II access types during phi1:
- g-access: character generator / bitmap graphics data fetches
- sprite p-access / s-access: sprite pointers and sprite data fetches
- DRAM refresh cycles: five refresh cycles per scanline
- idle accesses: accesses that supply no useful data but keep timing consistent

Bus arbitration signals and effects:
- BA (Bus Available): when pulled low by VIC-II it signals the CPU must relinquish the bus; the CPU will finish the current instruction before stopping.
- AEC (Address Enable Control): VIC-II can hold AEC low to claim both phi1 and phi2 phases (effectively blocking CPU memory access) during bad lines and sprite DMA.

Behavioral summary:
- Normally: phi1 — VIC-II; phi2 — CPU.
- On bad lines or during sprite DMA: VIC-II may claim phi2 by holding AEC low, preventing CPU memory accesses for the period required by the VIC-II fetches.

## Typical PAL bad-line access sequence (63 cycles)
A representative timing breakdown for a PAL bad line (63 cycles wide):

- Cycles 1–10
  - VIC-II: phi1 idle/DRAM refresh accesses
  - CPU: phi2 active (normal CPU memory access)
- Cycles 11–14
  - BA goes low (VIC-II requests bus)
  - CPU finishes the current instruction during its final phi2 windows
- Cycles 15–54 (40 cycles)
  - VIC-II claims both phases (holds AEC low)
  - c-access: character pointer (name table) fetches
  - g-access: character generator / bitmap data fetches
- Cycles 55–63
  - Sprite pointer/data fetches (p-/s-accesses) occur, followed by VIC-II idle accesses until line end

Notes:
- The 40-cycle block (cycles 15–54) is the period when the VIC-II uses both phases to perform the c-access/g-access sequence required by a bad line.
- DRAM refresh remains interleaved (5 refresh cycles per line) as part of VIC-II’s phi1 activity.

## References
- "bad_lines" — expands on bad-line detection conditions and overall effect on bus access
- "sprite_dma_timing" — expands on sprite DMA p-/s-access placement and BA timing
