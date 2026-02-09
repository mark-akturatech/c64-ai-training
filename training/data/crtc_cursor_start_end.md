# MACHINE - CRTC R10 (Cursor Start) and R11 (Cursor End)

**Summary:** R10 and R11 are 5-bit CRTC registers selecting the cursor start and end scan lines (0–31); R10 also uses bits 5 and 6 to select cursor mode (no blink / no cursor / blink 1/16 / blink 1/32). R14/R15 control the cursor character position across the 16K address field.

## Cursor Start (R10) and Cursor End (R11)
R10 and R11 hold 5-bit values that define which scan lines within a character row make up the visible cursor. Valid values are 0–31 (5 bits). By programming both start (R10) and end (R11) you can form either an underline (start ≈ end near the bottom of the character cell) or a block cursor (start = top, end = bottom of the character cell).

R10 additionally encodes cursor mode in bits 6 and 5 (two high bits of the register). The mode bits are interpreted as follows:

| Bit 6 | Bit 5 | Cursor mode                      |
|-------|-------|----------------------------------|
| 0     | 0     | No blinking                      |
| 0     | 1     | No cursor                        |
| 1     | 0     | Blink at 1/16 field rate         |
| 1     | 1     | Blink at 1/32 field rate         |

Notes:
- Bits 0–4 of R10 = cursor start scan line (0–31).
- Bits 0–4 of R11 = cursor end scan line (0–31).
- R14 and R15 are the CRTC registers that determine the cursor character position within the entire 16K address field (i.e., which character position the cursor overlays).

## Source Code
(omitted — no assembly/listings or register maps provided in source)

## Key Registers
(omitted — CRTC/6545 is a non-C64 chip; no absolute C64 $Dxxx register conversions supplied)

## References
- "crtc_mode_control" — expands on cursor skew bit interaction with R10/R11