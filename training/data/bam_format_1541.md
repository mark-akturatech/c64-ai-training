# 1540/1541 BAM Format (Track 18, Sector 0)

**Summary:** Block Availability Map (BAM) layout stored on Track 18, Sector 0 of a 1540/1541 disk: bytes 0-1 = track/sector of first directory block, byte 2 = ASCII 'A' (DOS version/format flag), byte 3 = reserved, bytes 4-143 = 35 × 4-byte per-track entries (free-count + 3-byte sector bitmap). Bitmap bits = block availability (1 = free, 0 = used).

## BAM layout and interpretation
The BAM on a 1540/1541 is a fixed 144-byte structure located at Track 18, Sector 0. It contains:
- Bytes 0-1: Track and sector of the first directory block (commonly 18, 01).
- Byte 2: ASCII 'A' (65) — format/DOS version flag (commonly shown as 'A' for 1541 DOS variants).
- Byte 3: reserved (null) for future DOS use.
- Bytes 4-143: 35 per-track entries, each 4 bytes long, for tracks 1..35.

Per-track entry (4 bytes):
- Byte 0 = number of free blocks on that track (0..max sectors for that track).
- Bytes 1-3 = 24-bit bitmap of sectors for that track (LSB = sector 0). A bit value of 1 means the block/sector is available (free); 0 means not available (allocated or bad).
- Only the first N bits (where N = sectors on that track) are meaningful; remaining high bits of the 24-bit field are unused.

Track sector counts (for interpreting bitmap bits):
- Tracks 1–17: 21 sectors (sectors 0..20)
- Tracks 18–24: 19 sectors (sectors 0..18)
- Tracks 25–30: 18 sectors (sectors 0..17)
- Tracks 31–35: 17 sectors (sectors 0..16)

Addressing formula:
- Per-track entry start offset = 4 + (track_number − 1) × 4
  - Example: Track 1 entry starts at byte offset 4; Track 18 entry starts at 4 + (18−1)*4 = 72 (bytes 72–75).

Bitmap bit ordering:
- Bit 0 (least-significant bit of the first bitmap byte) corresponds to sector 0.
- Continue increasing sector numbers with increasing bit positions through the three bitmap bytes (up to bit 23).
- Interpret only bits up to the track's sector count.

Usage notes (concise, factual):
- The BAM is used by DOS to find free blocks and to report free block counts.
- Directory header (on track 18) and BAM are stored together; the directory chain starting block is read from bytes 0–1.
- A corrupt BAM (incorrect free counts or bitmaps) will cause directory/listing errors; see DOS error references for integrity checks.

## Source Code
```text
1540/1541 BAM — Track 18, Sector 0 (byte offsets 0..143)

Bytes 0-1    : Track, Sector of first directory block (e.g. 18,01)
Byte  2      : ASCII 'A' (65) — format/DOS flag
Byte  3      : Reserved (0)
Bytes 4-143  : 35 entries × 4 bytes each (tracks 1..35)

Per-track entry (4 bytes):
  Byte 0 : free-block count for this track (0..max sectors)
  Byte 1 : bitmap low 8 bits  (bits 0..7  => sectors 0..7)
  Byte 2 : bitmap middle 8 bits(bits 8..15 => sectors 8..15)
  Byte 3 : bitmap high 8 bits (bits 16..23 => sectors 16..23)
    - Bit value 1 = block available (free)
    - Bit value 0 = block not available (used/bad)

Offsets:
  Offset_of_track_T_entry = 4 + (T - 1) * 4
  Example: Track 1 => bytes 4-7
           Track 18 => bytes 72-75
           Track 35 => bytes 4 + 34*4 = 140 => bytes 140-143

Track sector counts:
  Tracks  1-17 => 21 sectors (sectors 0..20)
  Tracks 18-24 => 19 sectors (sectors 0..18)
  Tracks 25-30 => 18 sectors (sectors 0..17)
  Tracks 31-35 => 17 sectors (sectors 0..16)

Bit ordering example:
  If Track 1 bitmap bytes are 0xFF,0xFF,0x01:
    - bits 0..20 = 1 => sectors 0..20 free
    - remaining bits (21..23) ignored
```

## Key Registers
(omitted — this chunk documents disk BAM layout, not CPU/PIO registers)

## References
- "directory_header_1541" — expands on the BAM located on Track 18 Sector 0 alongside the directory header
- "dos_error_messages_50_to_74" — covers Directory error (71) and BAM integrity checks