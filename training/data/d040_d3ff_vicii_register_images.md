# C64 I/O Map: $D040-$D3FF — VIC-II Register Images

**Summary:** Describes the VIC-II decoding and mirroring behavior in the $D000-$D3FF I/O window (including $D040-$D3FF): the VIC-II decodes only a 64-byte register space which is mirrored every 64 bytes within the 1K block; example POKE 53281+64,1 (border color at $D020) equals POKE 53281,1. Advises using the chip base addresses (e.g. $D020..$D02E, or $D000 base) for clarity.

## VIC-II mirroring behavior
The VIC-II contains 47 hardware registers but requires only a 64-byte address decode. All addresses in the C64 I/O window that map to VIC-II ($D000-$D3FF) are thus mirrored every 64 bytes: any access to a VIC-II register plus a multiple of $40 (64 decimal) hits the same internal register.

- Example (decimal and hex): POKE 53281+64,1 -> POKE 53281,1
  - 53281 = $D020 (border/background color register). Adding 64 ($40) addresses $D060, which is a mirror of $D020.
- Consequence: The 1K region $D000-$D3FF contains 16 identical 64-byte copies of the VIC-II register block.
- Programming advice: Use the VIC-II base register addresses (e.g. $D000 base or color registers $D020..$D02E) in source and comments to avoid confusion from mirrored offsets.

## Key Registers
- $D000-$D02E - VIC-II - primary register block (47 registers fit within a 64-byte decode window)
- $D040-$D0FF - VIC-II - mirror images of $D000-$D03F (repeated every $40 bytes)
- $D100-$D1FF - VIC-II - mirror images of $D000-$D03F (repeated every $40 bytes)
- $D200-$D2FF - VIC-II - mirror images of $D000-$D03F (repeated every $40 bytes)
- $D300-$D3FF - VIC-II - mirror images of $D000-$D03F (repeated every $40 bytes)

## References
- "vicii_color_registers_border_bg_and_sprite_colors" — expands on using base addresses (e.g., $D020..$D02E) for clarity
