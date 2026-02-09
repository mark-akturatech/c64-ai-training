# Block Availability Map (BAM) — hex dump of Track 18, Sector 0 (1541TEST/DEMO)

**Summary:** Hex dump of the 1541 directory/BAM sector (track 18, sector 0) showing BAM entries (bytes 4–143), disk name (bytes 144–159 / $90–$9F), disk ID (bytes 162–163 / $A2–$A3), DOS version/format type (bytes 165–166 / $A5–$A6), and unused area. Includes the sector link (next directory track/sector) and example BAM entries (free-sector counts + 3‑byte bitmasks).

## BAM layout and interpretation

- The BAM (Block Availability Map) for a 1541 DOS disk is stored in track 18, sector 0. This sector contains:
  - bytes $00–$01: link to next directory sector (next directory track, next directory sector).
  - bytes $04–$8F (decimal 4–143): BAM entries for tracks (each track = 4 bytes: 1 byte = free-sector count, 3 bytes = bitmask for sectors on that track).
  - bytes $90–$9F (decimal 144–159): 16‑byte disk name (PETSCII padded, $A0 = PETSCII space).
  - bytes $A2–$A3 (decimal 162–163): disk ID (two bytes, e.g. 'Z','X' / $5A,$58).
  - bytes $A5–$A6 (decimal 165–166): DOS version/format type (e.g. '2','A' / $32,$41).
  - remaining bytes (after $A6) are unused or reserved for directory area / padding in this sector.

- Each track entry occupies four bytes. The first is a decimal count of free sectors on that track; the next three bytes are a little-endian 24‑bit bitmask indicating which sectors are free/used (bit = sector). See the referenced chunks for the full mapping and a track‑14 example.

- Example values in this dump:
  - Sector link at $00–$01 is $12,$01 (next directory — track $12 (18), sector $01).
  - Disk name at $90–$9F reads "1541TEST" and "/DEMO" (PETSCII, $A0 = pad).
  - Disk ID at $A2–$A3 is $5A,$58 ("ZX").
  - DOS type at $A5–$A6 is $32,$41 ("2A").

**[Note: Source contained OCR artifacts (for example 'AO'→A0, 'oo'→00, 'IF'→FF); ambiguous bytes were corrected to match standard BAM formatting and the textual annotations in the original dump.]**

## Source Code
```text
Track 18 - Sector 0 (hex dump, offsets $00-$FF)

00:  12 01 41 00 15 FF FF FF  15 FF FF FF 15 FF FF FF  15 FF FF FF
20:  15 FF FF FF 15 FF FF FF 11 D7 5F FF 00 00 00 00  00 00 00 00
40:  00 00 00 00 10 EC FF 07 00 00 00 00 00 00 00 00 12 BF FF 07
60:  13 FF FF 07 13 FF FF 07 13 FF FF 07 12 FF FF 03 12 FF FF 03
80:  12 FF FF 03 12 FF FF 03 11 FF FF 01 11 FF FF 01 11 FF FF 01
90:  31 35 34 31 54 45 53 54 2F 44 45 4D 4F A0 A0 A0  A0 A0 5A 58
B0:  A0 32 41 A0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
D0:  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
F0:  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00

Annotations:
- $00-$01 = link to next directory sector: $12,$01 (track $12 = 18, sector $01)
- $04-$8F = BAM entries for tracks (4 bytes per track)
- $90-$9F = Disk name: "1541TEST /DEMO" (PETSCII; $A0 = space/padding)
- $A2-$A3 = Disk ID: $5A,$58 ("ZX")
- $A5-$A6 = DOS type/version: $32,$41 ("2A")
- remainder = unused / padding
```

## Key Registers
- (none) — This chunk documents disk sector contents (BAM/directory), not CPU or I/O registers.

## References
- "bam_structure_and_field_offsets" — expands on the table mapping byte offsets to BAM contents
- "bam_entry_format_and_track14_example" — expands on how each track is represented by four bytes (free count + 3‑byte bitmask) and gives a track 14 example