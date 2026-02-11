# KEYBOARD 3 - COMMODORE (KERNAL keyboard decode table)

**Summary:** Third of four KERNAL keyboard decode tables mapping keyboard matrix row/column intersections to Commodore-specific characters (alternate symbol set). Matrix indexed by row written to $DC00 and column read from $DC01; table bytes stored in KERNAL at EC03-EC43 (ends with $FF).

## Description
This table is the "Commodore" (alternate symbol set) keyboard decode table used by the KERNAL. The keyboard matrix is decoded by writing a row mask to CIA1 port A ($DC00) and reading the columns from CIA1 port B ($DC01); the ASCII/code value returned for the pressed key is found at the intersection of that row and column in this table.

- Table size: 8 rows × 8 columns = 64 bytes, followed by a single free byte ($FF).
- Located in this disassembly at addresses EC03–EC43.
- This is the third of four keyboard tables in the KERNAL; other tables include shifted and graphical variants (see references).
- The values in the table are CBM/Commodore character codes (PETSCII/Commodore alternate symbol set) rather than standard ASCII.
- The format and indexing convention are the same as the other keyboard tables: row -> written to $DC00, column <- read from $DC01.

## Source Code
```text
.:EC03 94 8D 9D 8C 89 8A 8B 91
.:EC0B 96 B3 B0 97 AD AE B1 01
.:EC13 98 B2 AC 99 BC BB A3 BD
.:EC1B 9A B7 A5 9B BF B4 B8 BE
.:EC23 29 A2 B5 30 A7 A1 B9 AA
.:EC2B A6 AF B6 DC 3E 5B A4 3C
.:EC33 A8 DF 5D 93 01 3D DE 3F
.:EC3B 81 5F 04 95 A0 02 AB 83
.:EC43 FF                       free byte
```

## Key Registers
- $DC00-$DC0F - CIA 1 - keyboard matrix row output / control (row mask written to $DC00)
- $DC01 - CIA 1 - keyboard matrix column input (columns read from $DC01)

## References
- "keyboard_select_vectors" — vectors pointing to keyboard tables
- "keyboard_table_shifted" — shifted keyboard decode table (shifted symbols)
- "graphics_text_control" — routine that toggles character set (text/graphics) affecting Commodore character mapping