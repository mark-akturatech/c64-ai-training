# Directory entry bytes 2–3: pointer to the file's first disk sector (track,sector)

**Summary:** Explains how the two-byte pointer in a Commodore directory entry identifies the first sector of a file (track, sector), how to follow the pointer into the disk's sector chain, the meaning of a track==0 end marker, and how to locate the sector inside a D64/1541 image (sectors-per-track map).

**Pointer location and interpretation**

A directory entry on a 1541-formatted (Commodore) disk is 32 bytes long. The pointer to the first file block is stored as two bytes inside the directory entry:

- **Canonical offsets (0-based):**
  - Offset 0 = file type/flags byte
  - Offset 1 = track number of the first file sector (1..35; 0 = no first sector / empty)
  - Offset 2 = sector number of the first file sector (0..(sectors_on_track-1))

(If you see documentation or text that refers to "bytes 2 and 3" it commonly uses 1-based counting — those are offsets 1 and 2 in 0-based indexing.)

How to interpret them:
- Read the two bytes: track = byte_at_offset_1, sector = byte_at_offset_2.
- If track == $00: there is no first data block (file is empty or the directory entry is unused/deleted).
- Otherwise, the pair (track, sector) points to the sector that contains the first file block. Each file block (sector) itself begins with a 2‑byte forward pointer: the next block's (track,sector). The rest of the sector contains file data (see "sector contents" below).

**Following the file chain (how file storage is chained on disk)**

- **Step 1:** From the directory entry, take (T,S) = (track, sector).
- **Step 2:** Locate sector (T,S) on the disk image (see mapping rules below).
- **Step 3:** Read that sector:
  - Byte 0 = next-track (0..35). If 0, this is the last block of the file.
  - Byte 1 = next-sector (if next-track == 0, byte 1 = number of valid data bytes in this final block; otherwise it is the next sector index).
  - Bytes 2..255 = file data for this block (254 bytes regular data per block).
- **Step 4:** If next-track != 0, set (T,S) = (next-track,next-sector) and repeat Step 2.
- **Step 5:** If next-track == 0, use byte 1 as the count of valid data bytes in bytes 2..255 of this final block (valid count is 1..254).

Notes:
- The pointer in the directory only points to the first block; the rest of the file is found by following the per-sector forward pointers.
- For v1/v2 file types (PRG, SEQ, REL) the same chaining rules apply; interpretation of the final-block byte may differ by file type (e.g., for REL records), but the forward-pointer convention (track==0 => final block) is universal on 1541-style disks.

**Location inside a disk image (D64 / 1541)**

To calculate the byte offset inside a D64 (or raw track/sector access) for (track T, sector S) you need the sectors-per-track table. The 1541 organization:

- Tracks 1–17: 21 sectors each
- Tracks 18–24: 19 sectors each
- Tracks 25–30: 18 sectors each
- Tracks 31–35: 17 sectors each

To get the absolute sector index (0-based) for (T,S):
1. Sum the sectors on all tracks before T.
2. Add S (sector number within track).
3. Multiply the total sector count by 256 to get the byte offset (each sector = 256 bytes).

Example (algorithmic):
- cumulative_sectors_before_T = sum_{t=1..T-1} sectors_on_track(t)
- absolute_sector_index = cumulative_sectors_before_T + S
- byte_offset_in_image = absolute_sector_index * 256

This is the index you use to read the sector's 256 bytes and thus retrieve the forward pointer and data for that block.

**Sector contents summary**

- Byte 0 = next-track (0 => last block)
- Byte 1 = next-sector (or number of valid data bytes when next-track == 0)
- Bytes 2..255 = up to 254 bytes of file data for this block

## Source Code

```text
Full 32-byte directory entry hex dump (example):

00: 82 11 01 44 49 52 45 43 54 4F 52 59 A0 A0 A0 A0
10: A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 A0 02 00 00 00

Directory-entry field map (32 bytes total, canonical):

Offset (0-based)  Field
0                File type / flags
1                Track of first sector
2                Sector of first sector
3..18            Filename (padded with $A0)
19..20           (depends on DOS version / unused or file size words)
21..31           Additional file metadata or unused bytes

1541 sectors-per-track table:

Tracks  1 - 17 : 21 sectors
Tracks 18 - 24 : 19 sectors
Tracks 25 - 30 : 18 sectors
Tracks 31 - 35 : 17 sectors
(each sector = 256 bytes)
```

In the hex dump above:
- Byte 0 ($82): File type/flags byte (PRG file, properly closed).
- Byte 1 ($11): Track number of the first file sector (track 17).
- Byte 2 ($01): Sector number of the first file sector (sector 1).
- Bytes 3–18: Filename "DIRECTORY" padded with $A0.
- Bytes 28–29 ($02 00): Number of blocks in file (2 blocks).

## References

- "single_directory_file_entry_example" — expands the file entry showing pointer bytes
- "program_file_storage_description" — expands on how the file's first sector and subsequent blocks are structured
