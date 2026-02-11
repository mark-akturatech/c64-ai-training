# Side-sector header — first 16 bytes (side sector block)

**Summary:** Describes the side-sector header layout in the first 16 bytes of a side-sector block: bytes $00-$01 = pointer to next side-sector (track, sector), $02 = side-sector index (0–5), $03 = record size ($96 = 150), bytes $04-$0F = up to six track/sector pointers for side sectors (side 0..5). Includes example raw dump and the six-pointer table.

## Layout and meaning

- Bytes $00-$01 — Next side-sector pointer: byte $00 = track, byte $01 = sector. In the example this points to track $0C, sector $13 (track 12, sector 19).
- Byte $02 — Side-sector number (index). Value range: 0..5. Example: 0.
- Byte $03 — Record size in bytes. Example: $96 = 150.
- Bytes $04-$0F — Six pairs of (track, sector) pointers, one pair per possible side sector (side 0..5). Each pair is (track, sector). A relative file may use up to 6 side sectors because the disk capacity and pointer usage works out to ~5.53 pointers per file, so implementations allocate for up to 6 (numbered 0..5).
- Numbering: side-sector indices are 0..5. If a pair is $00-$00 it indicates no pointer (unused).

**[Note: Source may contain an error — the prose at the top of the source says "Bytes 5-15" for the pointer list, but the table and pointer pairs correspond to bytes $04-$0F (4–15). The table below uses bytes 4–15 as the six pointer pairs.]**

## Source Code
```text
Example raw dump (note possible OCR of hex digits: 'O' used for zero):
.  00:  0C  13  00  96  11  0D  0C  13 
.    0S:    06   10   13  0F  00  00  00  00 

Interpreted:
Bytes 0-1  => next side-sector: track $0C, sector $13
Byte 2     => side sector number: 0
Byte 3     => record size: $96 (150)
Bytes 4-15 => six (track,sector) pairs for side sectors 0..5

Pointer table (byte offsets shown are zero-based):

BYTE RANGE   SIDE  TRACK (dec/hex) - SECTOR (dec/hex)
4-5          0     17 ($11)  -  13 ($0D)
6-7          1     12 ($0C)  -  19 ($13)
8-9          2     6  ($06)  -  16 ($10)
10-11        3     19 ($13)  -  15 ($0F)
12-13        4     0  ($00)  -  0  ($00)
14-15        5     0  ($00)  -  0  ($00)
```

## References
- "side_sector_block_format" — formal layout of the side-sector block  
- "first_side_sector_raw_dump_part2" — expands on the pointer list where bytes $10.. refer to data block pointers
