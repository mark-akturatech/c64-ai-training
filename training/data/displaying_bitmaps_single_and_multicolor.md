# C64 bitmap display — hires single‑colour vs multicolour (screen RAM nybbles)

**Summary:** Explains the difference between hires single‑colour and multicolour bitmap modes on the VIC‑II, how single‑colour hires uses the upper/lower nybbles of screen RAM for background/foreground, and the minimal VIC register setup (examples: $D011, $D016, $D018) and memory placement (bitmap at a $2000‑aligned address, screen RAM $0400, colour RAM $D800).

## How single‑colour hires differs from multicolour
- Multicolour bitmap mode uses the separate colour RAM ($D800) to provide per‑character (per 8×8 cell) colours (4 bits each).
- Single‑colour hires mode does not use colour RAM for the foreground/background per cell; instead each byte in screen RAM (40×25 = 1000 bytes) is split into two 4‑bit nybbles:
  - upper nybble = one colour (e.g. background)
  - lower nybble = the other colour (e.g. foreground)
  - (If both nybbles hold the same value, the bitmap will be invisible because foreground == background.)
- The bitmap pixel data itself lives in a bitmap area (an 8KB VIC bitmap block). VIC bitmap addressing and the screen/bitmap banks are selected through $D018; additional VIC control is through $D011/$D016.
- Workflow summary: load a bitmap into an aligned 8KB block (e.g. $2000), set the VIC registers to bitmap single‑colour mode, then populate screen RAM bytes with (background<<4 | foreground) and poke your bitmap bytes into the bitmap area.

## Minimal register setup (examples)
- Common example values from demos/tutorials:
  - POKE $D011,$3B  (example: enables bitmap and appropriate vertical/fine scroll bits for display)
  - POKE $D016,$08  (example value for single‑colour bitmap configuration)
  - POKE $D018,$18  (selects VIC memory bank / screen & bitmap base; set to the correct value for where you loaded the bitmap/screen)
- After setting the VIC, write your screen bytes (upper/lower nybble colours) to $0400.. and bitmap bytes to the chosen bitmap address (e.g. $2000..).

## Memory layout (typical)
- Bitmap area: 8KB VIC bitmap block — load at a $2000‑aligned block (example: $2000..$3FFF when using bank aligned at $2000).
- Screen RAM: 1 KB, default at $0400..$07E7 (40×25 = 1000 bytes). In single‑colour hires each byte holds two 4‑bit colours (upper nybble and lower nybble).
- Colour RAM: 1 KB, at $D800.. (4‑bit per cell). Not used for foreground/background in single‑colour hires.

## Source Code
```basic
10 REM Single‑colour hires setup example (BASIC)
20 REM Set VIC registers (use decimal POKE addresses)
30 POKE 53265,59   : REM $D011 = $3B
40 POKE 53270,8    : REM $D016 = $08  (single‑colour mode example)
50 POKE 53272,24   : REM $D018 = $18  (set VIC bank / screen+bitmap pointers)
60 REM Clear bitmap area (example load at $2000 = 8192 dec)
70 FOR I = 8192 TO 8192+8191 : POKE I,0 : NEXT I
80 REM Fill screen RAM with background=1, foreground=6
90 BG=1:FG=6
100 FOR I = 1024 TO 1023+1000 : POKE I,BG*16+FG : NEXT I
110 REM Draw a solid byte in first bitmap byte for testing
120 POKE 8192,255
130 REM Now the bitmap/display should be visible
```

```text
Memory / addresses (reference)
- Bitmap block (8KB aligned): example $2000..$3FFF
- Screen RAM (1K): $0400 (1024) .. $07E7 (2023)  ; 40×25 = 1000 bytes
- Colour RAM (1K, 4‑bit values): $D800 .. (1000 bytes)
- VIC registers: $D000 .. $D02E (see Key Registers below)
```

## Key Registers
- $D000-$D02E - VIC‑II - control and bitmap/display registers (includes $D011, $D016, $D018 used above)

## References
- "bitmap_graphics_koala_example" — expands on setting VIC registers, Koala/bitmap file layout, and practical loader conventions