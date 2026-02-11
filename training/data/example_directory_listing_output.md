# 1541TEST/DEMO — full on-screen directory listing (1541)

**Summary:** Full 1541 directory listing for disk "1541 TEST /DEMO" showing drive number (0), quoted 16‑char disk name, disk ID (ZX), DOS version/format (2A), per-entry blocks used + filename (quoted) + file type (PRG), and final "558 BLOCKS FREE." count.

**Listing structure**
This chunk is the raw on‑screen directory produced by the 1541 DOS directory routine. Fields shown:
- Drive number (single digit) at start of header.
- Quoted disk name padded to 16 characters (exact quoted text preserved).
- Two‑letter disk ID following the quoted name.
- DOS version/format string (here "2A") on the header.
- Directory entries: each line shows blocks used, the filename (in quotes — spaces preserved), and the file type (PRG).
- Final free blocks count line ("558 BLOCKS FREE.").

No register or hardware details are included. Filenames and spacing are preserved exactly as shown.

## Source Code
```text
0  "1541 TEST /DEMO        "  ZX  2A

13  "HOW  TO  USE"  PRG
5   "HOW  PART  TWO"  PRG
4   "VIC-20  WEDGE"  PRG
1   "C-64  WEDGE"  PRG
4   "DOS  5.1"  PRG
11  "COPY /ALL"  PRG
9   "PRINTER  TEST"  PRG
4   "DISK  ADDR  CHANGE"  PRG
4   "DIR"  PRG
6   "VIEW  BAM"  PRG
4   "CHECK  DISK"  PRG
14  "DISPLAY  T&S"  PRG
9   "PERFORMANCE  TEST"  PRG
5   "SEQUENTIAL  FILE"  PRG
13  "RANDOM  FILE"  PRG

558  BLOCKS  FREE.
```

## References
- "how_to_display_the_directory" — expands on how to produce this listing with LOAD "*0",8 and LIST
- "directory_header_and_entry_fields" — breaks down drive number, disk name/ID, DOS version, and the three fields in each directory entry
- "active_files_and_blocks_free_calculation" — shows how the 'BLOCKS FREE' value is calculated from formatted capacity and file block usage