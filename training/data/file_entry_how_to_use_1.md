# Directory: File Entry #1 — raw hex/ASCII dump (track 18, sector 1)

**Summary:** Raw hex and ASCII dump of a single directory file entry located on track $12 (18), sector $01, displaying the filename "HOW TO USE" (bytes $48 $4F $57 $20 $54 $4F $20 $55 $53 $45) with $A0 padding. The entry includes the sector header ($12 $04), a file-type byte $82 (PRG, closed), and start track/sector bytes ($11 / $03).

**Context and Interpretation**

This chunk presents a raw directory sector extract from track $12, sector $01. The sector header (first two bytes) is $12 $04, indicating the next directory track and sector. Each directory entry in a 1541 directory sector is 32 bytes long and follows this structure:

- **Byte 0:** File type flags (e.g., $82 = PRG, closed)
- **Byte 1:** Start track of the file
- **Byte 2:** Start sector of the file
- **Bytes 3–18:** Filename (16 PETSCII bytes), padded with $A0
- **Bytes 19–31:** File-specific or unused fields

From the dump, the filename "HOW TO USE" is encoded in PETSCII bytes:

- H = $48, O = $4F, W = $57, space = $20, T = $54, O = $4F, space = $20, U = $55, S = $53, E = $45

These are followed by $A0 padding bytes to complete the 16-byte name field.

The file-type byte is $82, indicating a closed PRG file. The start track and sector bytes are $11 (track 17) and $03 (sector 3).

Interpretation summary:

- **Sector header:** $12 $04 (next directory track $12, next sector $04)
- **Directory entry:** File type $82, start track $11, start sector $03, filename "HOW TO USE" padded with $A0

## Source Code

```text
Sector header (offsets 00-01):
00: 12  04         ; next directory track = $12 (18), next sector = $04

Directory entry starting at sector offset 02 (entry #1, 32 bytes):
02: 82  11  03     48  4F  57  20  54  4F  20  55  53  45  A0  A0  A0
12: A0  A0  00  00  00  00  00  00  00  00  00  00  00  00  00  00

Reconstructed 32-byte directory entry (byte offsets 0..31 of the entry):
00: $82    ; file type (flags) - PRG, closed
01: $11    ; start track
02: $03    ; start sector
03: $48 'H'
04: $4F 'O'
05: $57 'W'
06: $20 ' '
07: $54 'T'
08: $4F 'O'
09: $20 ' '
0A: $55 'U'
0B: $53 'S'
0C: $45 'E'
0D: $A0  ; PETSCII padding
0E: $A0
0F: $A0
10: $A0
11: $A0
12: $00
13: $00
14: $00
15: $00
16: $00
17: $00
18: $00
19: $00
1A: $00
1B: $00
1C: $00
1D: $00
1E: $00
1F: $00

ASCII decoded filename (bytes $03–$12): "HOW TO USE" followed by $A0 padding
```

## References

- "directory_entries_intro_track18_sector1" — expands on sector header and context
- "file_entry_part_tw_#2" — expands on the next directory/file entry (ENTRY #2)
