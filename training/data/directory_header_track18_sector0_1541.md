# 1540/1541 Directory Header — Track 18, Sector 0 (Bytes 144–255)

**Summary:** Directory header format stored on Track 18, Sector 0 of Commodore 1540/1541 disks: disk name (bytes 144–161), disk ID (162–163), shifted spaces and DOS/version bytes (164–170), and unused nulls (171–255). Searchable terms: Track 18, Sector 0, directory header, disk name, disk ID, 1541, DOS version bytes.

**Directory header description**
This chunk documents the fixed-location directory header area found in the sector that also contains the BAM (Track 18, Sector 0). The header occupies the byte ranges within the 256-byte sector as listed below:

- **Bytes 144–161:** Disk name, padded with shifted-space (PETSCII 160) characters to fill the field.
- **Bytes 162–163:** Disk ID (two bytes).
- **Byte 164:** Shifted space (PETSCII 160).
- **Bytes 165–166:** ASCII representation for the DOS version/format type, typically "2A" (PETSCII 50, 65).
- **Bytes 167–170:** Shifted spaces (PETSCII 160).
- **Bytes 171–255:** Unused nulls (0x00).
- **Note:** Some diskettes may contain the ASCII string "BLOCKS FREE" in bytes 180–191. This is a nonstandard addition used on some disks to indicate the number of free blocks available. ([bitsavers.trailing-edge.com](https://bitsavers.trailing-edge.com/pdf/commodore/The_Anatomy_of_the_1541_Disk_Drive_Jun84.pdf?utm_source=openai))

This header is distinct from the directory entries themselves (which are stored in directory blocks pointed to by a BAM pointer in the same sector). The bytes listed are offsets within the 256-byte sector (0–255).

## Source Code
```text
                 Table 5.2: 1540/1541 DIRECTORY HEADER
 +-----------------------------------------------------------------+
 | Track 18, Sector 0.                                             |
 +---------+----------+--------------------------------------------+
 | BYTE    | CONTENTS |              DEFINITION                    |
 +---------+----------+--------------------------------------------+
 | 144-161 |          | Disk name padded with shifted spaces.      |
 +---------+----------+--------------------------------------------+
 | 162-163 |          | Disk ID.                                   |
 +---------+----------+--------------------------------------------+
 | 164     | 160      | Shifted space.                             |
 +---------+----------+--------------------------------------------+
 | 165,166 | 50,65    | ASCII representation for 2A which is DOS   |
 |         |          | version and format type.                   |
 +---------+----------+--------------------------------------------+
 | 167-170 | 160      | Shifted spaces.                            |
 +---------+----------+--------------------------------------------+
 | 171-255 | 0        | Nulls, not used.                           |
 +---------+----------+--------------------------------------------+
 | Note: ASCII characters "BLOCKS FREE" may appear in locations    |
 |       180 thru 191 on some diskettes.                           |
 +-----------------------------------------------------------------+
```

## References
- "bam_format_track18_sector0_1541" — BAM resides in the same sector and contains the pointer to the first directory block
- "directory_format_and_entry_structure_1541" — Relationship between this header and the directory entries stored in Track 18 sectors