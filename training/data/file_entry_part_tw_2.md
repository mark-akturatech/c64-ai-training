# Directory File Entry #2 — Raw Hex + ASCII Dump ("PART TW")

**Summary:** This document provides a raw hexadecimal and ASCII dump of directory file entry #2 from a Commodore 64 disk, highlighting the filename " PART TW" and associated metadata. It includes byte values at specific offsets and addresses ambiguities due to OCR artifacts.

**Decoded Overview**

This section presents a low-level dump of directory entry #2. The clearly readable portion is the ASCII filename at offset $28: hex bytes 20 50 41 52 54 20 54 57, which decode to " PART TW" (leading space + "PART TW"). The remaining bytes at offsets $30, $38, and $40 contain numeric and padding fields but include OCR artifacts that make exact hex values ambiguous (e.g., letter "O" vs. digit "0", "AO" vs. "A0", "oo" vs. "00").

Reliable Decoding:

- **Offset $28:** 20 50 41 52 54 20 54 57 → ASCII " PART TW"

Ambiguities and Likely OCR Confusions:

- "OO", "oo" — likely "00" (hex zero) but could be letter 'O' in transcription.
- "AO" — likely "A0" (hex A0) but ambiguous.
- "4o:" — almost certainly "40:" (offset $40) with lowercase letter 'o' mistaken for zero.
- A boxed or special character "■" appears before one line; likely an artifact or replacement for an unreadable byte.

The following sections provide the original verbatim dump and a normalized transcription with annotations.

## Source Code

Original verbatim dump provided (unchanged):

```text
# byRiclianll - Raw hex + ASCII dump and decoded text for directory FILE ENTRY #2. Shows the bytes corresponding to the printed ASCII "PART  TW" as well as the entry's padding, numeric fields, and offsets. Includes the low-level byte values and the location markers for this entry within the sector dump.

 HOW 

FILE 

ENTRY 

#2 

28 

:  20 

50 

41 

52 

54 

20 

54 

57 

PART  TW 

30 

:  4F 

AO 

AO 

AO 

AO 

OO 

OO 

00 

O 

38 

:  oo 

oo 

OO 

00 

00 

00 

05 

OO 

4o: 

■  00 

oo 

82 

11 

09 

56 

49 

43 
```

Conservative normalized transcription with annotations (uncertain bytes marked with parentheses showing original glyphs). Offsets shown as hex labels from source:

```text
Offset $28:  20  50  41  52  54  20  54  57    ; ASCII: " PART TW"
Offset $30:  4F  (AO) (AO) (AO) (AO) (OO) (OO) 00 (O)
            ; interpreted bytes: 4F ?? ?? ?? ?? ?? ?? 00 ??
            ; original tokens: 4F AO AO AO AO OO OO 00 O
Offset $38:  (oo) (oo) (OO) 00 00 00 05 (OO)
            ; interpreted: ?? ?? ?? 00 00 00 05 ??
            ; original tokens: oo oo OO 00 00 00 05 OO
Offset $40:  ■  00 (oo) 82 11 09 56 49 43
            ; interpreted: ?? 00 ?? 82 11 09 56 49 43
            ; original tokens: ■ 00 oo 82 11 09 56 49 43
```

Notes:

- Parentheses show original glyphs that appear ambiguous (letter 'O' vs. zero, letter 'A' vs. hex digit).
- "OO", "oo" likely represent "00" but are left annotated because OCR may have substituted letter 'O' for zero.
- "AO" may be "A0" (hex A0) or the two-character sequence "A" and "O"; treat as uncertain.
- "4o:" is almost certainly "40:".
- The box glyph "■" likely replaces an unreadable byte or nonprinting character in the source; its hex value is unknown.

## References

- "file_entry_how_to_use_#1" — expands on previous directory/file entry (ENTRY #1)
- "file_entry_vic_#3" — expands on next directory/file entry (ENTRY #3)