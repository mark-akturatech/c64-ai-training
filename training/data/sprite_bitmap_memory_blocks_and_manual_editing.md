# Sprite 0 bitmap: memory layout and simple editing (addresses 832–894 / $0340–$037E)

**Summary:** Maps the 63 bytes at decimal 832–894 (hex $0340–$037E) to sprite 0 bitmap data (24×21 standard single-color sprite). Explains the 3-bytes-per-row layout, the address formula, bit ordering (MSB = leftmost), and simple BASIC POKE examples (POKE 833,0 / POKE 833,255 and a FOR loop writing 255).

**Sprite bitmap layout and behavior**
- Standard single-color C64 sprites are 24 pixels wide by 21 pixels high, requiring 3 bytes per horizontal row and 21 rows = 63 bytes total.
- If the sprite bitmap for sprite 0 is placed starting at decimal 832 (hex $0340), the bytes occupy addresses 832..894 (hex $0340..$037E) inclusive.
- Address-to-row/column mapping:
  - Each byte represents an 8-pixel horizontal block.
  - There are three 8-pixel blocks per horizontal row (3 bytes × 8 = 24 pixels).
  - Row index range: 0..20 (21 rows).
  - Column index range: 0..2 (three 8-pixel groups per row).
  - Address formula: address = start + row*3 + col (where start = 832 / $0340).
- Bit ordering inside each byte:
  - Bit 7 (MSB) is the leftmost pixel of that 8-pixel block; bit 0 (LSB) is the rightmost.
  - Byte value 255 (binary 11111111) fills all 8 pixels in that block; 0 clears them.
- Editing via BASIC POKE:
  - Setting a byte to 255 makes the corresponding 8 pixels solid.
  - Setting a byte to 0 clears those 8 pixels.
  - Example effect: POKE 833,0 clears the second 8-pixel block of the first row (address 833 is start+1).
- Typical quick program pattern (example referenced by the source): a FOR loop that POKEs 255 into each of the 63 addresses to make the entire sprite solid; running the program or manually POKEing restores cleared blocks.

## Source Code
```basic
10 REM Fill sprite 0 bitmap area with solid pixels
20 FOR I = 832 TO 894
30   POKE I,255
40 NEXT I
50 REM Now sprite data at 832..894 is all 1-bits (solid)
```

```basic
REM Manual edit examples (DIRECT mode)
POKE 833,0    : REM clears the second 8-pixel group (byte at 833)
POKE 833,255  : REM restores that group to solid
```

```text
Address map (start = 832 / $0340). Each row = 3 addresses (A,B,C) -> 24 pixels:
Row 0:  832 ($0340), 833 ($0341), 834 ($0342)
Row 1:  835 ($0343), 836 ($0344), 837 ($0345)
Row 2:  838 ($0346), 839 ($0347), 840 ($0348)
...
Row 20: 892 ($0374), 893 ($0375), 894 ($0376)  [last row addresses]
(Above continues sequentially; use address = 832 + row*3 + column)
```

## Key Registers
- $0340-$037E - RAM - Sprite 0 bitmap area (63 bytes; standard single-color 24×21 sprite)

## References
- "sprite_program_overview_and_pointer_setup" — expands on the program that writes these 63 bytes and how the sprite pointer is set
- "sprite_block_erasing_loop_and_examples" — expands on examples of program loops that clear or modify specific 8-pixel blocks in the sprite