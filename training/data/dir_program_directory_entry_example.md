# Directory entry for "DIR" — 1541TEST/DEMO (track 18, sector 04)

**Summary:** This chunk provides a detailed examination of a 32-byte directory entry for the file named "DIR" on a Commodore 1541 disk, located at track 18, sector 04. The entry specifies the file's starting track and sector, as well as its size in blocks.

**Entry description**

This directory entry is part of the disk's directory structure, which is stored on track 18. Each directory sector can contain up to eight 32-byte entries. The first two bytes of each directory sector are used to link to the next directory sector, forming a linked list of directory entries. In this case, the directory entry for the file "DIR" is located within track 18, sector 04.

Key fields in the directory entry:

- **File Type and Flags:** The first byte indicates the file type and status. A value of $82 signifies a PRG (program) file that is closed and unlocked.

- **Start Track and Sector:** Bytes 1 and 2 (offsets $01 and $02) specify the starting location of the file's data. In this entry, the values are $10 and $01, corresponding to track 16 and sector 1.

- **Filename:** Bytes 3 to 18 (offsets $03 to $12) contain the filename in PETSCII, padded with shifted spaces ($A0) if the name is shorter than 16 characters. Here, the filename is "DIR", represented by the PETSCII codes $44, $49, $52, followed by 13 padding bytes of $A0.

- **File Size in Blocks:** Bytes 30 and 31 (offsets $1E and $1F) store the file size in blocks as a little-endian 16-bit integer. The values $04 and $00 indicate that the file occupies 4 blocks.

The first two bytes of the sector (offsets $00 and $01) are used to link to the next directory sector. In this case, the values are $00 and $FF, indicating that this is the last directory sector.

## Source Code

```text
Original (as provided; contains OCR/artifact characters):

TRACK   18  -  SECTOR  04

.    00:    00  FF  82   10  01   44  49  52   DIR
.    08:    AO  AO  AO  AO  AO  AO  AO  AO
.    10:    AO  AO  AO  AO  AO  00  OO  00
.    18:    00  00  00  00  00  00  04  OO

Corrected / cleaned-up version:

.  00:  00  FF  82   10  01  44  49  52  A0  A0  A0  A0  A0  A0  A0
.  10:  A0  A0  A0  A0  A0  A0  A0  A0  A0  A0  A0  A0  A0  04  00

Interpreted fields in the cleaned layout:
- **Next Directory Track/Sector:** Bytes 0-1: $00 $FF (no next directory sector).
- **File Type and Flags:** Byte 2: $82 (PRG file, closed, unlocked).
- **Start Track/Sector:** Bytes 3-4: $10 $01 (track 16, sector 1).
- **Filename:** Bytes 5-20: $44 $49 $52 followed by 13 bytes of $A0 ("DIR").
- **File Size in Blocks:** Bytes 30-31: $04 $00 (4 blocks).
```

## References

- "directory_block_04_dump_part1_bytes_00_1F" — expands on the 'DIR' entry appearing in that sector dump.
- "program_file_following_sectors_and_last_sector_layout" — expands on how this directory entry maps to the file's data blocks.
