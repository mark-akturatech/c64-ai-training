# Screen Location Table (Screen RAM addresses, row/column → address)

**Summary:** Converts C64 screen row/column to screen RAM addresses (default screen base $0400 / 1024 decimal). Gives the formula and the start address for each row (rows 0–24) and the original appendix layout. Useful for mapping row/column → address and for addressing color RAM correspondence.

## Description
The C64 text screen is 25 rows × 40 columns. Screen RAM default base is $0400 (decimal 1024). The byte address for a character at (row, column) is:

address = $0400 + row * 40 + column
(decimal) address = 1024 + row * 40 + column

Rows are numbered 0..24, columns 0..39. The table below lists the start address (column 0) for each row; the 40 consecutive addresses from that start cover columns 0..39 for that row.

## Source Code
```text
Original appendix layout (visual): each left-hand number is the address for column 0 of that displayed row range.
Row  0: 1024  oooooooooooooooooooooooooooooooooooooooo  (columns 0..39 → 1024..1063)
       1064  oooooooooooooooooooooooooooooooooooooooo
       1104  oooooooooooooooooooooooooooooooooooooooo
       1144  oooooooooooooooooooooooooooooooooooooooo
       1184  oooooooooooooooooooooooooooooooooooooooo
Row  5: 1224  oooooooooooooooooooooooooooooooooooooooo
       1264  oooooooooooooooooooooooooooooooooooooooo
       1304  oooooooooooooooooooooooooooooooooooooooo
       1344  oooooooooooooooooooooooooooooooooooooooo
       1384  oooooooooooooooooooooooooooooooooooooooo
Row 10: 1424  oooooooooooooooooooooooooooooooooooooooo
       1464  oooooooooooooooooooooooooooooooooooooooo
       1504  oooooooooooooooooooooooooooooooooooooooo
       1544  oooooooooooooooooooooooooooooooooooooooo
       1584  oooooooooooooooooooooooooooooooooooooooo
Row 15: 1624  oooooooooooooooooooooooooooooooooooooooo
       1664  oooooooooooooooooooooooooooooooooooooooo
       1704  oooooooooooooooooooooooooooooooooooooooo
       1744  oooooooooooooooooooooooooooooooooooooooo
       1784  oooooooooooooooooooooooooooooooooooooooo
Row 20: 1824  oooooooooooooooooooooooooooooooooooooooo
       1864  oooooooooooooooooooooooooooooooooooooooo
       1904  oooooooooooooooooooooooooooooooooooooooo
       1944  oooooooooooooooooooooooooooooooooooooooo
Row 24: 1984  oooooooooooooooooooooooooooooooooooooooo
         |    |    |    |    |    |    |    |   |
         0    5   10   15   20   25   30   35  39

Summary: each row start address increments by 40 bytes.

Full row start addresses (column 0) — decimal and hex:
Row  0: 1024  = $0400
Row  1: 1064  = $0428
Row  2: 1104  = $0440
Row  3: 1144  = $0458
Row  4: 1184  = $0470
Row  5: 1224  = $0488
Row  6: 1264  = $04A0
Row  7: 1304  = $04B8
Row  8: 1344  = $04D0
Row  9: 1384  = $04E8
Row 10: 1424  = $0500
Row 11: 1464  = $0518
Row 12: 1504  = $0530
Row 13: 1544  = $0548
Row 14: 1584  = $0560
Row 15: 1624  = $0578
Row 16: 1664  = $0590
Row 17: 1704  = $05A8
Row 18: 1744  = $05C0
Row 19: 1784  = $05D8
Row 20: 1824  = $05F0
Row 21: 1864  = $0608
Row 22: 1904  = $0620
Row 23: 1944  = $0638
Row 24: 1984  = $0650

Examples:
- (row=0, col=0) → 1024 ($0400)
- (row=0, col=39) → 1024 + 39 = 1063 ($0427)
- (row=12, col=10) → 1504 + 10 = 1514 ($05EA)

(Use address = 1024 + row*40 + col; row 0..24, col 0..39)
```

## References
- "appendix_d_screen_color_memory_table" — color RAM addresses corresponding to screen locations
