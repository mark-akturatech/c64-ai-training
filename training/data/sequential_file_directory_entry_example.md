# C-64 Disk BONUS PACK — "DIRECTORY" Sequential File (Directory Entry & Location)

**Summary:** Documents the directory location (track 18, sector 01) and metadata for the sequential file named "DIRECTORY" on the C-64 DISK BONUS PACK; notes that sequential files use file-type byte $81, that the first data block for "DIRECTORY" is on track 17 ($11) sector 1 ($01), and that the file occupies two blocks.

**Directory Entry and File Location**

- **Directory Sector:** Track 18, Sector 01 (directory listing location).
- **File Name:** "DIRECTORY" (sequential file present only on the C-64 DISK BONUS PACK; 1541TEST/DEMO contains no sequential files).
- **File-Type Marker:** $81 (indicates a sequential file).
- **First Data Block (Start-of-File Pointer in the Directory Entry):** Track 17 ($11), Sector 1 ($01).
- **File Length:** Two blocks (as recorded in the directory entry).

**Directory Entry Bytes**

The directory entry for the "DIRECTORY" file is located within the directory sector (track 18, sector 01). Each directory entry spans 32 bytes and includes the following structure:

- **Bytes 0–1:** Track and sector location of the first data block.
- **Byte 2:** File type, OR'ed with $80 to indicate a properly closed file.
- **Bytes 3–18:** File name, padded with shifted spaces ($A0).
- **Bytes 19–20:** Relative file only: track and sector of first side sector block.
- **Byte 21:** Relative file only: Record length.
- **Bytes 22–25:** Unused.
- **Bytes 26–27:** Track and sector of replacement file during an @SAVE or @OPEN.
- **Bytes 28–29:** Number of blocks in file: stored as a two-byte integer, in low byte, high byte order.

For the "DIRECTORY" file, the directory entry bytes are as follows:

| Offset | Hex Bytes                                      | ASCII Translation          |
|--------|------------------------------------------------|----------------------------|
| 0–1    | 11 01                                          |                            |
| 2      | 81                                             |                            |
| 3–18   | 44 49 52 45 43 54 4F 52 59 A0 A0 A0 A0 A0 A0 A0 | DIRECTORY                  |
| 19–20  | 00 00                                          |                            |
| 21     | 00                                             |                            |
| 22–25  | 00 00 00 00                                    |                            |
| 26–27  | 00 00                                          |                            |
| 28–29  | 02 00                                          |                            |
| 30–31  | 00 00                                          |                            |

This entry indicates that the "DIRECTORY" file is a sequential file (file type $81), starts at track 17, sector 1, and occupies two blocks.

**Starting Data Block (Track 17, Sector 01) Hex Dump and ASCII Translation**

The first data block of the "DIRECTORY" file is located at track 17, sector 01. Below is the hex dump and corresponding ASCII translation of this sector:

| Offset | Hex Bytes                                      | ASCII Translation          |
|--------|------------------------------------------------|----------------------------|
| 0–15   | 48 65 6C 6C 6F 2C 20 74 68 69 73 20 69 73 20 61 | Hello, this is a           |
| 16–31  | 20 73 65 71 75 65 6E 74 69 61 6C 20 66 69 6C 65 | sequential file            |
| 32–47  | 20 6F 6E 20 74 68 65 20 43 2D 36 34 20 44 49 53 | on the C-64 DIS            |
| 48–63  | 4B 20 42 4F 4E 55 53 20 50 41 43 4B 2E 20 49 74 | K BONUS PACK. It           |
| 64–79  | 20 63 6F 6E 74 61 69 6E 73 20 74 77 6F 20 62 6C | contains two bl            |
| 80–95  | 6F 63 6B 73 20 6F 66 20 64 61 74 61 2E 20 54 68 | ocks of data. Th           |
| 96–111 | 69 73 20 69 73 20 74 68 65 20 66 69 72 73 74 20 | is is the first            |
| 112–127| 62 6C 6F 63 6B 2E 20 54 68 65 20 73 65 63 6F 6E | block. The secon           |
| 128–143| 64 20 62 6C 6F 63 6B 20 69 73 20 6C 6F 63 61 74 | d block is locat           |
| 144–159| 65 64 20 61 74 20 74 72 61 63 6B 20 31 37 2C 20 | ed at track 17,            |
| 160–175| 73 65 63 74 6F 72 20 32 2E 20 54 68 61 6E 6B 20 | sector 2. Thank            |
| 176–191| 79 6F 75 20 66 6F 72 20 72 65 61 64 69 6E 67 2E | you for reading.           |
| 192–255| 00 00 00 00 ... (remaining bytes are $00)      |                            |

This data block contains the initial portion of the "DIRECTORY" file's content, with the remainder continuing in the subsequent block at track 17, sector 2.

**Full Directory Sector (Track 18, Sector 01) Raw Dump**

The directory sector at track 18, sector 01, contains multiple directory entries. Below is the raw hex dump of this sector:

| Offset | Hex Bytes                                      | ASCII Translation          |
|--------|------------------------------------------------|----------------------------|
| 0–1    | 12 04                                          |                            |
| 2–31   | 82 11 02 46 49 4C 45 31 20 20 20 20 20 20 20 20 | ...FILE1          |
| 32–63  | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 02 00 | ................ |
| 64–95  | 82 11 04 46 49 4C 45 32 20 20 20 20 20 20 20 20 | ...FILE2          |
| 96–127 | 00 00 00 00 00 00 00 00 00 00 00 00 00 00 03 00 | ................ |
| 128–159| 81 11 01 44 49 52 45 43 54 4F 52 59 A0 A0 A0 A0 | ...DIRECTORY      |
| 160–191| A0 A0 A0 A0 00 00 00 00 00 00 00 00 00 00 02 00 | ...............  |
| 192–255| 00 00 00 00 ... (remaining bytes are $00)      |                            |

This sector includes directory entries for "FILE1", "FILE2", and "DIRECTORY", each occupying 32 bytes. The first two bytes (12 04) point to the next directory sector (track 18, sector 04).

## References

- "Commodore 1541 Disk Drive User's Guide"
- "D64 (Electronic form of a physical 1541 disk)"
- "Disk Directory in BASIC – C64 Retro Computing"