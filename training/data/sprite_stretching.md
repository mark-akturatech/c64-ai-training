# VIC-II sprite stretching via MxYE flip‑flop and MC/MCBASE manipulation

**Summary:** Explains how toggling per-sprite Y-expansion bits (MxYE) in $D017 at specific VIC-II cycles (example: around cycles 15–16 and 55) manipulates the expansion flip‑flop, MC and MCBASE behavior and sprite DMA timing so individual sprite lines can be repeated (tripled or more), misaligned, or cause sprite duplication. Searchable terms: $D017, VIC-II, MxYE, MC, MCBASE, sprite DMA, BA, p-access, s-access, cycles 15/16, cycle 55.

## Sprite stretching (mechanism)

This effect exploits the VIC-II expansion flip‑flop, the MC/MCBASE counters, and the precise timing of sprite memory accesses (p-access and subsequent s-accesses). The description below follows the timing terminology used by the VIC-II: cycle numbers within a raster line and the two clock phases per cycle. p-access = pointer/pointer-table related memory access; s-access = sprite bitmap byte accesses.

1. Preconditions (setup before the shown timeline)
   - Sprite 0 is enabled and its Y coordinate matches the raster: the VIC will initiate sprite DMA for the next raster line where the sprite is visible.
   - M0YE (the sprite Y‑expansion control bit for sprite 0 in $D017) is set at the time the VIC samples expansion state in cycle 55 of the previous line (see step 2).

2. What happens in cycle 55 of the raster line before the sprite is displayed
   - Because M0YE is set, the VIC turns on sprite DMA for sprite 0, clears MCBASE, and clears the expansion flip‑flop.
   - BA is taken low so the VIC can perform sprite memory accesses in the second clock phases of cycles 58 and 59.
   - In cycle 58 (second phase) MC is loaded from MCBASE (which has just been cleared to 0), so MC becomes 0; a p-access for the sprite is performed.
   - After the p-access, three s‑accesses are performed (the three sprite byte fetches per displayed raster line), and the VIC increments MC after each s‑access. After these three s‑accesses MC equals 3.

3. Forcing line repetition (triple line)
   - On the following raster line, at cycle 16 the expansion flip‑flop is still in the reset state and MCBASE remains 0.
   - If the program clears M0YE (thereby toggling the flip‑flop) and then immediately sets M0YE again within the sampling window (i.e., those writes happen around cycle 16 so the flip‑flop is inverted for the next sampling), the net sampled state in cycle 55 of the next raster becomes identical to the previous line: the expansion flip‑flop appears reset while M0YE is set.
   - Because MC is still effectively at 0 for the VIC’s next set of accesses, the VIC performs the same p-access and the same three s‑accesses again — the first sprite bitmap line is fetched and displayed a second time.
   - Repeating this flip‑flop inversion across the same timing windows causes the first sprite line to be fetched/used multiple times; with the described timing the first line is tripled (fetched three times total).

4. Producing misalignment and sprite duplication (MCBASE increment trick)
   - If the same write sequence is performed but the clear of M0YE is executed later — specifically in the second phase of cycle 15 (instead of at/after cycle 16) — the effect on MCBASE differs: MCBASE will be incremented by 1 before MC is reloaded.
   - The VIC then loads MC from MCBASE with MC = 1 for the subsequent p-access and s-accesses, so the VIC reads sprite data one byte ahead (MC=1..3) rather than MC=0..2. This produces a vertical "misalignment" of the sprite bitmap: each displayed raster line is sourced from offset +1 in the sprite bitmap.
   - Because the MC progression is offset, the normal end condition (MC = 63 sampled in cycle 16 to turn off sprite DMA) is delayed. The DMA condition for turning off the sprite won't be met at the expected time, so the sprite can continue to be displayed for a second sequence (effectively the sprite appears twice in succession). Only when MC finally reaches 63 will the VIC turn off the sprite DMA.

5. Summary of controls and sensitive timings
   - The effect depends on writes to the MxYE bit(s) of $D017 at very specific VIC cycles relative to the sprite DMA sequence (notably the windows around cycles 15–16 and the sampling at cycle 55).
   - The key internal state changes are: expansion flip‑flop inversion, MCBASE increment/clear behavior, MC reload from MCBASE at the p-access, and MC increments after each s‑access.
   - Small changes in write timing (cycle 15 second phase vs cycle 16) change whether MCBASE is incremented or cleared, which in turn changes whether lines are repeated (same MC) or misaligned (MC offset), and whether the sprite DMA termination condition (MC=63) is reached when expected.

## Key Registers
- $D017 - VIC-II - MxYE per-sprite Y‑expansion bits (controls sprite Y expansion and is sampled to affect the expansion flip‑flop and sprite DMA behavior)

## References
- "sprite_memory_access_and_display" — expands on MC/MCBASE and expansion flip‑flop rules that enable sprite stretching techniques described above

## Labels
- D017
- MXYE
