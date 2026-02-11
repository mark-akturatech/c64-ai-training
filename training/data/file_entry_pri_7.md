# Directory FILE ENTRY #7 — raw hex & ASCII dump (decoded)

**Summary:** Raw hex and ASCII dump for disk directory FILE ENTRY #7, showing filename fragments ("PRI", hex sequence 4E 54 45 52 20 54 45 53 => "NTER TES"), numeric/offset bytes (00, 09, 82, 10, 44 49 53), and several OCR/artifact bytes. Useful for reconstructing the directory slot (filename bytes, padding, and sector pointers).

**Description**

This chunk is a decoded transcription of a directory entry (slot #7) from a Commodore 1541 disk. It preserves the literal hex bytes present in the dump, a plain ASCII/PETSCII decode for the printable ranges, and notes on uncertain/OCR'd bytes. Key facts visible in the dump:

- A visible ASCII fragment "PRI" (separately shown in the source text).
- A contiguous hex run 4E 54 45 52 20 54 45 53 which maps to ASCII "NTER TES" (hex 0x4E='N', 0x54='T', 0x45='E', 0x52='R', 0x20=' ', 0x54='T', 0x45='E', 0x53='S').
  - Combining the earlier "PRI" fragment with this run yields the filename fragment "PRI NTER TES" — plausibly "PRINTER TES" (possible final "T" may or may not be present elsewhere).
- Several bytes interpreted as numeric/pointer fields appear after the filename bytes, e.g., 00 00 00 (padding), and a set including 09, 82, 10 and a trailing sequence 44 49 53 (ASCII "DIS").
- The dump contains many OCR/artifact placeholders labeled "OO", "oo", "AO", "EO." which are unclear and treated as uncertain values in the cleaned transcription below.

No chip registers are involved; this is raw disk-directory data (track/sector and filename bytes).

## Source Code

```text
-- Cleaned / interpreted dump (grouped by source markers shown in the original)

Header/context lines:
PRI
FILE ENTRY #7

Block labeled "C8:" (hex bytes following)
C8:
  4E  54  45  52  20  54  45  53
  ^   ^   ^   ^   ^   ^   ^   ^
  N   T   E   R  (space) T   E   S    -> ASCII: "NTER TES"

Inline note in source: "NTER  TES"

Next bytes / possible file-type / padding / numeric fields (original shows some OCR artifacts)
DO. :  54      <-- literal "54" appears on the DO line (0x54 = 'T')
AO AO AO AO 00 00 00   <-- "AO" likely OCR for "00" or unknown bytes; then three 00 padding bytes

Block labeled "D8:" (many uncertain/OCR bytes in original)
D8:
  oo OO OO 00 OO OO 09 OO EO.
  :  oo OO 82 10 OO 44 49 53

Interpretation notes for D8 block:
- "oo", "OO", "AO", "EO." entries are ambiguous / OCR artifacts — not reliable hex digits.
- Explicit hex/decimal-looking bytes present: 00, 09, 82, 10, 44, 49, 53
  - 44 49 53 => ASCII "DIS"
  - 09, 82, 10 are likely numeric bytes (could be track/sector or file-type/flags depending on original format)

-- End of cleaned transcription
```

(Copy of original raw fragment as provided)

```text
 PRI 

FILE 

ENTRY 

#7 

C8: 

4E 

54 

45 

52 

20 

54 

45 

53 

NTER  TES 

DO. 

:  54 

AO 

AO 

AO 

AO 

00 

00 

00 

T 

D8: 

oo 

OO 

OO 

00 

OO 

OO 

09 

OO 

EO. 

:  oo 

OO 

82 

10 

OO 

44 

49 

53 
```

## References

- "file_entry_cdf_#6" — expands on previous directory/file entry (ENTRY #6)
- "file_entry_dis_addr_change_#8" — expands on next directory/file entry (ENTRY #8)