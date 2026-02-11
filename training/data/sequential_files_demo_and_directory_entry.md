# DIRECTORY — Sequential file entry on C-64 DISK BONUS PACK (1541)

**Summary:** This document analyzes the directory entry for the file "DIRECTORY" on the C-64 DISK BONUS PACK, specifically from Track 18, Sector 1. It confirms that sequential files are marked by $81 in the directory, the first data block for this file is at track $11 (decimal 17), sector $01, and the file length is encoded as 02 00 (2 blocks).

**Directory Entry Analysis**

- **File Type Indicator:** The directory entry uses $81 to denote a sequential file.
- **Location:** The "DIRECTORY" entry is found in the directory sector at Track 18, Sector 1.
- **Starting Block:** The entry specifies the file's starting block at track $11 (decimal 17), sector $01.
- **File Length:** The file length field contains 02 00, indicating a size of 2 blocks (02 + 0*256).

The raw directory entry bytes and the textual filename "DIRECTORY" are included in the Source Code section below.

**Notes:**

- The 1541TEST/DEMO disk images contain no sequential files; however, the C-64 DISK BONUS PACK includes one sequential file named "DIRECTORY".
- The source indicates that the starting data block contents will be shown next, but the dump is not present here.

## Source Code

```text
TRACK 18 - SECTOR 01

.20: 00 00 81 11 01 20 20 20
.28: 44 49 52 45 43 54 4F 52  DIRECTOR
.30: 59 20 20 20 40 00 00 00  Y   @...
.38: 00 00 00 00 00 00 02 00
```

In this corrected directory entry:

- **.20:** The first two bytes (00 00) indicate the track and sector of the next directory block. Since both are 00, this is the last directory block.
- **.22:** The file type byte (81) signifies a sequential file that is properly closed.
- **.23-.24:** Track (11) and sector (01) of the first data block.
- **.25-.34:** The filename "DIRECTORY", padded with shifted spaces (A0) to 16 characters.
- **.35-.36:** Track and sector of the first side sector block (not used for sequential files, hence 00 00).
- **.37:** Record length (not applicable for sequential files, set to 00).
- **.38-.39:** Unused bytes (00 00).
- **.40-.41:** Track and sector of the replacement file during an @SAVE or @OPEN (00 00).
- **.42-.43:** Number of blocks in the file: 02 00 (2 blocks).

This structure aligns with the standard directory entry format for the Commodore 1541 disk drive.

## References

- "sequential_file_sector_format" — details the sequential block format (bytes 0-255).
- "sequential_start_block_dump_part1" — provides the starting data block contents for the DIRECTORY file.
