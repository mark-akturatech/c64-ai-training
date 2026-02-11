# Very short BASIC sprite creation program (page153.prg)

**Summary:** Minimal Commodore 64 BASIC example showing sprite setup: POKE 2040 (sprite pointer), write 63 bytes of sprite bitmap at 832..894, set VIC-II base v = $D000 (53248), enable sprite 0 with POKE v+21,1 (register $D015), set sprite 0 color with POKE v+39,1 (register $D027), and position the sprite with POKE v,24 and POKE v+1,100.

## Program explanation
This is a compact, complete BASIC sequence that demonstrates the minimum steps to create and display a single solid sprite on the C64:

- Line 10: Clear the screen (BASIC PRINT "{clear}").  
- Line 20: POKE 2040,13 — sets the sprite pointer for sprite 0. The pointer byte stored at decimal 2040 points to a 64-byte block number; the sprite data address = pointer * 64. Here 13 * 64 = 832 ($0340), the start of the bitmap.  
- Line 30: FOR S=832 TO 832+62: POKE S,255: NEXT — writes 63 bytes (832..894) with 255. Sprites are stored as 3 bytes per row × 21 rows = 63 bytes; filling these bytes with 255 sets all bits on, producing a solid sprite pattern.  
- Line 40: v=53248 — sets v to the VIC-II register base $D000 (decimal 53248). Using v keeps subsequent POKEs readable.  
- Line 50: POKE v+21,1 — writes 1 to VIC register $D015 (v+21) to enable sprite 0 (bit 0 = 1).  
- Line 60: POKE v+39,1 — writes 1 to VIC register $D027 (v+39) to set sprite 0 color to palette index 1.  
- Line 70-80: POKE v,24 : POKE v+1,100 — set sprite 0 screen X (low byte) to 24 and Y to 100 (positioning on screen).

Notes:
- The program uses 63 bytes (3×21) which is exactly the standard sprite bitmap size; the pointer table entries are block numbers (0..255) multiplied by 64 to form the address.
- Addresses are shown in the BASIC listing as decimal (common in BASIC examples); VIC-II base is shown as decimal 53248 = $D000.

## Source Code
```basic
10 print"{clear}"
20 poke2040,13
30 fors=832to832+62:pokes,255:next
40 v=53248
50 pokev+21,1
60 pokev+39,1
70 pokev,24
80 pokev+1,100
```

## Key Registers
- $07F8 - RAM - Sprite pointer table entry for sprite 0 (decimal 2040)
- $0340-$037E - RAM - Sprite bitmap bytes used by this example (decimal 832..894, 63 bytes = 3×21 rows)
- $D000-$D02E - VIC-II - VIC-II register block (sprite positions, enables, colors, etc.)
- $D015 - VIC-II - Sprite enable register (bit 0 enables sprite 0; POKE v+21,1)
- $D027 - VIC-II - Sprite 0 colour register (Poke v+39,1 sets sprite 0 color)
- $D000 - VIC-II - Sprite 0 X position (low byte) (POKE v,24)
- $D001 - VIC-II - Sprite 0 Y position (POKE v+1,100)

## References
- "sprite_pointers_and_memory_location_formula" — expands on POKE 2040 and pointer→address calculation
- "sprite_color_registers_locations_and_usage" — expands on POKE v+39 and sprite color registers