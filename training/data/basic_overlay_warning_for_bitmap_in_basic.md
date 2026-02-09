# WARNING: BASIC variables can overlay high‑resolution screen memory

**Summary:** BASIC variables (BASIC workspace/top) can grow into the high‑resolution (bitmap) screen memory and corrupt the displayed bitmap; to avoid this move BASIC's top down or relocate the bitmap area. This overlap occurs only when running programs in Commodore BASIC — it does not happen for machine‑language programs.

## Details
BASIC keeps its variable and program workspace in RAM and that workspace can expand so it overlays any static data placed nearby, including a high‑resolution bitmap screen area (bitmap mode). If the bottom of BASIC's workspace falls into the bitmap region the bitmap will be overwritten and the display corrupted.

Two remedies:
- Move the bottom of BASIC upward (reduce BASIC's usable top) so the BASIC workspace stays entirely above the bitmap area. (i.e., adjust BASIC's top — the end of its workspace.)
- Move the bitmap screen area to a different RAM region above BASIC's workspace.

This is strictly a BASIC issue caused by BASIC's dynamic workspace allocation; machine‑language programs that manage RAM directly do not exhibit this automatic overlay problem.

## References
- "bitmap_example_and_clearing_screen" — allocating and clearing bitmap region within memory