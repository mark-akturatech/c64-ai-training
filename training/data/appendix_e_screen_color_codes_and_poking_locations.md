# Appendix E — Screen Color Codes and Where to POKE Them

**Summary:** Low-nybble, high-nybble, and multicolor-select numeric values for the 16 C64 colors, and the addresses to POKE them for Regular text, Multicolor text, Extended color text, Bitmapped, and Multicolor bitmapped modes (addresses $D020-$D024, color RAM $D800, screen memory $0400). Explains extended-color bits (bits 6–7 of screen memory) and how bitmap modes OR high/low nybbles.

## Color codes
Low-nybble = color value 0..15 (use as-is). High-nybble = value << 4 (same value in high 4 bits). Multicolor-select values exist only for the first 8 colors (used in multicolor character modes).

- Low nybble: use lower 4 bits of byte
- High nybble: use upper 4 bits (value * 16)
- Multicolor-select: values 8..15 (select multicolor for color RAM entries when mode requires)

## Where to POKE color values (mode → bit/bit-pair → location → which nybble to use)
- Border color: POKE 53280 ($D020) with the low-nybble color value (applies to all modes).
- Regular text:
  - bit 0 → POKE 53281 ($D021) with low nybble
  - bit 1 → POKE Color RAM ($D800-$DBFF) with low nybble
- Multicolor text:
  - bit-pair 00 → POKE 53281 ($D021) low nybble
  - bit-pair 01 → POKE 53282 ($D022) low nybble
  - bit-pair 10 → POKE 53283 ($D023) low nybble
  - bit-pair 11 → POKE Color RAM ($D800-$DBFF) select multicolor value (8..15)
- Extended-color text:
  - bit-pair 00 → POKE 53281 ($D021) low nybble
  - bit-pair 01 → POKE 53282 ($D022) low nybble
  - bit-pair 10 → POKE 53283 ($D023) low nybble
  - bit-pair 11 → POKE 53284 ($D024) low nybble
  - Notes: In extended color mode, bits 6 and 7 of each byte of screen memory ($0400-$07FF) serve as the bit-pair controlling background color. Only bits 0–5 remain for character selection (screen codes 0–63).
- Bitmapped (hi/lo nybble usage):
  - bit 0 → POKE Screen memory ($0400-$07FF) with low nybble
  - bit 1 → POKE Screen memory ($0400-$07FF) with high nybble
  - In bitmap modes the high and low nybble color values are ORed together and POKEd into the same screen-memory location to control the colors of that bitmap cell. Example: to control cell 0 of the bitmap, OR the high and low nybbles and POKE the result into location $0400 (decimal 1024).
- Multicolor bitmapped:
  - bit-pair 00 → POKE 53281 ($D021) low nybble
  - bit-pair 01 → POKE Screen memory ($0400-$07FF) high nybble (OR with low nybble where applicable)
  - bit-pair 10 → POKE Screen memory ($0400-$07FF) low nybble (OR with high nybble where applicable)
  - bit-pair 11 → POKE Color RAM ($D800-$DBFF) low nybble

## Source Code
```text
Value to POKE for Each Color

             Low nybble    High nybble   Select multicolor
Color        color value   color value   color value

Black         0              0            8
White         1             16            9
Red           2             32           10
Cyan          3             48           11
Purple        4             64           12
Green         5             80           13
Blue          6             96           14
Yellow        7            112           15
Orange        8            128           --
Brown         9            144           --
Light Red    10            160           --
Dark Gray    11            176           --
Medium Gray  12            192           --
Light Green  13            208           --
Light Blue   14            224           --
Light Gray   15            240           --

Where To POKE Color Values For Each Mode

                 Bit or
Mode *           bit-pair   Location        Color value

Regular text      0         53281           Low nybble
                  1         Color memory    Low nybble
Multicolor text  00         53281           Low nybble
                 01         53282           Low nybble
                 10         53283           Low nybble
                 11         Color memory    Select Multicolor
Extended color   00         53281           Low nybble
text +           01         53282           Low nybble
                 10         53283           Low nybble
                 11         53284           Low nybble
Bitmapped         0         Screen memory   Low nybble ++
                  1         Screen memory   High nybble ++
Multicolor       00         53281           Low nybble
bitmapped        01         Screen memory   High nybble ++
                 10         Screen memory   Low nybble ++
                 11         Color memory    Low nybble

* For all modes, the screen border color is controlled by POKEing
location 53280 with the low nybble color value.

+ In extended color mode, Bits 6 and 7 of each byte of screen memory
serve as the bit-pair controlling background color.  Because only Bits
0-5 are available for character selection, only characters with screen
codes 0-63 can be used in this mode.

++ In the bitmapped modes, the high and low nybble color values are
ORed together and POKEd into the same location in memory to control
the colors of the corresponding cell in the bitmap.  For example, to
control the colors of cell 0 of the bitmap, OR the high and low
nybbles and POKE the result into location 0 of screen memory.
```

(Address conversions for reference: 53280 = $D020, 53281 = $D021, 53282 = $D022, 53283 = $D023, 53284 = $D024; Color RAM 53248+512 = $D800–$DBFF; Screen memory base 1024 = $0400.)

## Key Registers
- $D020 - VIC-II - Border color (POKE low nybble)
- $D021-$D024 - VIC-II - Background/color control registers (used as bit/bit-pair targets per mode)
- $D800-$DBFF - Color RAM - character color entries (low nybble; multicolor-select used in some modes)
- $0400-$07FF - Screen memory - screen codes (and in bitmap/extended modes: cell color bytes; bits 6–7 used as extended color bit-pair)

## References
- "appendix_d_screen_color_memory_table" — expands on using these addresses with the listed color codes