# Reading the Disk Error Channel from BASIC (OPEN 15 / INPUT# 15)

**Summary:** How to read the disk drive error channel from BASIC using OPEN 15 and INPUT# 15 (command channel on device 8); explains the four returned variables (error number, message text, track, block) and notes that track 18 relates to BAM/directory.

## Description
To read the disk error channel you must use INPUT# from within a BASIC program (INPUT# does not work at the immediate prompt). Open the drive command channel and perform an INPUT# which returns up to four variables describing the last disk error.

Returned fields:
- 1st: error number (numeric). 0 = no error.
- 2nd: error message text (string).
- 3rd: track number where the error occurred (numeric).
- 4th: block (sector) number within that track (numeric).

Common note: errors reported on track 18 refer to the BAM and the directory. For example, a READ ERROR on track 18, block 0 can indicate an unformatted disk.

## Source Code
```basic
10 OPEN 15, 8, 15
20 INPUT# 15, A$, B$, C$, D$
30 PRINT A$, B$, C$, D$
```

## References
- "dos_support_wedge_and_shortcuts" — expands on DOS Support program automates reading the error channel
- "appendix_b_detailed_error_descriptions_part1" — lookup of error numbers and detailed explanations