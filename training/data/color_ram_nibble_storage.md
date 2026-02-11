# Color RAM (Commodore 64)

**Summary:** Color RAM resides at $D800–$DBE7 and stores 4-bit per-cell values (nibbles). Reads return a full byte, but only the low 4 bits are valid—mask the upper 4 bits (AND #$0F) before use. In multicolor text/bitmap modes, the lower 3 bits are used specially (see references).

**Description**

Color RAM is a separate 1 KB memory area used to store character/foreground colors for the screen. Unlike normal RAM bytes, each cell contains only 4 bits of defined data; when read from memory, you will receive an 8-bit value where only bits 0–3 are meaningful, and bits 4–7 are unpredictable. Typical code must mask the value (e.g., AND #$0F) before using it.

Color RAM is used by text and bitmap display modes:

- In standard text/bitmap modes, the 4-bit value selects one of the 16 hardware colors.
- In multicolor text/bitmap modes, the lower 3 bits are treated differently (see referenced chunks for the mapping details).

**Note:** The source lists the end address as $DBE7, which is correct. The color RAM spans from $D800 to $DBE7, covering 1000 bytes (40 columns × 25 rows). The addresses $DBE8–$DBFF are unused. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Color_RAM?utm_source=openai))

## Key Registers

- $D800–$DBE7: Color RAM—4-bit per screen cell (low 4 bits valid on read); used for character/foreground colors (1 KB)

## References

- "multicolor_text_bitpair_mapping"—expands on lower 3 bits of color RAM used in multicolor text mode
- "multicolor_bitmapped_mode"—expands on color RAM usage in multicolor bitmap mode

## Labels
- COLOR_RAM
