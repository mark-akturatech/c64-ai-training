# Moving BASIC memory pointers (TOM, SOV) — VIC-20 / C64

**Summary:** Notes on moving BASIC memory pointers (TOM = top-of-memory, SOV = start-of-variables) and placing machine-language code relative to BASIC; includes VIC-20-specific caution about the video chip's view of RAM ($0000-$1FFF). After changing TOM or SOV return to BASIC and use CLR (or NEW) to realign variable pointers; restore machine configuration when loading programs later.

## Pointer-moving techniques and effects
- Common pointers modified to create space for machine-language code or video buffers:
  - TOM (top-of-memory) — move down to reserve high memory for code/data.
  - SOV / start-of-variables — move up or down to relocate BASIC variable area.
  - Start-of-BASIC pointer — may be moved (especially on VIC-20) to free low memory for video effects.

- Typical placement strategies (as described):
  1. Move TOM down and place ML code at the top of available RAM beneath TOM.
  2. Move SOV (start-of-variables) and place the ML program in the free area so it does not collide with BASIC variables.
  3. Move up the start-of-variables pointer and place the program after the end of BASIC and before the new start-of-variables; programs placed here will "join company" with the BASIC program and will save/load together with BASIC.

- SAVE/LOAD interaction:
  - Programs placed between end-of-BASIC and start-of-variables are saved/loaded with BASIC (they become part of the same contiguous BASIC image).
  - If you rely on a relocated TOM/SOV at runtime, you must ensure that the machine configuration (pointers, memory mapping) is restored appropriately when the program is loaded elsewhere — loading may not restore your custom pointer layout.

- Important housekeeping:
  - After changing TOM or SOV from machine code, return to BASIC and issue CLR (or NEW) so all internal variable pointers align with the moved pointers. This prevents pointer mismatches between BASIC's internal state and the new pointer values.
  - Be careful when restoring pointers; failure to restore the original configuration before returning control to BASIC (or before saving/loading) can corrupt variables or cause the system to behave unpredictably.

## VIC-20 specifics
- The VIC-20 video chip sees RAM in $0000-$1FFF (the VIC's memory window). On the VIC-20 it is common to move the start-of-BASIC into low memory to free higher RAM for user code or to create special video effects.
- When relocating start-of-BASIC or other low memory pointers on the VIC-20:
  - Verify that the VIC's memory mapping still points to the intended RAM banks.
  - Ensure any low-memory areas used for video or code do not conflict with BASIC or system vectors unless you explicitly control restoration.
  - Careful manipulation is required because the VIC's view (and cartridge/bank selection) can make low-memory relocation fragile.

## Source Code
```text
                                                NEW  OLD
                 SOB       SOV  SOA  EOA   BOS  TOM  TOM
                  |         |    |    |     |    |    |
  -+--------+----+---------+----+----+-- --+----+====+--
   |C.B.    |    |         |    |    | ... |    |====|
  -+--------+----+---------+----+----+-- --+----+====-- 

  Figure 6.3


                           OLD  NEW
                 SOB       SOV  SOV  SOA  EOA   BOS  TOM
                  |         |    |    |    |     |    |
  -+--------+----+---------+====+----+----+-- --+----+--
   |C.B.    |    |      000|====|    |    | ... |    |
  -+--------+----+---------+====+----+----+-- --+----+--

  Figure 6.3


Third, move up the start-of-variables pointer, and place the program after
the end of BASIC and before the new start-of-variables.  Your space here is
unlimited  Programs placed here will tend to "join company" with the BASIC
program; the two will save and load together.

After moving a pointer--as was done in the last two methods--it's a good idea
to return to BASIC and command CLR, so that all other variable pointers will
align correctly with the ones that have moved.

These three areas will be discussed more in a few moments.  First there are
one or two extra locations available to VIC-20 and Commodore 64.
```

## References
- "vic_and_c64_memory_extras" — expands on VIC/C64-specific RAM areas and use of top-of-memory