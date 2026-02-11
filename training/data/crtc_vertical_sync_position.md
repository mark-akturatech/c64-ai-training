# CRTC Register R7: Vertical Sync Position

**Summary:** R7 is a 7-bit CRTC register (Vertical Sync Position) that selects the character-row time at which the VSYNC pulse is generated, and thus vertically positions the displayed text. Searchable terms: R7, CRTC, VSYNC, vertical position, character row, 7-bit.

## Vertical Sync Position (R7)
This 7-bit register selects the character-row time at which the VSYNC pulse is desired to occur. By choosing the character row for VSYNC, R7 determines the vertical placement of the displayed text area on the screen (character row = group of scanlines that form one text character). Changing R7 shifts the visible text block up or down relative to the frame.

## References
- "MACHINE - CRTC Register R7" — definition of Vertical Sync Position register

## Labels
- R7
- VERTICAL_SYNC_POSITION
