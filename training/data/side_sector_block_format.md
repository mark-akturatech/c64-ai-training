# Side-sector block layout for relative files (side-sector / side sector)

**Summary:** Layout of a side-sector (256-byte block) used by relative files: bytes $00-$01 = forward pointer to next side sector (track/sector), $02 = side sector number (0–5), $03 = record length (bytes per record), $04-$0F = track/sector list for up to 6 side sectors, $10-$FF = track/sector list for up to 120 data blocks (each entry = track then sector).

## Description
A side-sector block is a 256-byte structure used to index relative-file data blocks. It contains a one-block forward pointer, a small header (side-sector id and record length), a short table of up to six side-sector links, and a long table of up to 120 data-block links. Each link is stored as two bytes: first the track number, then the sector number.

Key semantics:
- Bytes are numbered 0–255 within the 256-byte block.
- Bytes 0–1 form the forward pointer (track then sector) to the next side sector in the side-sector file (chain of side sectors).
- Byte 2 holds the side-sector number (0–5).
- Byte 3 contains the record length (number of bytes per record for this relative file).
- Bytes 4–15 hold six (6) side-sector entries (each two bytes: track, sector). The mapping is:
  - bytes 4–5 = side sector #0
  - bytes 6–7 = side sector #1
  - bytes 8–9 = side sector #2
  - bytes 10–11 = side sector #3
  - bytes 12–13 = side sector #4
  - bytes 14–15 = side sector #5
- Bytes 16–255 hold the track/sector list for up to 120 data blocks. Each data-block entry is two bytes (track, sector):
  - bytes 16–17 = data block #1
  - bytes 18–19 = data block #2
  - ...
  - bytes 254–255 = data block #120

This structure permits chaining multiple side-sector blocks (via the forward pointer) and locating the disk blocks that contain the actual relative-file records by indexing into the 120-entry data-block table.

## Source Code
```text
Side-sector block (256 bytes) byte map (offsets shown in decimal and hex):

Offset  Dec/Hex  Length  Field
0       $00     1 byte  Forward pointer: track (first byte of two)
1       $01     1 byte  Forward pointer: sector (second byte of two)

2       $02     1 byte  Side-sector number (0..5)
3       $03     1 byte  Record length (bytes per record)

4-15    $04-$0F 12 bytes Links to up to 6 side sectors (6 entries × 2 bytes each)
                     4-5   ($04-$05)  side sector #0 (track, sector)
                     6-7   ($06-$07)  side sector #1 (track, sector)
                     8-9   ($08-$09)  side sector #2 (track, sector)
                    10-11  ($0A-$0B)  side sector #3 (track, sector)
                    12-13  ($0C-$0D)  side sector #4 (track, sector)
                    14-15  ($0E-$0F)  side sector #5 (track, sector)

16-255  $10-$FF 240 bytes Track/sector list for up to 120 data blocks (120 × 2 bytes)
                     16-17   ($10-$11)  data block #1  (track, sector)
                     18-19   ($12-$13)  data block #2
                     20-21   ($14-$15)  data block #3
                     ...
                    254-255  ($FE-$FF)  data block #120 (track, sector)
```

## References
- "relative_file_overview_and_block_format_intro" — expands on role of side sectors in random access
- "interpreting_side_sector_first_16_bytes_and_table" — expands on how to read the key header bytes of a side sector
