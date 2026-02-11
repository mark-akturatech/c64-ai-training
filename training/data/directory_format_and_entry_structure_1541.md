# Directory format — Track 18, Sector 1 (1540/1541) (Table 5.3)

**Summary:** The directory sector layout for the Commodore 1540/1541 disk drives is organized as follows:

- **Bytes 0–1:** Track and sector pointers to the next directory block.
- **Bytes 2–31, 34–63, 66–95, 98–127, 130–159, 162–191, 194–223, 226–255:** Eight file-entry slots, each occupying 32 bytes.

Each directory entry within these slots has the following structure:

- **Byte 0:** File type, OR'ed with $80 to indicate a properly closed file.
  - Type codes:
    - 0 = DEL (Deleted)
    - 1 = SEQ (Sequential)
    - 2 = PRG (Program)
    - 3 = USR (User)
    - 4 = REL (Relative)
- **Bytes 1–2:** Track and sector of the first data block of the file.
- **Bytes 3–18:** File name, padded with shifted spaces (PETSCII $A0).
- **Bytes 19–20:** For REL files only: Track and sector of the first side-sector block.
- **Byte 21:** For REL files only: Record size.
- **Bytes 22–25:** Unused.
- **Bytes 26–27:** Track and sector of the replacement file when OPEN@ is in effect.
- **Bytes 28–29:** Number of blocks in the file, stored as a two-byte integer in low byte, high byte order.

**Directory layout**

- **Bytes 0–1:** Track and sector of the next directory block.
- **Bytes 2–31:** File entry 1.
- **Bytes 34–63:** File entry 2.
- **Bytes 66–95:** File entry 3.
- **Bytes 98–127:** File entry 4.
- **Bytes 130–159:** File entry 5.
- **Bytes 162–191:** File entry 6.
- **Bytes 194–223:** File entry 7.
- **Bytes 226–255:** File entry 8.

Each file entry occupies 32 bytes, with 2-byte gaps between entries to align them within the 256-byte sector.

**Structure of a single directory entry**

- **Byte 0:** File type OR'ed with $80 to indicate a properly closed file.
  - Type codes:
    - 0 = DEL (Deleted)
    - 1 = SEQ (Sequential)
    - 2 = PRG (Program)
    - 3 = USR (User)
    - 4 = REL (Relative)
- **Bytes 1–2:** Track and sector of the first data block of the file.
- **Bytes 3–18:** File name, padded with shifted spaces (PETSCII $A0).
- **Bytes 19–20:** For REL files only: Track and sector of the first side-sector block.
- **Byte 21:** For REL files only: Record size.
- **Bytes 22–25:** Unused.
- **Bytes 26–27:** Track and sector of the replacement file when OPEN@ is in effect.
- **Bytes 28–29:** Number of blocks in the file, stored as a two-byte integer in low byte, high byte order.

## Source Code

```text
                 Table 5.3: DIRECTORY FORMAT
 +---------------------------------------------------------+
 | Track 18, Sector 1 for 1540/1541                        |
 +---------+-----------------------------------------------+
 | BYTE    |               DEFINITION                      |
 +---------+-----------------------------------------------+
 | 0,1     | Track and sector of next directory block.     |
 +---------+-----------------------------------------------+
 | 2-31    | *File entry 1                                 |
 +---------+-----------------------------------------------+
 | 34-63   | *File entry 2                                 |
 +---------+-----------------------------------------------+
 | 66-95   | *File entry 3                                 |
 +---------+-----------------------------------------------+
 | 98-127  | *File entry 4                                 |
 +---------+-----------------------------------------------+
 | 130-159 | *File entry 5                                 |
 +---------+-----------------------------------------------+
 | 162-191 | *File entry 6                                 |
 +---------+-----------------------------------------------+
 | 194-223 | *File entry 7                                 |
 +---------+-----------------------------------------------+
 | 226-255 | *File entry 8                                 |
 +---------+-----------------------------------------------+

*STRUCTURE OF SINGLE DIRECTORY ENTRY

 +---------+----------+--------------------------------------------+
 | BYTE    | CONTENTS |              DEFINITION                    |
 +---------+----------+--------------------------------------------+
 | 0       | 128+type | File type OR'ed with $80 (hexadecimal) to  |
 |         |          | indicate properly closed file.             |
 |         |          | TYPES: 0 = DELeted                         |
 |         |          |        1 = SEQential                       |
 |         |          |        2 = PROGram                         |
 |         |          |        3 = USER                            |
 |         |          |        4 = RELative                        |
 +---------+----------+--------------------------------------------+
 | 1,2     |          | Track and sector of 1st data block.        |
 +---------+----------+--------------------------------------------+
 | 3-18    |          | File name padded with shifted spaces.      |
 +---------+----------+--------------------------------------------+
 | 19,20   |          | Relative file only: track and sector for   |
 |         |          | first side sector block.                   |
 +---------+----------+--------------------------------------------+
 | 21      |          | Relative file only: Record size.           |
 +---------+----------+--------------------------------------------+
 | 22-25   |          | Unused.                                    |
 +---------+----------+--------------------------------------------+
 | 26,27   |          | Track and sector of replacement file when  |
 |         |          | OPEN@ is in effect.                        |
 +---------+----------+--------------------------------------------+
 | 28,29   |          | Number of blocks in file: low byte, high   |
 |         |          | byte.                                      |
 +---------+----------+--------------------------------------------+
```

## References

- "bam_format_track18_sector0_1541" — expands on BAM and how free blocks are referenced by directory entries
- "sequential_file_format_1541" — expands on SEQ file type and sequential data block format
- "program_file_format_1541" — expands on PRG file type and program-block format