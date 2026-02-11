# Side Sector #0 Dump Header — Track 17 / Sector 13

**Summary:** Raw dump of side-sector header bytes $00..$0F (next-side-sector pointer at $00-$01, side sector number at $02, record length at $03, side-sector table entries $04-$0F). Contains OCR-corrupted raw text and a best-effort hex parse with uncertainty flags.

**Header layout**

This chunk contains the first 16 bytes (offsets $00..$0F) of Side Sector #0 for Track 17 / Sector 13. Field layout (as stated in source):

- $00-$01: Next-side-sector pointer (16-bit, raw bytes provided; interpretation depends on disk format — present here as raw little-endian 16-bit value)
- $02: Side sector number (one byte)
- $03: Record length (one byte)
- $04-$0F: Side-sector table entries (12 bytes) — raw entry values (likely pointers/sector identifiers or table entries; format not defined in source)

Below is a best-effort reconstruction of the 16 bytes, followed by notes on uncertain characters (OCR artifacts). Do not treat uncertain bytes as authoritative without consulting the original dump image/source.

## Source Code

```text
-- Original OCR text (verbatim tokens / line breaks preserved) --
00:
0C
13
00
96
11
0D
0C
13
08
06
10
13
0F
00
00
00
```

```text
-- Best-effort hex parse (offsets $00..$0F) --
Offset  Value  Notes
$00     $00    (clear)
$01     $0C    (clear)
$02     $13    (clear)
$03     $00    (clear)
$04     $96    (clear)
$05     $11    (clear)
$06     $0D    (clear)
$07     $0C    (clear)
$08     $13    (clear)
$09     $08    (clear)
$0A     $06    (clear)
$0B     $10    (clear)
$0C     $13    (clear)
$0D     $0F    (clear)
$0E     $00    (clear)
$0F     $00    (clear)
```

```text
-- Derived interpretations --
Next-side-sector pointer (bytes $00-$01): raw bytes $00 $0C -> 16-bit little-endian value $0C00 (0x0C00)
Side sector number (byte $02): $13
Record length (byte $03): $00
Side-sector table entries ($04-$0F): $96, $11, $0D, $0C, $13, $08, $06, $10, $13, $0F, $00, $00
```

## References

- "data_block_pointers_10_1f" — expands on Continuation: data block pointers starting at offset $10
- "data_block_pointers_20_2f" — expands on Related: subsequent data block pointer ranges
