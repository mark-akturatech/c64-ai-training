# Disk Directory — File Entry #5 (Raw Hex + ASCII Dump, Decoded)

**Summary:** This document provides a detailed analysis of a Commodore 64 disk directory entry, specifically File Entry #5. It includes a raw hex and ASCII dump, highlighting PETSCII/ASCII filename bytes, padding bytes, and numeric values. The analysis addresses OCR artifacts and maps byte offsets to their respective directory fields.

**Decoded Content**

This section presents a raw sector dump for directory File Entry #5, with key observations:

- **Filename and Version:** The dump contains the ASCII string "DOS" followed by "5.1" (hex bytes 35 2E 31 = ASCII '5' '.' '1').
- **Padding Bytes:** The filename is padded with PETSCII space characters ($A0).
- **Zero Bytes:** Zero bytes are represented as $00.
- **Other Hex Bytes:** Additional hex bytes present include 88, 90, 98, 04, 82, 13, 03.

The directory entry is 32 bytes long, with each byte serving a specific purpose. Below is the breakdown of the byte offsets and their corresponding fields:

| Offset | Field Description                          | Value        | Notes                                                                 |
|--------|--------------------------------------------|--------------|-----------------------------------------------------------------------|
| 0      | Track of first sector of file              | 88           | Indicates the track number where the file's data begins.              |
| 1      | Sector of first sector of file             | 20           | Indicates the sector number where the file's data begins.             |
| 2      | File type                                  | 35           | Represents the file type; 35 corresponds to 'PRG' (program file).     |
| 3-18   | Filename (16 bytes)                        | 2E 31 A0...  | PETSCII encoded filename, padded with $A0 (PETSCII space).            |
| 19-20  | Unused                                     | 00 00        | Typically set to $00.                                                 |
| 21-22  | File size in sectors (little-endian)       | 98 00        | Indicates the file's size in sectors; here, 152 sectors.              |
| 23-30  | Unused                                     | 00 00 00...  | Typically set to $00.                                                 |
| 31     | Unused                                     | 00           | Typically set to $00.                                                 |

**Note:** The PETSCII space character ($A0) is used for padding filenames to 16 bytes.

## Source Code

```text
Original raw dump (as provided):

 DOS 

FILE 

ENTRY 

#5 

88- 

.  20 

35 

2E 

31 

AO 

AO 

AO 

AO 

5.  1 

90: 

AO 

AO 

AO 

AO 

AO 

OO 

OO 

OO 

98- 

.  00 

oo 

00 

00 

OO 

OO 

04 

OO 

AO: 

:  oo 

OO 

82 

13 

03 

43 

4F 

50
```

```text
Cleaned / OCR-corrected tokens (likely interpretations; AO->A0, OO/oo->00):

88 20 35 2E 31 A0 A0 A0 A0 35 2E 31 90 A0 A0 A0 A0 A0 00 00 00 98 00 00 00 00 00 04 00 A0 00 00 00 82 13 03 43 4F 50

Notes:
- 35 2E 31 = ASCII "5.1"
- 43 4F 50 = ASCII "COP"
- A0 = PETSCII space (filename padding)
- 00 = zero byte
```

## References

- "file_entry_c-6_wedge_#4" — expands on previous directory/file entry (ENTRY #4)
- "file_entry_cdf_#6" — expands on next directory/file entry (ENTRY #6)
