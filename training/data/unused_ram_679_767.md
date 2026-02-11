# RAM area $2A7-$2FF (679–767) — Unused — suitable for ML/subroutines & sprite/char data

**Summary:** RAM $2A7-$2FF (decimal 679–767) is marked "Unused" and available for machine language subroutines or graphics data; when the VIC-II uses the bottom 16K (default), this is one of the few free areas for sprite/character data — locations $2C0-$2FF (704–767) are noted as suitable for sprite data block #11.

## Details
This block of zero-page/low-RAM (addresses 679–767, $2A7–$2FF) is documented as unused and recommended for programmer use:
- Suitable uses: machine language subroutines, graphics data storage (sprite or character data).
- VIC-II bank note: if the VIC-II is configured to use the bottom 16K of memory (the default on power-on), this RAM area remains available for graphics storage without conflicting with BASIC program text or variables.
- Specific sprite suggestion: decimal 704–767 (hex $2C0–$2FF) are called out as appropriate for sprite data block number 11 (a contiguous sprite-data block), since placing sprite shape data here won't interfere with BASIC program space/variables under the default memory configuration.

No register maps or hardware registers apply to this chunk — it documents usable RAM ranges only. The source contains a minor typographical error ("Locaitons" → "Locations") corrected in this summary.

## References
- "sprite_shape_data_pointers" — expands on Free RAM can be used to store sprite shape data referenced by sprite pointers
