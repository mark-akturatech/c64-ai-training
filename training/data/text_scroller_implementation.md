# Text scroller fundamentals

**Summary:** Describes a VIC-II raster-interrupt text scroller using $D016 X-scroll (lower 3 bits, 0..7) and screen RAM shifting; covers IRQ placement, frame-step decrementing, line-copy routine (screen RAM $0400-$0427 example), text buffer wrap, colour RAM ($D800-$DBE7), custom charsets ($D018), and vertical movement via $D011.

## Fundamentals
- Use a raster IRQ a few scanlines before the scroller display area to update VIC-II registers safely each frame.
- $D016 (VIC-II) lower 3 bits = fine X-scroll (0..7). 0 = normal alignment, 7 = scrolled 7 pixels right.
- Animate by starting X-scroll at 7 and decrementing each frame (or decrement by 2,3,... for faster motion). When the X-scroll wraps from 0 -> 7 you must shift character bytes in screen RAM one cell left and load the next character into the rightmost cell.
- Typical single-line screen RAM addresses: first visible line begins at $0400 and the first row ends at $0427 (copy $0401->$0400, $0402->$0401, …, write new char to $0427).
- Store your scroller text in a buffer in RAM. Implement wrap-around by storing the end position (pointer) or an end marker byte (e.g. $FF) and loop back to start when reached.
- Colour effects: change colour RAM ($D800-$DBE7) per character for fades, per-character colours, or cycling palettes. Colours can be moved in sync with character shifts to give per-character colouring.
- Custom character sets: point VIC-II to your charset (see $D018 bank/char-pointer topics) to use nicer or larger fonts (1x2, 2x2, multicolour characters).
- Vertical/sub-character Y movement: use $D011 (VIC-II control / raster Y fine-scroll) and copy/shift rows to achieve more-than-7-pixel vertical scrolling (same copy concept as X-scroll).
- Workflow suggestion: first get $D016 fiddling visually correct (characters appear to move left for 8 frames then snap back). Next implement the single-line copy routine, then add text-buffer reading/wrapping, then colours, custom charsets, larger fonts, and Y-movement.

## Key Registers
- $D000-$D02E - VIC-II - VIC-II registers (includes $D011, $D016, $D018)
- $D016 - VIC-II - X fine-scroll (lower 3 bits control 0..7)
- $D011 - VIC-II - Control / Y fine-scroll and other control bits
- $D018 - VIC-II - Memory control / character memory pointer (used when changing charset)
- $D800-$DBE7 - Colour RAM - per-character colour bytes for screen characters

## References
- "changing_charset_and_d018" — expands on using custom charsets and $D018
- "fld_flexible_line_distance" — expands on using FLD / $D011 for vertical scroller movement
