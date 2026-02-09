# COLOR MEMORY (Color RAM) — C64 Text Mode

**Summary:** Color RAM stores per-character color information for the Commodore 64's text screen, which consists of 25 lines by 40 columns, totaling 1,000 character cells. Each screen position references one of 256 character patterns (from character ROM or RAM) and a color from the C64's 16-color palette. The per-character color bytes are stored in Color RAM, located at memory addresses $D800 to $DBE7.

**Overview**

- **Text Screen Layout:** The C64's text screen is organized into 25 lines and 40 columns, resulting in 1,000 character cells.

- **Character Patterns:** Each character cell displays one of 256 possible character patterns, with the character index stored in screen memory.

- **Per-Cell Color:** Each character cell has a corresponding color byte stored in Color RAM. The VIC-II chip reads this color byte alongside the character index to determine the foreground color of the character.

- **Palette:** The C64 provides a palette of 16 hardware colors. The Color RAM holds one color value per screen cell, selecting from this palette.

- **Color RAM Size and Mapping:** Color RAM consists of 1,000 bytes, mapped one-to-one with the 25×40 screen grid. It starts at memory address $D800 and continues sequentially to $DBE7. Only the lower 4 bits (nibble) of each Color RAM byte are used to select the color index (values 0–15); the upper 4 bits are unused and may contain random data.

**Mapping Screen Memory to Color RAM**

In the default configuration, screen memory begins at address $0400 (1024 in decimal), and Color RAM begins at address $D800 (55296 in decimal). Each character cell on the screen corresponds directly to a byte in both screen memory and Color RAM.

- **Screen Memory Address Calculation:**
  - For a character at column X (0–39) and row Y (0–24), the screen memory address is calculated as:
    - Address = $0400 + (Y × 40) + X

- **Color RAM Address Calculation:**
  - The corresponding Color RAM address for the same character cell is:
    - Address = $D800 + (Y × 40) + X

This direct mapping ensures that each character's visual representation and its color attribute are easily accessible and modifiable.

## Key Registers

- **$D800–$DBE7**: Color RAM (memory area) — per-character color bytes for the 25×40 text screen (1,000 bytes; low 4 bits = color index 0–15).

## References

- "vidbas_base_address_notes" — expands on VIDBAS and base-address setup affecting video memory layout
- "vidbas_table_values_text_graphics_base_addresses" — table of VIDBAS values used when relocating text/graphics base addresses