# MACHINE - Placing ML after end-of-BASIC and moving SOV upward

**Summary:** Place machine language (ML) immediately after the end-of-BASIC marker (the three zeros) and move SOV (start-of-variables) upward so BASIC variables do not overwrite the ML. Load BASIC first, then load ML so SOV lands after ML; SAVE will write BASIC+ML as a single unit that LOAD restores with correct SOV and SYS addresses.

## How it works
- Layout: ML is stored in memory immediately following the end-of-BASIC marker (three zeros). SOV (start-of-variables) is moved up to sit after the ML so variable space does not overlap the ML.
- Load order: Load the BASIC program first — this places SOV immediately after BASIC. Then load the ML program; loading the ML moves SOV to just after the ML. If load order is reversed, BASIC variables can overwrite the ML.
- Saving the unit: If BASIC and ML occupy consecutive memory from start-of-BASIC through just before start-of-variables, a single SAVE of that range writes both BASIC and ML together. A subsequent LOAD restores both and places SOV to the same position, preserving the unit as one load/saveable program.
- Caveat: After combining ("marrying") BASIC and ML into this single unit, do not modify the BASIC program (add or remove lines). Any change to BASIC shifts the SOV and thus relocates the ML; that will invalidate absolute SYS addresses and may break the ML code.

## References
- "basic_variable_table_and_types" — expands on SOV (start-of-variables) must be adjusted so variables don't overwrite ML placed after end-of-BASIC

## Labels
- SOV
