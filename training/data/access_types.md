# VIC-II memory access types (c/g/p/s), video areas, DRAM refresh and idle reads

**Summary:** Describes VIC-II memory access types: c-access (video matrix, 12 bits), g-access (character generator / bitmap, 8 bits), p-access (sprite pointers, 8 bits), s-access (sprite data, 8 bits); memory areas (video matrix 1000 entries, character generator 2KB / bitmap 8KB steps, sprite pointer area and sprite data 63/64-byte granularity); DRAM refresh (5 reads/line) and idle accesses (reads to $3FFF/$7FFF/$BFFF/$FFFF depending on bank). Mentions $D018 fields VM10-VM13 and CB11-CB13.

## Access types and widths
- c-access — video matrix reads, 12 bits wide. Used for text/bitmap background fetches (character code + color/upper nybble).
- g-access — character generator or bitmap pixel data reads, 8 bits wide.
- p-access — sprite data pointer reads (sprite pointers), 8 bits wide.
- s-access — sprite pixel data reads, 8 bits wide.
- DRAM refresh — 5 read accesses per raster line to refresh DRAM rows.
- Idle accesses — reads performed when no other VIC access is pending; read address is video address $3FFF within the current VIC bank (i.e. $3FFF, $7FFF, $BFFF or $FFFF), result discarded.

## Memory areas used by the VIC
- Video matrix (background/text/bitmap indexing)
  - Quantity: 1000 video addresses (40 × 25), each logically 12 bits.
  - Placement: Movable in 1 KB steps within the VIC 16 KB address space using bits VM10–VM13 of register $D018.
  - Color RAM: Color RAM contributes the upper 4 bits of the 12-bit video matrix entries (Color RAM is part of the video matrix).
  - VIC internal buffer: Data from the video matrix is stored in an internal VIC buffer described as a 40 × 12-bit video matrix/color line (used by the fetch pipeline).

- Character generator / bitmap area (pixel data)
  - Character generator size: 2 KB.
  - Bitmap size: 8 KB.
  - Placement: Movable in 2 KB steps for character generator, 8 KB steps for bitmap mode, via bits CB11–CB13 (for bitmap mode only CB13 is used) of register $D018.
  - Notes: The character generator is independent of the on-chip Char ROM; ROM patterns are only a conventional source—user RAM can be used instead.

- Sprite pointer area (pointers selecting sprite data blocks)
  - Location: Immediately after the end of the video matrix area (8 bytes allocated for sprite pointers).
  - Function: Each of the 8 sprite pointer bytes selects one of 256 blocks of 64 bytes within the VIC address space (pointer value × 64 selects sprite block).

- Sprite data area (sprite pixel bytes)
  - Granularity: Sprite blocks are aligned in 64-byte steps.
  - Used bytes: 63 bytes per sprite contain actual pixel data (one byte per raster fetch), within each 64-byte block (one byte unused/ignored per block).

## Timing/behavioral notes preserved from source
- The VIC issues specific access types according to the graphics mode and sprite activity; c-accesses and g-accesses form the main background fetch pipeline, p- and s-accesses serve sprite fetching.
- DRAM refresh accesses are scheduled independently (5 refresh reads per raster line).
- When the VIC has no pending graphic or refresh access it performs idle accesses to the top address of the current VIC bank ($3FFF relative).
- Sprite pointer bytes are positioned immediately after the video matrix area in the chosen video matrix bank; their values index 64-byte sprite blocks across the VIC addressable 16 KB.

## Source Code
```text
VIC-II memory areas and access summary (reference)

- Video matrix:
  - Entries: 1000 addresses (40x25)
  - Width per entry: 12 bits (8 bits from video matrix RAM + upper 4 bits from Color RAM)
  - Placable in 1 KB steps within VIC 16 KB space using VM10-VM13 of $D018

- Character generator / Bitmap:
  - Character generator area: 2048 bytes (2 KB)
  - Bitmap area: 8192 bytes (8 KB)
  - Placable in 2 KB steps (char) or 8 KB steps (bitmap) using CB11-CB13 of $D018
  - Bitmap mode uses only CB13 for 8 KB selection

- Sprite pointers:
  - Size: 8 bytes, located directly after the video matrix area
  - Each pointer selects one of 256 blocks of 64 bytes (pointer * 64)

- Sprite data:
  - Block size/granularity: 64 bytes
  - Used sprite bytes: 63 bytes per sprite within the 64-byte block

- Access types:
  - c-access: video matrix read, 12 bits
  - g-access: character generator / bitmap read, 8 bits
  - p-access: sprite pointer read, 8 bits
  - s-access: sprite data read, 8 bits
  - DRAM refresh: 5 reads per raster line
  - Idle access: read to $3FFF (top of VIC bank), result discarded

- Idle read addresses depending on VIC bank:
  - Bank 0: $3FFF
  - Bank 1: $7FFF
  - Bank 2: $BFFF
  - Bank 3: $FFFF
```

## Key Registers
- $D000-$D02E - VIC-II - VIC register block (entire register range)
- $D018 - VIC-II - Video/character memory bank select bits (VM10–VM13 select video matrix bank in 1 KB steps; CB11–CB13 select character/bitmap bank in 2 KB / 8 KB steps; bitmap mode uses CB13)

## References
- "sprite_memory_access_and_display" — expands on p-access and s-access timing for sprites
- "vc_and_rc" — expands on VC/VCBASE/RC involvement in c/g-access sequences