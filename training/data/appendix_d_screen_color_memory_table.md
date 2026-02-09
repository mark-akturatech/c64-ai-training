# Appendix D: Screen Color Memory Table

**Summary:** Color RAM starts at 55296 = $D800; this table lists the base addresses (column 0) for each screen character row (0–24). Use Address(row,col) = $D800 + row*40 + col to POKE per-character foreground color values (columns 0..39, rows 0..24).

## Screen Color Memory Table
The table below shows the decimal and hex base address for column 0 of each character row (25 rows). Each subsequent column in that row is the base plus the column index (0..39). The screen uses 25 rows × 40 columns = 1000 used bytes within the color RAM block starting at $D800.

- Address formula: Address(row, col) = $D800 + row*40 + col
- Row range: 0..24
- Column range: 0..39

## Source Code
```text
# Color RAM base addresses (column 0) by screen row
# Decimal    Hex     Row
55296   $D800   row 0
55336   $D828   row 1
55376   $D850   row 2
55416   $D878   row 3
55456   $D8A0   row 4

55496   $D8C8   row 5
55536   $D8F0   row 6
55576   $D918   row 7
55616   $D940   row 8
55656   $D968   row 9

55696   $D990   row 10
55736   $D9B8   row 11
55776   $D9E0   row 12
55816   $DA08   row 13
55856   $DA30   row 14

55896   $DA58   row 15
55936   $DA80   row 16
55976   $DAA8   row 17
56016   $DAD0   row 18
56056   $DAF8   row 19

56096   $DB20   row 20
56136   $DB48   row 21
56176   $DB70   row 22
56216   $DB98   row 23
56256   $DBC0   row 24

# Usage note:
# To set the color of character at (row, col): POKE ($D800 + row*40 + col), color_value
# Columns run left-to-right 0..39
```

## Key Registers
- $D800-$DBFF - Color RAM - per-character foreground color bytes (25 rows × 40 cols = 1000 used bytes within this 1 KB region)

## References
- "appendix_e_screen_color_codes" — color values to POKE into color RAM (Appendix E)