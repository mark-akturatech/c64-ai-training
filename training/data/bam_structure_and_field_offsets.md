# BAM Sector Layout — Track 18 / Sector 0

**Summary:** Byte-level layout of the BAM sector (Track 18, Sector 0) for 1541/4040 format disks: pointer to first directory sector, format char, Block Availability Map (4 bytes per track × 35 tracks = 140 bytes), disk name, disk ID, DOS version/format bytes, and padding (shifted spaces $A0).

## Layout and field purposes
This sector (sector 0 of track 18) contains the BAM and other disk header fields. Offsets shown below are byte offsets within the 256-byte sector (decimal and hex). “Shifted space” means byte value 160 decimal / $A0 hex.

- 0–1 (0x00–0x01): Pointer to first directory sector — stored as track/sector pair (example: 18/1).
- 2 (0x02): ASCII format character 'A' (65 dec / $41) indicating 1541/4040 format.
- 3 (0x03): Unused (reserved).
- 4–143 (0x04–0x8F): Block Availability Map (BAM) — 35 tracks × 4 bytes per track = 140 bytes. Each 4-byte entry indicates free/used sectors for that track (see referenced chunk for per-track unpacking).
- 144–159 (0x90–0x9F): Diskette name — 16 ASCII bytes, padded.
- 160–161 (0xA0–0xA1): Shifted spaces (typically $A0).
- 162–163 (0xA2–0xA3): Disk ID — 2 ASCII bytes.
- 164 (0xA4): Shifted space ($A0).
- 165–166 (0xA5–0xA6): DOS version and format type (example "2A" stored as ASCII bytes 50/65 decimal — '2' = 50 dec / $32, 'A' = 65 dec / $41).
- 167–255 (0xA7–0xFF): Padding / unused (often filled with shifted spaces $A0 or left unused).

**[Note: Source material contained duplicated lines and an overlapping range (167–170 vs 170–255). The cleaned mapping above resolves that overlap by treating 167–255 as padding/ununsed; field definitions up to 166 are authoritative.]**

## Source Code
```text
BAM sector (Track 18, Sector 0) field table — offsets are decimal (hex):

Dec  Hex   Length  Field / Contents
0    $00   2       Pointer to first directory sector (track/sector) — example: 18/1
2    $02   1       ASCII format char 'A' (65 dec / $41) => 1541/4040 format
3    $03   1       Unused / reserved
4    $04   140     Block Availability Map (4 bytes per track × 35 tracks = 140 bytes)
                    (tracks 1..35 each have a 4-byte BAM entry — see "bam_entry_format_and_track14_example")
144  $90   16      Diskette name (ASCII, padded)
160  $A0   2       Shifted spaces (0xA0)
162  $A2   2       Diskette ID (2 ASCII bytes)
164  $A4   1       Shifted space (0xA0)
165  $A5   2       DOS version and format type (example "2A": '2' = 50 dec / $32; 'A' = 65 dec / $41)
167  $A7   89      Padding / unused (typically $A0 or unused) up to byte 255 ($FF)

Notes:
- "Shifted space" = decimal 160 = hex $A0.
- DOS version/format example "2A" corresponds to decimal bytes 50/65 (hex $32/$41).
```

## Key Registers
(omitted — this chunk documents disk sector layout, not hardware registers)

## References
- "bam_sector_dump_and_overview" — expands on example hex dump of the BAM  
- "bam_entry_format_and_track14_example" — expands on per-track 4-byte BAM entry unpacking and a track 14 example