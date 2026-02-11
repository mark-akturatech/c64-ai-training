# FLI / AFLI / IFLI (Flexible Line Interpretation)

**Summary:** FLI is a VIC-II technique that produces more colours per 8×8 character cell by forcing a Bad Line each raster line and changing $D018 to point at one of eight different screen RAM pages ($08,$18,...,$78). AFLI is the hires variant (uses 0x4000 bytes bitmap), and IFLI interlaces two FLI frames while alternating X-scroll for higher apparent resolution.

## Overview
FLI (Flexible Line Interpretation) repeats the same bitmap while swapping which screen RAM (colour/character-index bytes) the VIC-II uses on every raster line. By forcing a Bad Line every raster line (VIC-II fetch condition) and changing $D018 each line to point to a different screen RAM page, you can display different colour bytes for the same bitmap line and thus achieve many more colours per character than standard multicolour mode.

AFLI is the same concept in hires (single-bitplane bitmap) — layout and technique are identical except colour RAM is not used and the picture uses 0x4000 bytes. IFLI alternates between two full FLI frames every frame and toggles X-scroll by 1 pixel to create an interlaced higher-resolution/colour illusion.

The technique also produces a very stable raster (useful for raster-timed effects and interrupts) as a side-effect.

## Operation details
- Mechanism: trigger a Bad Line every raster line (use $D011 to ensure VIC-II performs character-row memory fetches), and during the Bad Line change $D018 to point the VIC at the next screen RAM page while leaving the same bitmap base unchanged. Repeat for 8 successive lines then loop.
- Screen RAM pages used: eight consecutive pages holding different colour/character-index bytes; VIC page pointer values used in $D018 are $08, $18, $28, $38, $48, $58, $68, $78 (pointing to physical pages in $4000–$5FFF).
- Bitmap remains constant (one bitmap used by all 8 screen RAM pages).
- Colour RAM: for standard (multicolour) FLI the source colour RAM region ($3C00–$3FFF) is copied into $D800 during initialization so the displayed colours come from the copied area.
- AFLI: no colour RAM; hires layout occupies 0x4000 bytes (bitmap) and the same per-line screen swaps concept applies to the character/screen memory bytes.
- IFLI: two distinct FLI frames are alternated frame-by-frame; X-scroll is toggled by 1 pixel between frames to create an interlaced effect (apparent higher horizontal resolution).

## Limitations and bugs
- FLI bug: the first three characters on every raster line are unusable (artifact of the per-line memory-pointer switching during Bad Lines). There is no workaround:
  - In FLI and IFLI: set those character/colour values to 0 (black).
  - In AFLI (hires): those three character positions display as light grey; to hide them you must typically cover them with sprites.
- Side-effects: stable raster timing (helpful for other raster-synced code).

## Source Code
```text
Memory/layout notes (reference):
- FLI base picture: $3C00 start (source colour RAM/cfg)
- Colour RAM source: $3C00 - $3FFF (copied to $D800 during init for FLI)
- Screen RAM pages (8 pages): $4000 - $5FFF (8 * 0x400 = 8 pages)
- Bitmap (shared): $6000 - $7FFF

D018 (VIC-II memory pointer) sequence for per-line swapping:
- use values: $08, $18, $28, $38, $48, $58, $68, $78  (repeat per 8-line group)

AFLI:
- Same swapping technique as FLI but in hires mode (no colour RAM)
- AFLI picture uses 0x4000 bytes for bitmap (single-bitplane layout)

IFLI:
- Two FLI frames (frame A and frame B)
- Alternate frames each vertical frame
- Toggle X-scroll by 1 pixel between frames to interlace and increase apparent resolution
```

## Key Registers
- $D011 - VIC-II - control register (vertical/bad-line related control; used to produce Bad Lines)
- $D018 - VIC-II - memory-pointer register (selects screen/bitmap pages; set per-line to $08,$18,...,$78 to swap screen RAMs)

## References
- "stable_raster_interrupts" — expands on the stable raster side-effect and raster-synced interrupt techniques

## Labels
- D011
- D018
