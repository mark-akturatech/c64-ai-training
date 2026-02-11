# Format of a standard sequential data block on the 1541 (Commodore DOS)

**Summary:** Layout of a 1541 sequential-file disk sector: byte 0 = track link, byte 1 = sector link or EOF marker and byte count, bytes 2–255 = 254 bytes of user data; final-sector EOF uses byte 0 = $00 and byte 1 = position of last valid data byte (N). Terms: 1541, Commodore DOS, sequential data block, track/sector link, EOF byte.

## Description
- A standard sequential data block (sector) on the 1541 follows this byte layout:
  - Byte 0: track number of the next block (link)
  - Byte 1: sector number of the next block (link)
  - Bytes 2–255: 254 bytes of file data (user data)
- For the last sector of a sequential file:
  - Byte 0 = $00 (indicates end-of-file / no next track)
  - Byte 1 = position of the last valid data byte within the sector (call this N)
  - Bytes after the last valid data byte (beyond position N) are garbage / unused
- The source gives the textual mapping:
  - "2-N  The last N-2 bytes of the sequential file"
  - "(N+1)-255  Garbage"
- **[Note: Source may contain an off-by-one error in the expression 'N-2'.]** Correct interpretation:
  - If byte 1 contains N (the index of the last valid data byte), the valid user-data bytes in the final sector are bytes 2 through N inclusive. The number of valid bytes = (N - 2) + 1 = N - 1.
  - Example: if byte 1 = $05, valid data bytes are bytes 2,3,4,5 (4 bytes), not 3 bytes.

## Source Code
```text
Sector layout (bytes numbered 0..255):
0   = track of next block (link)        ; $00 for end-of-file on last sector
1   = sector of next block (link) OR   ; if byte0=$00, byte1 = N (position of last valid data byte)
       N = position of last valid data byte (final sector)
2..255 = 254 bytes of user data (or garbage beyond N on final sector)

Example — normal intermediate sector:
byte 0 = $05   ; next track
byte 1 = $0A   ; next sector
bytes 2..255 = user data (254 bytes)

Example — final sector with N = $05 (decimal 5):
byte 0 = $00   ; end-of-file marker
byte 1 = $05   ; last valid data byte is at position 5
bytes 2..5 = valid file data (4 bytes)
bytes 6..255 = garbage/uninitialized
```

## References
- "sequential_start_block_dump_part1" — expands on example directory/data block using the above format
- "sequential_last_sector_example_and_padding" — expands on example of a last sector with byte count and padding
