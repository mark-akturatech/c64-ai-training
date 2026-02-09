# BAM bitmap decoding for track 18 (directory track)

**Summary:** Decoding of a single BAM (Block Availability Map) entry for track 18 on a 1541-style disk: free-sector count byte ($10) and the three bitmap bytes ($EC, $FF, $07) that map sectors 0–20 (21 sectors) where bit=1 = FREE, bit=0 = ALLOCATED.

## BAM bitmap format and mapping rule
- Each track's BAM entry contains: one byte = count of free sectors, followed by three bitmap bytes that cover up to 21 sectors.
- Bitmap layout: byte1 covers sectors 0–7, byte2 covers sectors 8–15, byte3 covers sectors 16–20 (only low 5 bits used). Within each byte, bit 0 (LSB) = lowest sector number of the group (e.g., sector 0 for byte1), bit 7 (MSB) = highest (e.g., sector 7 for byte1).
- Convention used here: bit = 1 → FREE, bit = 0 → ALLOCATED.
- For track 18 the directory uses sectors 1–18 (these sectors are reserved for directory entries).

Example: Track 18 entry shows free-sector count $10 (decimal 16). The three bitmap bytes are $EC, $FF, $07. Interpreting them with LSB=sector low number yields the per-sector free/allocated map below and the free-sector count matches the $10 byte (16 free).

## Source Code
```text
Raw bytes (excerpt shows BAM entry area for track 18):
  ...  $10  $EC  $FF  $07  $00  $00  $00  $00  ...
         ^count  ^bitmap byte1  ^bitmap byte2  ^bitmap byte3

Byte values and binary:
  count byte (byte 72): $10     -> decimal 16 (16 free sectors)
  bitmap byte1 (byte 73): $EC   -> 11101100 (MSB->LSB)
  bitmap byte2 (byte 74): $FF   -> 11111111
  bitmap byte3 (byte 75): $07   -> 00000111  (only bits 0..4 used for 21-sector tracks)

Bitmap interpretation (LSB = sector low number):
  Byte1 $EC (sectors 0..7):
    bit0 (sector 0) = 0 -> ALLOCATED
    bit1 (sector 1) = 0 -> ALLOCATED
    bit2 (sector 2) = 1 -> FREE
    bit3 (sector 3) = 1 -> FREE
    bit4 (sector 4) = 0 -> ALLOCATED
    bit5 (sector 5) = 1 -> FREE
    bit6 (sector 6) = 1 -> FREE
    bit7 (sector 7) = 1 -> FREE

  Byte2 $FF (sectors 8..15):
    bits 0..7 -> all 1 -> sectors 8..15 all FREE

  Byte3 $07 (sectors 16..20; bits 5..7 unused):
    bit0 (sector 16) = 1 -> FREE
    bit1 (sector 17) = 1 -> FREE
    bit2 (sector 18) = 1 -> FREE
    bit3 (sector 19) = 0 -> ALLOCATED
    bit4 (sector 20) = 0 -> ALLOCATED

Per-sector summary for track 18 (sectors 0..20):
  Sector : status
    0  : ALLOCATED
    1  : ALLOCATED   <-- note: sectors 1..18 are reserved for directory entries
    2  : FREE
    3  : FREE
    4  : ALLOCATED
    5  : FREE
    6  : FREE
    7  : FREE
    8  : FREE
    9  : FREE
   10  : FREE
   11  : FREE
   12  : FREE
   13  : FREE
   14  : FREE
   15  : FREE
   16  : FREE
   17  : FREE
   18  : FREE
   19  : ALLOCATED
   20  : ALLOCATED

Free-sector total: count of 1-bits = 5 (byte1) + 8 (byte2) + 3 (byte3) = 16 -> matches $10.
```

## Key Registers
(none)

## References
- "bam_bit_map_for_track14" — similar bit-map decoding technique applied to track 14
- "directory_entries_overview_and_track18_sector1_example" — directory sectors reside on track 18 sectors 1-18