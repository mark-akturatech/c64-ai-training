# C64: Indirect Color Registers (multicolor) and BASIC demo (page118.prg)

**Summary:** Explains VIC-II indirect color registers (border/background/multicolor registers) and how changing one register instantly recolors every screen dot that references it; includes a BASIC program that enables multicolor mode (POKE 53270 / $D016) and repeatedly POKEs 53282 ($D022) with random values to change a multicolor background register.

## Color registers and behavior
The VIC-II uses indirect color registers for global colors: many screen pixels reference a small set of color registers rather than storing full color values per pixel. Changing a single indirect color register changes every pixel that references that register instantly (useful for global color swaps and effects).

- In multicolor character modes, pixels are encoded in 2-bit pairs selecting among a small set of color sources (global background and multicolor registers, plus per-character color). Changing the global/multicolor registers therefore recolors all pixels that use those slots.
- The example program turns on multicolor mode by POKEing the VIC-II control register and then repeatedly POKEs the multicolor background register with random values to demonstrate whole-screen color changes.
**[Note: Source may contain an error — the original text says “2 bits can be used to pick 16 colors (background) or 8 colors (character)”, which is contradictory (2 bits select 4 values).]**

## Source Code
```basic
100 poke53270,peek(53270)or16: rem turn on multicolor mode
110 print chr$(147)chr$(18);
120 print"{orange*2}";: rem type c= & 1 for orange or multicolor black bg
130 for l=1 to 22: print chr$(65);: next
135 for t=1 to 500: next
140 print"{blue*2}";: rem type ctrl & 7 for blue color change
145 for t=1 to 500: next
150 print"{black}hit a key"
160 get a$: if a$="" then 160
170 x=int(rnd(1)*16)
180 poke 53282,x
190 goto 160
```

## Key Registers
- $D016 - VIC-II - Control register (bit 4 enables character multicolor mode) ($D016 = 53270)
- $D020-$D023 - VIC-II - Border ($D020), background ($D021) and multicolor background registers ($D022, $D023) — changing these registers recolors all pixels that reference them ($D022 = 53282)

## References
- "multi_color_demo_program" — expands on example background register settings

## Labels
- $D016
- $D020
- $D021
- $D022
- $D023
