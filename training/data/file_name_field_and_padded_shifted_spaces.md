# Directory filename field — 16-byte name padded with $A0 (shifted-space)

**Summary:** Commodore 1541/CBM DOS directory entries store file names as a 16-byte PETSCII field padded with shifted-space ($A0) characters; internal normal spaces ($20) remain part of the name, but trailing $A0 padding is not shown in directory listings (example: "HOW TO USE").

**Filename field format**
- The directory entry contains a 16-byte filename field (PETSCII). When a name is shorter than 16 characters, the remaining bytes are filled with shifted-space ($A0) bytes.
- Shifted-space ($A0) is distinct from the normal ASCII/PETSCII space ($20). Internal/intentional spaces in the name use $20 and do display; trailing $A0 bytes are padding and do not display in directory listings.
- The directory entry also stores the file's starting track and sector immediately adjacent to the filename field; in the example shown the file starts on track $11 (17) and sector $00 (0).
- Example name "HOW TO USE" in PETSCII bytes:
  - Letters and internal spaces: 48 4F 57 20 54 4F 20 55 53 45 (H O W ␠ T O ␠ U S E)
  - Padded to 16 bytes with $A0: A0 A0 A0 A0 A0 A0
  - Combined 16-byte filename field: 48 4F 57 20 54 4F 20 55 53 45 A0 A0 A0 A0 A0 A0

## Source Code
```text
Original (source had OCR-style markers like "OO"/"AO"):

.  18:  OO  00  00  00  OO 

48  4F  57  HOW 

53  45  AO     TO  USE 
OO  OO  OO   

OO  OD  OO  . ;  


This  file  starts  on  track  17  ($11),  sector  0  ($00). 

...
OO:    12  04  82   11   OO  48  4F  57  HOW 

**  **  ** 

OB:    20  54  4F  20  55  53  45  AO     TO  USE 

♦»  »♦ 

10:    AO  AO  AO  AO  AO  OO  OO  OO   

18:    OO  OO  OO  OO  OO  OO  OD  OO   

.   00:    12  04  82  11  00  48  4F  57  HOW 
.    08:    20  54  4F  20  55  53  45  AO     TO  USE 
.    10:    AO  AO  AO  AO  AO  OO  OO  OO   
```

Normalized interpretation (cleaned hex / PETSCII):

```text
Partial directory entry (normalized view, showing start track/sector + 16-byte filename field):

... 12 04 82 11 00  48 4F 57 20 54 4F 20 55 53 45 A0 A0 A0 A0 A0 A0 ...

- 11 ($11) = starting track (17)
- 00 ($00) = starting sector (0)
- Filename bytes (16): 48 4F 57 20 54 4F 20 55 53 45 A0 A0 A0 A0 A0 A0
  ASCII/PETSCII: "HOW␠TO␠USE" + six $A0 (shifted-space) padding
```

**Full 32-byte directory entry context**

Each directory entry in a Commodore 1541 disk directory occupies 32 bytes, structured as follows:

- **Byte 0:** File type, OR'ed with $80 to indicate a properly closed file.
  - Bit 0-3: File type (0 = DEL, 1 = SEQ, 2 = PRG, 3 = USR, 4 = REL)
  - Bit 6: Locked flag (set if file is locked)
  - Bit 7: Closed flag (set if file is properly closed)
- **Bytes 1-2:** Track and sector of the first data block.
- **Bytes 3-18:** 16-character filename, padded with $A0 (shifted-space) if shorter than 16 characters.
- **Bytes 19-20:** Track and sector of the first side sector block (REL files only).
- **Byte 21:** Record length (REL files only).
- **Bytes 22-25:** Unused.
- **Bytes 26-27:** Track and sector of the replacement file during an @SAVE or @OPEN.
- **Bytes 28-29:** Number of blocks in the file, stored as a two-byte integer (low byte, high byte).
- **Bytes 30-31:** Unused.

For example, a directory entry for a PRG file named "HOW TO USE" starting at track 17, sector 0, with 21 blocks, would be structured as follows:

## Source Code

```text
Byte 0:   82    ; File type: PRG ($02) + Closed flag ($80)
Bytes 1-2: 11 00 ; Track 17, Sector 0
Bytes 3-18: 48 4F 57 20 54 4F 20 55 53 45 A0 A0 A0 A0 A0 A0 ; "HOW TO USE" + padding
Bytes 19-20: 00 00 ; Not used for PRG files
Byte 21:   00    ; Not used for PRG files
Bytes 22-25: 00 00 00 00 ; Unused
Bytes 26-27: 00 00 ; Unused
Bytes 28-29: 15 00 ; 21 blocks (low byte: $15, high byte: $00)
Bytes 30-31: 00 00 ; Unused
```



## References
- "single_directory_file_entry_example" — expands example showing name bytes
- "program_file_storage_description" — expands on how filenames relate to file data