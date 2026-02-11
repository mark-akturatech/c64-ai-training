# Sequential File Storage (DOS sector layout)

**Summary:** Describes the Commodore DOS sequential-file sector format: non-last sectors use bytes $00-$01 as a forward pointer (track, sector) and bytes $02-$FF as 254 data bytes; the last sector is signalled by byte $00 = $00 and byte $01 = position N of the final valid byte (bytes $02..N are valid).

## Sector layout (non-last sectors)
Non-last sectors in a sequential file contain a 2‑byte forward pointer followed by 254 bytes of payload.

- Byte $00: Track number of the next block in the file (forward pointer).
- Byte $01: Sector number of the next block in the file (forward pointer).
- Bytes $02–$FF: 254 bytes of file data (payload).

The forward pointer (track,sector) links to the next sector of the file. If the forward pointer points to a valid track (> $00), the DOS treats the sector as an intermediate block containing a full 254 bytes of data.

## Last-sector format (end-of-file marker)
The final sector in a sequential file is special:

- Byte $00 = $00 — a null track value indicates "this is the last sector" (there is no track 0).
- Byte $01 = N — the position (offset) of the last valid byte in the file within this sector.
- Bytes $02..N — these bytes are the valid final data bytes of the file.
- Bytes N+1..$FF — garbage / undefined; DOS ignores them.

Thus the count of valid data bytes in the last sector = N − 1 (because data starts at byte $02). The DOS detects the end of file by the null track value in byte $00.

## Source Code
```text
Non-last sector layout (bytes 0..255):
Byte  Purpose
$00   Track of next block in this file (forward pointer)
$01   Sector of next block in this file (forward pointer)
$02-$FF  254 bytes of data (payload)

Last sector layout (bytes 0..255):
Byte  Purpose
$00   $00  (Null track — indicates last sector of file)
$01   N    Position of the last valid byte in the file (offset within sector)
$02..N     Valid final data bytes of your sequential file
N+1..$FF   Garbage (ignored)
```

Example (decimal/hex illustration):
```text
If byte $01 contains $10 (decimal 16), then valid data in this sector = bytes $02..$10 (inclusive),
which equals 15 bytes of final data (16 - 1 = 15).
```

## References
- "program_file_following_sectors_and_last_sector_layout" — contrasts PRG and sequential last-block handling
