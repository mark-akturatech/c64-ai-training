# Header Block (Disk Sector)

**Summary:** Describes the Commodore DOS header block layout: Sync mark, Header ID ($08), Header checksum (EOR of track, sector, ID HI, ID LO), Sector number, Track number, ID characters (ID HI/LO), $0F OFF padding used during formatting, and header gap of $55 x8 (4040 uses $55 x9).

**Header Block Layout**
The header block identifies the following data block to the DOS and is only written during formatting (never rewritten). Fields appear on-disk in the order listed below.

- **Sync Mark:** 10 or more one-bits (used to warn DOS that a header or data block follows).
- **Header Block ID:** Normally $08 — distinguishes a header block from a data block.
- **Header Block Checksum:** Single byte computed as bitwise EOR of Track, Sector, ID HI, ID LO.
- **Sector Number:** Sector index on the track (numbered consecutively around the track).
- **Track Number:** Track index (used to verify head positioning).
- **ID Character #2 (ID HI):** Second disk ID character (e.g., the "1" in "N0:GAMES,V1"); compared against master disk ID.
- **ID Character #1 (ID LO):** First disk ID character (e.g., the "V" in "N0:GAMES,V1"); compared against master disk ID.
- **$0F OFF bytes:** 9 padding bytes used only during initial formatting (spacing). These OFF bytes are not referenced after formatting.
- **Header Gap:** Eight $55 bytes (4040 drive uses nine $55 bytes). These are not read by DOS; they provide time between header and the following data block.

Important: Header blocks are written only during format; they are never rewritten afterwards. The 4040 drive's 9-byte header gap is one reason 1541 and 4040 drives are not write-compatible.

## Source Code
```text
Header block on-disk byte sequence (in order):

[ Sync Mark: 10+ one-bits ] 
$08            ; Header Block ID
CHK            ; Header checksum = Track XOR Sector XOR ID_HI XOR ID_LO
Sector         ; Sector number
Track          ; Track number
ID_HI          ; ID character #2 (ID high)
ID_LO          ; ID character #1 (ID low)
$0F x 9        ; OFF bytes (padding used during format)
$55 x 8        ; Header gap (4040 uses $55 x 9)

Checksum calculation (pseudocode):
CHK = Track EOR Sector EOR ID_HI EOR ID_LO
```

## References
- "sector_structure_overview" — expands on header vs data block roles
- "bam_sector_dump_and_overview" — expands on location and format differences affecting 4040 vs 1541 compatibility