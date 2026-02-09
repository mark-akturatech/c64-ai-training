# CBM DOS Block-Free Command (B-F)

**Summary:** Describes the CBM DOS "Block-Free" (B-F) command for deallocating a single sector in the BAM (block availability map) by setting its bit high (1) on track 18, sector 0; includes command syntax for PRINT# device channel, parameter ranges (drive#, track, sector), alternate colon form, example usage, and a sample BASIC program to deallocate every sector on a diskette.

**Description**
The Block-Free (B-F) command instructs the disk drive DOS to deallocate (free) a specific sector on the disk by setting the corresponding bit to 1 in the BAM located on track 18, sector 0. This command is issued by sending a formatted string to an open command channel (logical file number) connected to the disk drive.

- **Effect:** Deallocates a single sector in the BAM (bit = 1 on track 18, sector 0).
- **Caution:** Running bulk deallocation routines should only be performed on a test diskette due to the risk of data loss.

**Syntax and Parameters**
Two equivalent forms are supported (both sent via PRINT# to an open command channel):

- **Primary form:**

- **Alternate (colon) form:**

**Example:** To free sector 7 on track 1 of drive 0 using command channel 15:

**Parameter ranges and meanings:**
- `file#` — Logical file number of the command channel (the BASIC file handle opened to the device).
- `drive#` — 0 (drive number; single-drive systems typically use 0).
- `track` — 1 to 35 (track number on the disk).
- `sector` — 0 to the per-track sector count for the specified track (varies by track).

## Source Code

  ```basic
  PRINT# file#, "B-F"; drive#; track; sector
  ```

  ```basic
  PRINT# file#, "B-F:"; drive#; track; sector
  ```

```basic
PRINT#15, "B-F";0;1;7
```

```basic
REM Sample BASIC program to deallocate every sector on a diskette

10 OPEN 15,8,15
20 FOR T = 1 TO 35
30   S = 0
40   IF T <= 17 THEN NS = 21
50   IF T > 17 AND T <= 24 THEN NS = 19
60   IF T > 24 AND T <= 30 THEN NS = 18
70   IF T > 30 THEN NS = 17
80   FOR S = 0 TO NS - 1
90     PRINT#15, "B-F:";0;T;S
100   NEXT S
110 NEXT T
120 CLOSE 15
```
**Explanation:**
- **Lines 10-20:** Open the command channel to the disk drive.
- **Lines 30-110:** Loop through each track (`T`) and sector (`S`), sending the B-F command to deallocate each sector.
- **Lines 40-70:** Determine the number of sectors per track (`NS`) based on the track number.
- **Line 120:** Close the command channel.

**Note:** This program deallocates every sector on the disk, effectively erasing all data. Use with caution and only on test diskettes.

## References
- "Inside Commodore DOS" by Richard Immers and Gerald G. Neufeld, Chapter 5.9 Block-Free Command (B-F).