# Screen line low-byte table in C64 ROM ($ECF0-$ED08)

**Summary:** ROM data at $ECF0-$ED08 containing the low-order bytes of start addresses for each screen line (25 entries) used by the VIC-II / C64 screen initialization and 25/24-row display mapping.

## Description
This ROM table holds the low-order bytes of the base addresses for each character/screen line used by the screen layout code (VIC-II initialization values). The table contains 25 bytes (one per text row for a 25-row layout); each byte is the low byte of the memory address where that screen line begins. The VIC-II (and ROM routines) combine these low bytes with a corresponding high-byte calculation to form full 16-bit line base addresses used when mapping character rows to video memory.

Do not modify these bytes at runtime unless you know the intended memory layout — they are part of the ROM's display initialization and mapping logic.

## Source Code
```text
                                *** low bytes of screen line addresses
.:ECF0 00 28 50 78 A0 C8 F0 18
.:ECF8 40 68 90 B8 E0 08 30 58
.:ED00 80 A8 D0 F8 20 48 70 98
.:ED08 C0
```

## References
- "vicii_initialization_values" — VIC-II initialization and screen memory layout values
