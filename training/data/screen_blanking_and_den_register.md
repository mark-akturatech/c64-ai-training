# VIC-II Screen Blanking (DEN)

**Summary:** Describes VIC-II display blanking controlled by the DEN bit in register 17 ($11 => $D011) and the exterior/border color from register 32 ($20 => $D020). Explains effects on memory access phases (transparent Phase 1 only) and MOB fetch behavior.

## Screen Blanking
Setting the DEN bit in VIC-II register 17 ($11; absolute $D011) to 0 blanks the entire display. While blanked:
- The screen is filled with the exterior/border color held in register 32 ($20; absolute $D020).
- Only transparent memory accesses (Phase 1) are required by the VIC-II, which permits full CPU utilization of the system bus during those cycles.
- MOB (sprite/MOB) data will still be fetched unless the MOBs are explicitly disabled via their enable bits; blanking by itself does not stop MOB fetches.
For normal video output the DEN bit must be set to 1.

## Key Registers
- $D011 - VIC-II - DEN (display blanking) control (register 17 / $11)
- $D020 - VIC-II - exterior / border color (register 32 / $20)

## References
- "mob_memory_access_and_pointers" — expands on blanking effects on memory access and MOB fetches
- "mob_enable_and_positioning" — expands on disabling MOBs to avoid MOB fetches while blanked

## Labels
- $D011
- $D020
