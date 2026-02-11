# Structure of a single directory entry on Commodore disks

**Summary:** Directory entries on Commodore 1541-style disks are 32 bytes long and contain specific fields:

- Byte 0: 128 + file type (bit $80 indicates a properly closed file).
- Bytes 1–2: Track and sector of the first data block.
- Bytes 3–18: Filename (padded with shifted-space characters).
- Bytes 19–20: REL file side-sector pointer (REL files only).
- Byte 21: REL file record size (REL files only).
- Bytes 22–25: Unused.
- Bytes 26–27: Track and sector of replacement file during OPEN@.
- Bytes 28–29: Number of blocks in file (low byte, high byte).

**Layout and field meanings**

- **Byte 0:** Contains 128 + file type. The $80 bit (128) is set when the file was properly closed by the DOS. File type values:
  - 0 = DELeted
  - 1 = SEQuential
  - 2 = PROGram
  - 3 = USER
  - 4 = RELative
- **Bytes 1–2:** Track and sector of the first data block for the file (start pointer into FAT-linked data blocks).
- **Bytes 3–18:** Filename, padded with shifted-space (PETSCII $A0) characters to the fixed filename field length used by the directory entry.
- **Bytes 19–20:** RELative file only: track and sector pointer to the first "side sector" (the side-sector chain used by REL files).
- **Byte 21:** RELative file only: Record size (length of each record).
- **Bytes 22–25:** Unused.
- **Bytes 26–27:** Track and sector of replacement file when OPEN@ is in effect.
- **Bytes 28–29:** Number of blocks in file: two-byte integer, stored as low byte, high byte.

Notes:

- The directory entry is a fixed-size record stored in directory sectors; file data blocks are linked by a track/sector FAT.
- Filenames are stored in PETSCII shifted character set; trailing shifted-spaces ($A0) are padding.
- The $80 (128) flag is a DOS-internal indicator; some utilities rely on it to detect unclosed files.

## Source Code

```text
+---------+----------+--------------------------------------------+
| BYTE    | CONTENTS |              DEFINITION                    |
+---------+----------+--------------------------------------------+
| 0       | 128+type | File type OR'ed with $80 (hexadecimal) to  |
|         |          | indicate properly closed file.             |
|         |          | TYPES: 0 = DELeted                         |
|         |          |        1 = SEQuential                      |
|         |          |        2 = PROGram                         |
|         |          |        3 = USER                            |
|         |          |        4 = RELative                        |
+---------+----------+--------------------------------------------+
| 1,2     |          | Track and sector of 1st data block.        |
+---------+----------+--------------------------------------------+
| 3–18    |          | File name padded with shifted spaces.      |
+---------+----------+--------------------------------------------+
| 19,20   |          | Relative file only: track and sector for   |
|         |          | first side sector block.                   |
+---------+----------+--------------------------------------------+
| 21      |          | Relative file only: Record size.           |
+---------+----------+--------------------------------------------+
| 22–25   |          | Unused.                                    |
+---------+----------+--------------------------------------------+
| 26,27   |          | Track and sector of replacement file when  |
|         |          | OPEN@ is in effect.                        |
+---------+----------+--------------------------------------------+
| 28,29   |          | Number of blocks in file: low byte, high   |
|         |          | byte.                                      |
+---------+----------+--------------------------------------------+
```

**Example Directory Entry in Hexadecimal:**

```text
00: 82 12 01 46 49 4C 45 4E 41 4D 45 A0 A0 A0 A0 A0
10: A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0
20: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
30: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
```

In this example:

- **Byte 0:** $82 (130 decimal) indicates a PROGram file that is properly closed.
- **Bytes 1–2:** $12 $01 (Track 18, Sector 1) point to the first data block.
- **Bytes 3–18:** "FILENAME" in PETSCII, padded with shifted-space ($A0) characters.
- **Bytes 19–29:** Set to $00, as this is not a RELative file.
- **Bytes 28–29:** $00 $00 indicate zero blocks allocated (for illustration purposes).

## References

- "directory_format_structure" — expands on directory sectors and how directory entries are stored
- "relative_file_format" — expands on Relative-file-specific fields inside directory entry