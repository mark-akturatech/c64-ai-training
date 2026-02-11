# VIC-II Sprite Display Modes and X/Y Size Expansion

**Summary:** Describes VIC-II sprite display modes (standard 1bpp and multicolor 2bpp, resolution halved horizontally to 12×21) and sprite X/Y expansion behavior and implementation differences; mentions sprite color registers $D027-$D02E and the VIC-II sprite sequencer/address generator.

## Sprite display modes
- Standard mode: sprite data is interpreted 1 bit per pixel. A bit value 0 is transparent (underlying screen graphics visible); a bit value 1 is rendered in the sprite's color (from the sprite color register for that sprite).
- Multicolor mode: sprite data is interpreted 2 bits per displayed pixel (pairs of adjacent bits form one displayed pixel). This halves horizontal resolution compared with standard mode — resulting display size shown as 12×21 (pixels are twice as wide).
- The mapping of data bits to displayed pixels is handled by the VIC-II sprite data path (sequencer and shift register); multicolor grouping reduces horizontal pixel count but not the vertical count.

## X and Y expansion (size doubling)
- X-expansion (horizontal doubling):
  - Causes each sprite pixel to be output twice horizontally (pixels become twice as wide).
  - Implemented by the sprite data sequencer: the sequencer outputs pixels at half frequency so each source pixel maps to two output pixels.
  - Effect on multicolor: an X-expanded multicolor displayed pixel (which already covers two data bits) becomes twice as wide again — e.g., an x-expanded multicolor pixel is four times as wide as an unexpanded standard-mode pixel.
- Y-expansion (vertical doubling):
  - Causes each sprite scanline to be emitted twice (pixels become twice as tall).
  - Implemented by the sprite address generator: it reads the same sprite memory addresses for two consecutive raster lines so each sprite line is output twice.
- Implementation difference:
  - X-expansion is done in the pixel output/sequencer domain (timing/pixel-rate change).
  - Y-expansion is done in the address generator domain (repeating the same memory line twice).
  - Because the mechanisms are different they combine predictably (horizontal doubling multiplies pixel width; vertical doubling repeats lines).

## Combined effects
- Applying both X-expansion and multicolor: pixel grouping and timing combine so horizontal pixel width increases multiplicatively (multicolor groups bits into one pixel, X-expansion doubles that pixel width).
- Applying Y-expansion with any horizontal mode repeats each sprite row, preserving horizontal resolution while doubling vertical size.

## Key Registers
- $D027-$D02E - VIC-II - Sprite 0-7 color registers (sprite color used for "1" pixels in standard mode and for relevant color fields in multicolor rendering)

## References
- "sprite_data_sequencer_and_registers" — expands on how the sequencer and shift register implement X expansion  
- "p_and_s_access_address_and_data_format" — expands on how data bits map to pixels in standard vs multicolor modes
