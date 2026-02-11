# Table 7-3. The Bytes of Graphics Memory as Organized with Regard to the Screen.

**Summary:** Table 7-3 illustrates the organization of graphics memory in relation to screen positions on the Commodore 64. The screen consists of 25 rows, each containing 40 columns, totaling 1000 character positions. Screen memory starts at address $0400 (decimal 1024) and ends at $07E7 (decimal 2023). Each byte in this range corresponds to a specific character position on the screen.

**Description**

The screen memory is organized sequentially from left to right and top to bottom. Each row contains 40 bytes, corresponding to the 40 columns on the screen. The first row begins at address $0400, the second row at $0428, and so on, with each subsequent row starting 40 bytes after the previous one. This pattern continues for all 25 rows, covering the entire screen.

## Source Code

The following table maps screen memory addresses to their corresponding screen positions:

```text
Screen Position  | Memory Address
-----------------|---------------
Row 0, Column 0  | $0400
Row 0, Column 1  | $0401
...              | ...
Row 0, Column 39 | $0427
Row 1, Column 0  | $0428
Row 1, Column 1  | $0429
...              | ...
Row 1, Column 39 | $0457
...              | ...
Row 24, Column 0 | $07C0
Row 24, Column 1 | $07C1
...              | ...
Row 24, Column 39| $07E7
```

This pattern repeats for each row, with the starting address of each row calculated as:

`Starting Address = $0400 + (Row Number * 40)`

For example, the starting address for Row 12 is:

`$0400 + (12 * 40) = $0400 + $01E0 = $05E0`

Therefore, Row 12 begins at address $05E0.

## References

- "Commodore 64 Programmer's Reference Guide," Chapter 3: Programming Graphics, Section "Graphics Locations."
- "Commodore 64 User's Guide," Chapter 5: Advanced Color and Graphics, Section "Screen Memory."