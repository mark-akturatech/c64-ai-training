# Standard bitmapped mode (YSCRL bit 5 / $D011)

**Summary:** Standard bitmapped mode is enabled by setting bit 5 of the YSCRL register ($D011) (VIC-II). Use the GRAPH macro to set bit 5 and the TEXT macro to clear it; in this mode per-8x8 block colors are taken from text (screen) memory (high 4 bits = pixel-on color, low 4 bits = pixel-off/background color). Color RAM is not used in standard bitmap mode.

## Description
Set bit 5 of YSCRL ($D011) to enable the standard bitmapped mode; clear bit 5 to disable it. The provided macros perform these operations:
- GRAPH — sets bit 5 of YSCRL ($D011) to enable standard bitmap mode.
- TEXT — clears bit 5 of YSCRL ($D011) to return to text mode.

In standard bitmapped mode:
- Color information is stored in text (screen) memory on an 8x8 pixel block basis.
- Each text-memory byte contains two 4-bit nibbles:
  - High 4 bits = color used when the corresponding graphics pixel bit is 1.
  - Low 4 bits  = background color used when the corresponding graphics pixel bit is 0.
- The separate Color RAM ($D800) is not used for block colors while in standard bitmapped mode.

## Key Registers
- $D011 - VIC-II - YSCRL (Vertical fine scroll / bitmap enable): bit 5 = standard bitmap mode enable/disable (GRAPH sets, TEXT clears)

## References
- "bitmapped_graphics_overview" — expands on mode resolution and memory needs
- "graphics_memory_byte_organization_table" — shows how graphics memory bytes map to screen rows

## Labels
- YSCRL
