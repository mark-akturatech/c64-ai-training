# Side sector #3 — side-sector pointer list and end-of-chain ($9F byte count)

**Summary:** Analysis of side sector #3 showing byte count $9F (159), the 16–255 pointer area containing up to 120 track/sector pairs (two bytes each), the last-data-block pointer (bytes 158/159 → track $17 sector $0C), null padding of the remainder (96 bytes), and chaining behavior where bytes 0/1 point to the next side sector and bytes 12/13 in earlier side sectors are updated when a new side sector is allocated.

## Description
- Byte 1 of side sector #3 contains the byte count value 159 ($9F).
- Side-sector layout: bytes 16–255 form a list of track/sector pointers for data blocks. Each pointer occupies two bytes (track, sector), so the 240 bytes in that range allow up to 120 track/sector entries.
- In this dump, bytes 158 and 159 (interpreted together as a track/sector pair) point to the last block of the sequential data file: track 23 ($17), sector 12 ($0C).
- The remainder of the pointer area (after the last valid pointer) is padded with nulls. In this example the remaining 96 bytes are nulls until the relative file grows and more pointers are needed.
- Bytes 160/161 (and onwards within the pointer area) would hold further track/sector pairs as the file extends.
- When a side sector becomes full, a new side sector is allocated (e.g., side sector #4). At that time:
  - Bytes 0/1 of the filled side sector (#3) are updated to point to the new side sector (#4) — byte 0 holds the track of the next side sector, byte 1 the sector (note: byte 1 previously used here holds the byte count when not used as a link).
  - Bytes 12/13 in side sectors 0–2 are also updated to reflect the creation of the new side sector (#4).
- The dump line shown in the source is the raw pointer-area snapshot illustrating the byte-count and the pointers described above.

## Source Code
```text
.    OO:    OO  9F  03  96   11   0D  0C  13

Byte 1 of side sector 3 shows a byte count of 159 ($9F).
Bytes 16-255 in a side sector are a list of track/sector pointers to 120 data blocks.
Bytes 158 and 159 (interpreted together) point to the last block: track 23 ($17), sector 12 ($0C).
The remainder of the side sector is padded with nulls (remaining 96 bytes).
Bytes 160 and 161 will point to further track/sector pairs as needed.
When side sector 3 fills, a new side sector 4 is created:
 - bytes 0 and 1 of side sector 3 point to side sector 4
 - bytes 12 and 13 in side sectors 0, 1, and 2 are updated to reflect side sector 4
```

## References
- "track_19_sector_15_side_sector_3_dump" — expands on points analyzed in this dump
- "sequential_file_example_track_17_sector_03" — expands on sequential file blocks referenced by the pointers