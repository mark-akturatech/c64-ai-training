# MACHINE - CRTC Register R0: Horizontal Total

**Summary:** CRTC (6545) register R0 — "Horizontal Total" — is an 8-bit register holding the total number of character times per horizontal raster line minus one; it directly sets the HSYNC period and thus HSYNC frequency.

## Description
R0 (register index 0 of the 6545 CRTC) contains an 8-bit value equal to (total character times per horizontal line) − 1. The CRTC counts character times across each scanline; the number of character times in a line is therefore (R0 + 1).

Changing R0 changes the horizontal timing: increasing R0 lengthens each horizontal line (more character times per line) and lowers HSYNC frequency; decreasing R0 shortens the line and raises HSYNC frequency.

## Operation / Relationship
- Total character times per horizontal line = R0 + 1.
- HSYNC period = (R0 + 1) × character_time (i.e., one character time unit).  
- HSYNC frequency = 1 / HSYNC period (inversely proportional to R0 + 1).

(“character_time” means the duration of one character clock cell as used by the CRTC.)

## References
- "6545_crtc_concept_and_register_map" — full list of 6545/CRTC registers and register indexes