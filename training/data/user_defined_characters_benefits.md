# User-defined characters (custom character sets)

**Summary:** Describes advantages of user-defined characters for the VIC-II: extend graphics capability (math/foreign symbols, custom glyphs), substitute for bitmap plotting, and speed/memory benefits when using custom character sets instead of pixel plotting.

## Overview
User-defined characters (custom character sets) let you replace the ROM character glyphs with your own 8×8 (or 8×N) bit patterns so the VIC-II can display application-specific symbols and graphics as text. This extends the built-in character repertoire without changing the underlying text-mode mechanics.

## Advantages
- Extend display repertoire: create math, chemistry, foreign-language alphabets, or any specialized glyphs not present in the ROM.
- Graphics substitution: design graphic tiles that act as single-character substitutes for plotting multiple pixels; useful for charting, icons, or simple sprites-like artwork within text/charset modes.
- Memory efficiency: a carefully designed custom character set can achieve the effective resolution of a high-resolution bitmap in many contexts while using less video/CPU memory than a full bitmap.
- Speed: once a character is defined in memory, drawing it via text output (PRINT, POKE to screen memory, or writing to screen RAM) is far faster than plotting the constituent pixels individually in bitmap modes.

## Typical use cases
- Replace seldom-used printable characters with application glyphs (e.g., custom arrow sets, block/line drawing).
- Implement higher apparent resolution by treating the screen as a grid of tiles (each tile is one character) rather than per-pixel plotting.
- Rapid rendering of repeated shapes (bars, graphs, HUD elements) by writing character codes instead of redrawing bitmaps each frame.

## References
- "employing_user_defined_characters_setup" — Steps to place character data for VIC-II to use
