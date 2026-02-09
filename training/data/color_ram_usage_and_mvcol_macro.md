# Color RAM (fixed) and the MVCOL macro

**Summary:** Color RAM on the C64 is fixed at $D800-$DBFF and the VIC-II cannot remap it; the MVCOL macro fills the color RAM with a single color (example: MVCOL WHITE). Text memory and color RAM are handled differently by different graphics modes — check the active graphics mode if colors appear wrong.

## Description
- Color RAM is a fixed 1 KB page at $D800-$DBFF that stores the per-cell color information used by the VIC-II. The VIC-II cannot be pointed to a different memory area for color data.
- The MVCOL macro (example usage: MVCOL WHITE) writes a single color value into the entire color RAM, forcing all display cells to that color.
- Color RAM stores only 4 bits per location (a nibble). When reading color RAM values in code, mask out the upper nibble (e.g., AND #$0F) to obtain the color value.
- Text memory (character codes / screen RAM) and color RAM are treated differently across graphics modes; the way color RAM is interpreted depends on the current mode. If the displayed picture or text colors are not as expected, verify that the correct graphics mode is selected.

## Source Code
```asm
; Example usage shown in source
MVCOL WHITE

; Common read example (mask upper nibble to get color nibble)
LDA $D800,X
AND #$0F
; A now contains the 4-bit color for that screen cell
```

## Key Registers
- $D800-$DBFF - VIC-II - Color RAM (1 KB, 4-bit color per screen cell; upper nibble unused)

## References
- "color_ram_nibble_storage" — masking upper nibble when reading color RAM