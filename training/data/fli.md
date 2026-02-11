# Flexible Line Interpretation (FLI) — VIC-II (MOS 6567/6569)

**Summary:** FLI forces the VIC-II to perform a Bad Line on every raster line by manipulating YSCROLL and related VIC registers ($D011, $D018), causing the video matrix to be read each line so bitmap-mode color information can change at line granularity; constraints include VCBASE behavior, VM10–VM13 matrix switching, and strict timing for writes to $D011.

## Mechanism
FLI turns every raster line into a Bad Line so the VIC-II fetches video matrix bytes (used for bitmap color info) on every line. Normally bitmap color information is only fetched per 8×8 text cell, limiting color granularity; by forcing per-line video-matrix reads you can change color data line-by-line and thus reduce the effective color granularity from 8×8 blocks down to individual raster lines.

To accomplish this you change YSCROLL (the VIC vertical fine-scroll setting) so that each raster line meets the Bad Line condition. Because VCBASE will not increment if a new Bad Line is created before the current text line has finished, the CPU cannot simply update the video matrix fast enough. Instead FLI cycles the video-matrix base address using the VM10–VM13 bits in $D018 to point to pre-prepared matrices so the VIC reads different color/data rows each raster line without relying on VCBASE increments.

Practically this is done by preparing eight video matrices in memory and rotating VM10–VM13 each raster line so:
- raster line 1 reads line 1 of matrix 1
- raster line 2 reads line 1 of matrix 2
- ...
- raster line 8 reads line 1 of matrix 8
- raster line 9 reads line 2 of matrix 1
and so on — with eight matrices you can provide per-line data for a full bitmap height.

## Constraints and timing
- VCBASE does not increment when you create new Bad Lines before the current text line finishes; therefore you must switch the video-matrix base via VM10–VM13 in $D018 rather than relying on VCBASE updates.
- Color RAM cannot be bank-switched this way; color selection per pixel remains limited by Color RAM layout (i.e., you cannot fully free-color per-pixel values by switching VM).
- Writes to $D011 (the VIC register that holds YSCROLL and related control bits) used to create the Bad Line must not occur earlier than cycle 14 of the raster line. Writing earlier will clear RC improperly and break the intended bitmap display.
- Because of VIC bus timing (BA/AEC behavior): when the Bad Line is first created in cycle 14, BA is low in cycle 15 (first VIC c-access), but AEC is still high (AEC only stays low three cycles after BA falls). With AEC high the VIC’s D0–D7 internal bus drivers are closed (NMOS chip), so the VIC samples $FF on those bits (though D8–D11 drivers may be open). This produces visible 24-pixel-wide stripes (left-side artifacts) corresponding to the first three c-accesses that do not return valid video-matrix data.
- The first three VIC c-accesses of that line therefore read invalid data (seen as the stripes). This is an unavoidable hardware timing consequence of creating a Bad Line at or after cycle 14.

## Practical implementation notes (summary of required setup)
- Prepare eight video matrices in memory, each containing the bitmap row data you want read on a given raster line.
- On each raster line, at or after cycle 14, write $D011 to adjust YSCROLL (to trigger/align Bad Line) and write $D018 VM10–VM13 to select the appropriate video-matrix base for that line.
- Accept/handle the left-side artifacts caused by the first three c-accesses reading $FF (24-pixel stripes).
- Remember Color RAM cannot be switched this way, so per-line color is limited by sharing Color RAM values across the bank-switched matrices.

## Variants
- AFLI (Advanced FLI): uses the standard bitmap mode and simulates blended colors by arranging similarly colored adjacent pixels (software technique to approximate more colors).
- IFLI (Interlaced FLI): alternates between two frames in an interlace-like manner to increase vertical resolution or color choices over two frames.

## Key Registers
- $D011 - VIC-II - vertical fine-scroll / control (YSCROLL); writes to create Bad Line must not occur before cycle 14
- $D018 - VIC-II - video matrix base selection (VM10–VM13 bits used to switch among prepared matrices)

## References
- "standard_bitmap_mode" — expands on how forcing per-line video matrix reads increases color resolution in bitmap modes
- "vc_and_rc" — details VCBASE/VC behavior when additional Bad Lines are inserted

## Labels
- $D011
- $D018
