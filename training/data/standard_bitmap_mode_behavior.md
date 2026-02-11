# Standard Bit Map Mode (BMM = 1, MCM = 0)

**Summary:** VIC‑II bitmap rendering mode where color for each pixel is taken only from the video matrix nybble (DB11–DB8 ignored); BMM and MCM mode names, VIC‑II, and 8×8 block/nybble behavior are searchable terms.

## Description
When Standard Bit Map Mode (BMM = 1, MCM = 0) is selected on the VIC‑II, color for each output pixel is determined solely by the 4‑bit nybble stored in the video matrix. The color nybble bits normally associated with bitmap data (DB11–DB8) are ignored in this mode.

Display memory is read as 8‑bit bytes; each byte is split into two 4‑bit nybbles, allowing two independently selectable colors within each 8×8 dot block. For each display-memory bit:
- a bit value of 0 selects the color from the lower (least significant) nybble (LSN) of the corresponding video matrix entry.
- a bit value of 1 selects the color from the upper (most significant) nybble (MSN) of that video matrix entry.

This enables two-color per byte (two colors per 8×8 block) graphics: the bitmap stores the pixel‑on/off pattern while the video matrix supplies the two actual palette indices (MSN and LSN).

Display color mapping (per display-memory bit)
- 0 → Lower nybble of video matrix pointer (LSN)
- 1 → Upper nybble of video matrix pointer (MSN)

## References
- "bitmap_mode_and_display_base_addressing" — expands on Bitmap addressing and 8×8 block formatting  
- "multi_color_bitmap_mode" — explains how MCM changes bitmap interpretation to use 2‑bit pairs
