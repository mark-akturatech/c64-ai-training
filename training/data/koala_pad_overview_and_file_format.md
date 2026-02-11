# Koala Pad — hardware overview and Koala file format

**Summary:** Koala Pad touch tablet — active area 4"×4", 256×256 resolution, plugs into a Commodore 64 joystick port and is treated by software as a pair of game paddles; Koala picture files on disk are flagged by a leading byte $81 followed by the ASCII string "PIC", a picture letter, and a space.

**Hardware overview**
The Koala Pad is a touch-sensitive digitizing tablet with:
- Active area: 4" × 4"
- Resolution: 256 × 256 points (pixel coordinates 0–255)
- Interface: plugs into a Commodore 64 joystick port; the device is handled by Koala software as a pair of game paddles (analog paddle inputs)

The device is a simple external digitizer intended to provide X/Y coordinates to graphics programs by emulating analog paddle inputs on the joystick port.

**File format**
When Koala software saves a picture to disk, it prefixes the saved filename with a 1‑byte flag and an identifying ASCII header:
- A single leading byte with value $81 — prints on the screen as an inverted spade (a non‑keyboard character) and is used as a Koala file flag.
- Immediately following that byte is the ASCII string "PIC".
- That is followed by a single picture letter (a single ASCII character identifying the picture) and a space.

This header sequence is used by Koala utilities to identify files saved by the Koala package on disk. The documented sequence in order is:
1. $81 (flag byte)
2. "PIC"
3. picture letter
4. space

## Source Code
```text
; Example header bytes (hex and ASCII)
$81  50  49  43  41  20  ...
     'P' 'I' 'C' 'A' ' '  ...
; $81 = Koala flag (prints as inverted spade; non-keyboard)
; "PIC" = ASCII identifier
; 'A' = example picture letter (single character)
; ' ' = space separator
; The rest of the filename and the file data follow this header on disk.
```

## References
- "koala_filename_utils_and_memory_map" — utilities to change Koala file names and memory layout of Koala files  
- "display_pic_usage_and_relocation" — using the DISPLAY PIC program to show Koala images and relocation details