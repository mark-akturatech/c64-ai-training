# CRTC Register R6 — Vertical Displayed (Number of Displayed Character Rows)

**Summary:** R6 is a 7-bit CRTC (6845-compatible) register that specifies the number of displayed character rows per frame, determining the vertical size of the displayed text. Searchable terms: R6, Vertical Displayed, 7-bit, character rows, CRTC, 6845.

## Description
R6 (Vertical Displayed) holds a 7-bit value equal to the number of character rows to be shown in each video frame. The register directly sets the vertical text size by specifying how many character rows the CRTC will present during the active display period.

- Range: 0–127 (7 bits).  
- Interpretation: value = displayed character rows (not scanlines). (Character height must be multiplied to get pixel/scanline count.)

## Labels
- R6
