# MACHINE - CRTC Register R2: Horizontal Sync Position

**Summary:** CRTC register R2 (8-bit) holds the HSYNC position in character-location units; changing R2 shifts the horizontal placement of the displayed text and adjusts side margins. Terms: HSYNC, CRTC (6845-style), character location numbers, left/right margins.

## Horizontal Sync Position (R2)
This 8-bit register specifies the horizontal position of the HSYNC pulse measured in character-location numbers along the scanline. The HSYNC position set in R2 determines the left-to-right placement of the displayed text window on the screen; modifying R2 moves the side margins and shifts the whole text area horizontally.

Notes:
- Width: 8 bits — valid values 0–255.
- Units: character-location numbers (counts character cells, not individual pixels).
- Effect: incrementing R2 shifts the displayed text to the right by one character cell per unit; decrementing shifts left.

## Key Registers
- (None — this chunk documents a generic CRTC/6845 register; no absolute C64 addresses provided.)

## References
- "CRTC Registers Overview" — register map and usage summary