# Directory File Entry #3 — Raw Hex + PETSCII Dump (Contains "VIC")

**Summary:** This section presents a raw hex and PETSCII dump of directory file entry #3, highlighting offsets $48, $50, $58, and $60. The entry includes the label "VIC" and fragments like "WEDG" and "-20". Several OCR ambiguities, such as "AO" and "OO"/"oo", are noted and addressed below.

**Entry Analysis**

This dump represents a directory file slot labeled "ENTRY #3" with offset markers at $48, $50, $58, and $60. It displays hex byte values alongside their PETSCII interpretations. The original source contains mixed-case characters and repeated "AO" and "OO"/"oo" tokens, likely resulting from OCR errors. Additionally, there's a discrepancy between the final PETSCII note ("C-6") and the hex bytes ("46 2D 36"), which decode to "F-6".

Notable decoded fragments include:

- **Offset $48:** Bytes 2D 32 30 20 57 45 44 47 decode to "-20 WEDG" in PETSCII.
- **Offset $50:** The byte sequence includes 45, followed by several ambiguous tokens ("AO", "OO", "oo", "E   ").
- **Offset $58:** Contains sequences like 00, "oo", 00, 00, 00, "OO", 04, "OO".
- **Offset $60:** Includes bytes 82 13 and 46 2D 36, which correspond to "F-6" in PETSCII.

The dump does not specify which directory fields these bytes correspond to (e.g., file type, track/sector pointers). The PETSCII interpretation is used for decoding, as the original source does not specify the character set.

## Source Code

```text
Original raw lines (as provided; preserve casing and spacing):

 VIC 

FILE 

ENTRY 

#3 

48: 

:  2D 

32 

30 

20 

57 

45 

44 

47 

-20  WEDG 

50: 

45 

AO 

AO 

AO 

AO 

OO 

OO 

OO 

E   

58 

:  00 

oo 

00 

00 

00 

OO 

04 

OO 

60: 

oo 

oo 

82 

13 

OO 

46 

2D 

36 

 C-6 
```

```text
Interpreted hex/PETSCII (assumptions noted below):

Offset $48:
2D 32 30 20 57 45 44 47    ; PETSCII: "-20 WEDG"

Offset $50:
45 40 40 40 40 00 00 00    ; "AO" interpreted as "40", "OO"/"oo" as "00"

Offset $58:
00 00 00 00 00 00 04 00    ; "oo" and "OO" interpreted as "00"

Offset $60:
00 00 82 13 00 46 2D 36    ; "oo" and "OO" interpreted as "00"

Notes:
- "AO" likely represents hex "40"; "OO"/"oo" likely represent hex "00".
- Hex 46 2D 36 decodes to PETSCII "F-6"; the trailing "C-6" conflicts with this byte sequence.
- PETSCII interpretation is used due to the absence of explicit character set declaration.
```

## Key Registers

The following VIC-II registers are relevant for character set manipulation:

- **Control Register 1 ($D011):** Bit 6 (ECM) and Bit 5 (BMM) control character mode settings.
- **Control Register 2 ($D016):** Bit 4 (MCM) controls multicolor mode.

For detailed information, refer to the [MOS Technology VIC-II documentation](https://en.wikipedia.org/wiki/MOS_Technology_VIC-II).

## References

- "file_entry_part_tw_#2" — expands on previous directory/file entry (ENTRY #2)
- "file_entry_c-6_wedge_#4" — expands on next directory/file entry (ENTRY #4)