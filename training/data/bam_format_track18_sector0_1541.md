# BAM (Block Availability Map) — 1540/1541 Track 18, Sector 0

**Summary:** BAM layout for the Commodore 1540/1541 disk image stored at Track 18, Sector 0: bytes 0–1 point to the first directory block, byte 2 = ASCII 'A' (4040 format), byte 3 is a reserved/null flag, and bytes 4–143 contain the bit map of available blocks for tracks 1–35 (1 = available, 0 = not available).

## Layout and definitions
Bytes are numbered 0..255 within the sector; this BAM covers bytes 0–143 of Track 18, Sector 0.

- Bytes 0–1: Track and sector pointer to the first directory block (example values in the source: 18,01).
- Byte 2: Value 65 (ASCII 'A') used to indicate 4040/1541 disk format signature.
- Byte 3: Reserved / null flag for DOS use (normally 0).
- Bytes 4–143: Bit map representing block availability for tracks 1–35; each bit corresponds to one block: 1 = available, 0 = not available. (Bits are packed; each byte contains 8 block bits.)

The table below reproduces the BAM format definition for reference.

## Source Code
```text
                 Table 5.1: 1540/1541 BAM FORMAT
 +-----------------------------------------------------------------+
 | Track 18, Sector 0.                                             |
 +-------+----------+----------------------------------------------+
 | BYTE  | CONTENTS |                DEFINITION                    |
 +-------+----------+----------------------------------------------+
 | 0,1   | 18,01    | Track and sector of first directory block.   |
 +-------+----------+----------------------------------------------+
 | 2     | 65       | ASCII character A indicating 4040 format.    |
 +-------+----------+----------------------------------------------+
 | 3     | 0        | Null flag for future DOS use.                |
 +-------+----------+----------------------------------------------+
 | 4-143 |          | Bit map of available blocks for tracks 1-35. |
 +-------+----------+----------------------------------------------+
 | *1 = available block                                            |
 |  0 = block not available                                        |
 |      (each bit represents one block)                            |
 +-----------------------------------------------------------------+
```

## References
- "directory_header_track18_sector0_1541" — expands on Disk name/ID and header fields stored in Track 18, Sector 0  
- "directory_format_and_entry_structure_1541" — expands on directory block format and directory entries pointed to by the BAM's first-directory-block pointer