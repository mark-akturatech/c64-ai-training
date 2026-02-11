# VIC-II sprite MCBASE increments during cycles 15 and 16

**Summary:** Describes VIC-II behavior for MCBASE (internal sprite memory line pointer) during phase 1 of cycles 15 and 16, the role of the expansion flip-flop (Y-expansion state), and the subsequent DMA/sprite-disable check when MCBASE reaches 63.

## Cycle 15 — phase 1
In the first phase (phase 1) of raster cycle 15 the VIC tests the expansion flip-flop. If the expansion flip-flop is set, the VIC increments MCBASE by 2.

(Expansion flip-flop — Y-expansion state.)

## Cycle 16 — phase 1 and post-check
In the first phase (phase 1) of raster cycle 16 the VIC again tests the expansion flip-flop. If it is set, MCBASE is incremented by 1. Immediately after this check/increment the VIC compares MCBASE to 63; if MCBASE == 63 the VIC disables DMA for the sprite and turns off the sprite display.

## References
- "sprite_data_sequencer_and_registers" — expands on MCBASE purpose and how increments affect which sprite lines are read (Y expansion)
- "sprite_display_timing_and_rules_1_to_6" — rules 1–6 that enable DMA and begin sprite data accesses

## Labels
- MCBASE
