# Directory File Entry #4 — raw hex + ASCII dump (decoded)

**Summary:** Raw/damaged hex + ASCII dump of a single Commodore 1541/CBM DOS directory file entry (ENTRY #4). Contains the filename bytes (shows "4 WEDGE"), padding bytes (likely $A0), zero bytes ($00), and internal numeric fields shown as bytes (notably $82 $13 $01 and the ASCII "DOS"). OCR artifacts present (e.g. "AO" -> $A0, "OO" -> $00, "Ol" -> $01).

## Decoded contents
This chunk is a single directory entry (one 32-byte directory record from a directory sector) presented as a mixture of hex and ASCII with OCR errors. What is recoverable:

- The filename portion clearly contains the bytes: 34 20 57 45 44 47 45 — which decode to ASCII/PETSCII "4 WEDGE".
  - 34 = "4"
  - 20 = space
  - 57 45 44 47 45 = "W E D G E" -> "WEDGE"
- The dump shows repeated occurrences of "AO" which, given Commodore filename padding, almost certainly represents $A0 (PETSCII shifted-space used to pad filenames in directory entries).
- Repeated "OO" tokens in the source are almost certainly $00 (zero) bytes.
- "Ol" appears where $01 is expected (single-character OCR confusion).
- Toward the end of the line there is a sequence shown as: 82 13 01 44 4F 53
  - $82 is the standard file-type byte for a closed PRG in CBM DOS 2.6/1541 (bit pattern 1000 0010).
  - $13 $01 look like a little-endian two-byte numeric field (likely sector count or file-size field stored as low/high or a two-byte file length /block count depending on format).
  - 44 4F 53 = ASCII "DOS" (appears verbatim in the entry dump).
- The presence of filename text, $A0 padding, and a trailing $82 file-type byte is consistent with a standard CBM directory entry layout (filename + padding + low-level numeric fields + file type/flags).

This node deliberately does not invent full entry offsets (the raw was incomplete/garbled), but documents the recoverable bytes and their likely interpretations based on standard C64/1541 directory formats.

## Source Code
```text
-- Original (raw/OCR) fragment provided:
68. 
■  34 
20 
57 
45 
44 
47 
45 
AO 
4  WEDGE. 
70; 
AO 
AO 
AO 
AO 
AO 
OO 
OO 
OO 
78: 
:  00 
oo 
OO 
OO 
OO 
00 
Ol 
OO 
80: 
OO 
oo 
82 
13 
Ol 
44 
4F 
53

-- Cleaned / best-effort hex + ASCII decode (OCR corrections applied):
(unknown-leading)  34 20 57 45 44 47 45  A0 A0 A0 A0 A0 00 00 00 ?? ?? 00 00 00 00 01 00 ?? ?? 82 13 01 44 4F 53
                   "4  W E D G E" (A0=A0=A0 padding)        (zeros)      (01)       82 13 01 "DOS"

Notes on the cleaned line above:
- "AO" -> $A0 (PETSCII space used to pad filenames in directory entries)
- "OO"/"oo" -> $00 (zero byte)
- "Ol" -> $01 (single-byte value 1)
- Unknowns marked as "??" where OCR garbled the nibble/byte (original had symbols like "68.", "■", "78:", "70;", etc.)
- Trailing sequence "82 13 01 44 4F 53" was parsed literally from the source, with $82 strongly suggesting a closed PRG file-type flag.
```

## References
- "file_entry_vic_#3" — expands on previous directory/file entry (ENTRY #3)
- "file_entry_dos_#5" — expands on next directory/file entry (ENTRY #5)
