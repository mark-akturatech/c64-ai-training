# VIC-II invalid text mode (ECM=1, BMM=0, MCM=1) — black pixels but valid sequencer output

**Summary:** VIC-II invalid text mode produced when ECM=1, BMM=0, MCM=1 yields a visually black screen while the internal graphics sequencer still generates valid character/multicolor data (c-access/g-access). Sprite collisions can be used to recover the generated foreground/background pattern (no color information); generated graphics resemble multicolor text but use a 64-character set (ECM-limited).

**Description**
Setting ECM and MCM together (with BMM=0) does not select a documented VIC-II display mode; instead, the VIC produces only black pixels on-screen while internally producing a valid graphics-data stream. Key points:

- **Visual output:** All pixels appear black (both background and foreground map to black).
- **Internal sequencer:** Character/multicolor sequencer still produces valid bit patterns and address signals (c-access and g-access), so sprite logic and collision detection behave as if there were visible pixels.
- **Reading hidden data:** By using sprite collisions (see sprite_priority_and_collision), you can sense which pixels are "foreground" versus "background" but you cannot retrieve color information — only a 1-bit foreground/background distinction.
- **Generated pattern:** Resembles the multicolor text mode pattern (2-bit multicolor cells), but the character set is restricted to 64 characters as in ECM mode (only 6-bit character index).
- **Address/data semantics:** g-access address lines and g-data bits are generated normally; the MC (multicolor) flag in g-data controls whether the sequencer interprets the fetched bits as 1bpp (8 pixels from 8 bits) or 2bpp (4 multicolor pixels from pairs of bits), but in this invalid mode all resulting pixel outputs are black. However, foreground/background decoding internally still differentiates pixel types for collision logic.
- **Practical implication:** You can reconstruct the invisible produced bitmap as a binary mask (foreground vs background) via sprite-collision probing, but you cannot recover palette/color assignments.

## Source Code
```text
Invalid text mode (ECM/BMM/MCM = 1/0/1) — c-access and g-access layouts

c-access

 Addresses

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |VM13|VM12|VM11|VM10| VC9| VC8| VC7| VC6| VC5| VC4| VC3| VC2| VC1| VC0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Data

 +----+----+----+----+----+----+----+----+----+----+----+----+
 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+
 | MC |         unused         | D5 | D4 | D3 | D2 | D1 | D0 |
 |flag|                        |    |    |    |    |    |    |
 +----+------------------------+----+----+----+----+----+----+

g-access

 Addresses

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |CB13|CB12|CB11|  0 |  0 | D5 | D4 | D3 | D2 | D1 | D0 | RC2| RC1| RC0|
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Data

 +----+----+----+----+----+----+----+----+
 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+
 |         8 pixels (1 bit/pixel)        |
 |                                       | MC flag = 0
 | "0": Black (background)               |
 | "1": Black (foreground)               |
 +---------------------------------------+
 |         4 pixels (2 bits/pixel)       |
 |                                       |
 | "00": Black (background)              | MC flag = 1
 | "01": Black (background)              |
 | "10": Black (foreground)              |
 | "11": Black (foreground)              |
 +---------------------------------------+
```

## Key Registers
- **Control Register 1 ($D011):**
  - **Bit 6 (ECM):** Extended Color Mode.
  - **Bit 5 (BMM):** Bitmap Mode.
- **Control Register 2 ($D016):**
  - **Bit 4 (MCM):** Multicolor Mode.

## References
- "sprite_priority_and_collision" — expands on using sprite collisions to read generated, otherwise invisible graphics

## Labels
- D011
- D016
