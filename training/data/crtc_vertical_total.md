# MACHINE - CRTC Register R4: Vertical Total

**Summary:** 7-bit CRTC register R4 (Vertical Total) — holds total character rows per frame minus one; used with R5 to set frame rate and vertical timing; /RES can force absolute synchronism.

## Vertical Total (R4)
R4 is a 7-bit register containing (Total character rows per frame) − 1. The stored value therefore represents one less than the number of character rows the CRTC will generate each frame; effective rows = R4 + 1 (range 0–127).

This register, together with R5, defines the vertical timing and overall frame rate. To avoid visible flicker the resulting frame time should be kept close to the line frequency; if the frame time is made longer than the line-frequency period, the /RES input may be used to obtain absolute synchronism.

## References
- "CRTC Register Set" — general register descriptions (R0..R17)

## Labels
- R4
