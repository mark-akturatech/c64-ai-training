# MOB Magnification (MnXE, MnYE)

**Summary:** Per-MOB 2× magnification controlled by VIC-II registers $D017 (MnXE) and $D01D (MnYE); horizontal and vertical expansion doubles MOB dimensions without increasing pixel resolution (24×21 array or 12×21 in multi-color), and combining multi-color with expansion can produce dot sizes up to 4×.

## Magnification Details
Each MOB (movable object; sprite) can be independently expanded by 2× in the horizontal and/or vertical direction using the magnification control bits MnXE and MnYE. Setting the control bit to "1" enables expansion; "0" leaves the MOB at normal size.

Behavioral specifics:
- Expansion is per-MOB and selectable independently for horizontal and vertical axes.
- Expansion does not increase internal resolution: the same logical pixel array is shown.
  - Normal single-color MOB: 24×21 pixel array.
  - Multi-color MOB: effectively 12×21 pixel resolution (horizontal pixels are doubled by design).
- When expanded horizontally or vertically, the overall MOB physical dimensions are doubled in that direction.
- Combining multi-color mode with expansion can yield physical dot sizes up to 4× the standard dot (multi-color halves horizontal resolution, expansion doubles physical dot size).

## Source Code
```text
REGISTER  |                        FUNCTION
--------- + ------------------------------------------------------------
   23 ($17) | Horizontal expand MnXE - "1"=expand; "0"=normal
   29 ($1D) | Vertical expand MnYE   - "1"=expand; "0"=normal

When MOBs are expanded, no increase in resolution is realized. The same
24*21 array (12X21 if multi-colored) is displayed, but the overall MOB
dimension is doubled in the desired direction (the smallest MOB dot may
be up to 4X standard dot dimension if a MOB is both multi-colored and
expanded).
```

## Key Registers
- $D017 - VIC-II - Horizontal expand MnXE ("1"=expand; "0"=normal)
- $D01D - VIC-II - Vertical expand MnYE ("1"=expand; "0"=normal)

## References
- "mob_color_modes_and_multicolor_interpretation" — expands on multi-color MOB resolution and how expansion affects dot size
- "mob_memory_access_and_pointers" — explains fetch timing remains per raster line regardless of magnification

## Labels
- MNXE
- MNYE
