# DIR program — raw block dump: offsets E0:, E8:, F0:, F8:

**Summary:** Raw block dump of the DIR program's internal BASIC fragments at offsets E0, E8, F0, and F8, displaying hex byte sequences and their PETSCII translations. The original data contains OCR artifacts, such as non-hex tokens like "Al" and "Bl", and mislabeling of offsets "EO" and "FO" (letter 'O' instead of zero).

**Block-dump overview**

This section presents four labeled 16-byte lines from a raw block dump. Each line includes:

- An offset label (E0:, E8:, F0:, F8:).
- A sequence of tokens intended to be hex bytes.
- A PETSCII translation column derived from the DIR program's embedded BASIC fragments.

The data appears to be output from a binary-to-text extraction and contains OCR or transcription artifacts:

- Some tokens are non-hex (e.g., "Al", "Bl").
- Some offset labels use the letter "O" instead of zero ("EO" / "FO").
- PETSCII translations are shown alongside the hex bytes.

Below the original raw lines is a best-effort interpreted table where valid hex bytes are converted to their hex notation and printable PETSCII characters where reasonably certain; non-hex tokens are flagged and left unmodified.

## Source Code

```text
Original raw lines (verbatim as provided):
.    EO:    00  00  05  6E  00  Al   23  31   #1 

.    E8:    2C  42  24  3A  8B  20  42  24   ,B*:.  B* 

.    FO:    B3  Bl   C7  28  33  34  29  A7  (34)  . 

.    F8:    20  99  42  24  3B  3A  89  31  .B*;:.l 
```

Best-effort interpreted mapping (valid hex bytes kept, non-hex tokens flagged; PETSCII shown where printable):

```text
Offset E0:  00  00  05  6E  00  [NON-HEX:Al]  23  31
  - hex bytes: $00 $00 $05 $6E $00 ?? $23 $31
  - printable: NUL NUL ENQ 'n' NUL [??] '#' '1'    (PETSCII mapping assumed)

Offset E8:  2C  42  24  3A  8B  20  42  24
  - hex bytes: $2C $42 $24 $3A $8B $20 $42 $24
  - printable: ',' 'B' '$' ':' [0x8B non-print] ' ' 'B' '$'

Offset F0:  B3  [NON-HEX:Bl]  C7  28  33  34  29  A7
  - hex bytes: $B3 ?? $C7 $28 $33 $34 $29 $A7
  - printable: [0xB3 non-print] [??] [0xC7 non-print] '(' '3' '4' ')' [0xA7 non-print]
  - side note: source shows "(34)" in parentheses as possible human annotation

Offset F8:  20  99  42  24  3B  3A  89  31
  - hex bytes: $20 $99 $42 $24 $3B $3A $89 $31
  - printable: ' ' [0x99 non-print] 'B' '$' ';' ':' [0x89 non-print] '1'
```

Notes:

- Bytes in the $80–$FF range (e.g., $8B, $B3, $C7, $A7, $99, $89) are likely PETSCII control/graphic codes or binary data inside a BASIC tokenized fragment.
- The raw PETSCII column in the source includes tokens like "#1", ",B*:.  B*", "(34)", ".B*;:.l" — these were preserved in the verbatim block above and not converted except in the interpreted mapping where possible.

## References

- "raw_block_dump_d0_d8" — expands on D0: and D8: block-dump (previous group).
- "raw_block_dump_c0_c8" — expands on C0: and C8: block-dump (related earlier data).
- "raw_block_dump_b0_b8" — expands on B0: and B8: block-dump (related earlier data).