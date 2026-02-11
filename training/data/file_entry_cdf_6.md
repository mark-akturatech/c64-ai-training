# Directory File Entry #6 — raw hex/ASCII dump and best-effort decode

**Summary:** Raw/OCRed hex and ASCII dump for a Commodore 1541-style directory entry (32-byte file entry). Contains PETSCII filename bytes (A0 padding), candidate file type/start-sector bytes, and OCR artifacts (AO/OO/oo/etc.). This chunk shows the decoded name fragment ("ALL") and trailing ASCII bytes ("PRI"), but the dump is corrupted, and several bytes are uncertain.

**Decoded fields and interpretation**

- **Context:** A Commodore 1541 directory entry is 32 bytes long. Canonical layout:

  - Byte 0: File type/flags
  - Byte 1: Start track
  - Byte 2: Start sector
  - Bytes 3–18: Filename (16 PETSCII bytes, padded with $A0)
  - Bytes 19–29: File-specific/reserved fields (REL record fields used when file type = REL)
  - Bytes 30–31: File size in blocks (little-endian)

- **Extracted from the source:**

  - The ASCII-decoded fragment "ALL" (hex 41 4C 4C) appears in the filename area.
  - Multiple PETSCII-space paddings ($A0) are present in the dump (OCR as "AO").
  - Several zero bytes ($00) appear (OCR as "OO" or "oo").
  - A trailing ASCII fragment "PRI" (hex 50 52 49) appears near the end of the supplied dump; this may be part of this entry or the next directory entry; the source is ambiguous.

- **Confidence:** Many tokens in the source are OCR-corrupted (AO → A0, OO/oo → 00, OB → 0B, CO: → C0, etc.). The mapping below is a best-effort normalization; uncertain bytes are marked with "??", and all OCR replacements are documented.

## Source Code

Original (verbatim, as provided — preserved for forensic checking):

```text
 CDF 

FILE 

ENTRY 

#6 

A8: 

:  59 

2F 

41 

4C 

4C 

AO 

AO 

AO 

Y/ALL 

BO. 

:  AO 

AO 

AO 

AO 

AO 

00 

OO 

00 

B8: 

oo 

OO 

OO 

OO 

00 

OO 

OB 

OO 

CO: 

:  00 

00 

82 

13 

09 

50 

52 

49
```

Best-effort normalized byte stream (OCR replacements applied):

- **Replacement rules used:** "AO" → A0, "OO"/"oo" → 00, "OB" → 0B, "BO." → B0 (likely), "CO:" → C0. Any token that could not be unambiguously converted is shown as "??".

- **Linear sequence extracted (hex tokens in the order they appear, NOT guaranteed to align exactly to entry offsets due to truncation/ambiguity):**

  ```text
  A8  59  2F  41  4C  4C  A0  A0  A0  ??  B0  A0  A0  A0  A0  A0
  00  00  00  B8  00  00  00  00  00  00  0B  00  C0  00  00  82
  13  09  50  52  49
  ```

- **ASCII/PETSCII decode notes (for printable bytes where applicable):**

  - 41 4C 4C → "ALL"
  - A0 → <PETSCII space>
  - 50 52 49 → "PRI" (ASCII)
  - Other bytes (A8, 59, 2F, B8, B0, C0, 82, 13, 09, 0B) are non-printable or control values in PETSCII/binary fields.

Annotated best-effort mapping of likely directory fields (marking uncertainty):

- **Byte 0 (file type/flags):** A8 (uncertain — OCR present)

  - **File type byte breakdown:**

    - Bits 0–3: File type

      - 0000 (0): DEL
      - 0001 (1): SEQ
      - 0010 (2): PRG
      - 0011 (3): USR
      - 0100 (4): REL

    - Bit 4: Not used
    - Bit 5: Used only during SAVE-@ replacement
    - Bit 6: Locked flag (Set produces ">" locked files)
    - Bit 7: Closed flag (Not set produces "*", or "splat" files)

  - **Interpretation of A8 (10101000 in binary):**

    - Bits 0–3: 1000 (8) — Invalid file type (valid range: 0–4)
    - Bit 6: 1 — Locked file
    - Bit 7: 1 — Closed file

  - **Conclusion:** A8 indicates a locked, closed file with an invalid file type. This suggests corruption or misinterpretation of the file type byte.

- **Byte 1 (start track):** 59 (hex) — May be a track number ($59 = 89 decimal — invalid for 1541 tracks, which range from 1 to 35), so this is likely corrupted or misaligned.

- **Byte 2 (start sector):** 2F (hex) — Plausible as a sector (0x2F = 47), but 1541 sectors per track vary between 17 and 21, so this is also suspect.

- **Bytes 3–18 (filename):** 41 4C 4C A0 A0 A0 ?? B0 A0 A0 A0 A0 A0 00 00 00

  - Printable fragment: "ALL" followed by PETSCII spaces.
  - The filename field contains multiple A0s (padding). Exact filename (leading/trailing) uncertain because of inserted unknown tokens (??, B0) and subsequent zero bytes.

- **Bytes 19–29 (reserved):** B8 00 00 00 00 00 00 0B 00 C0 00 (high uncertainty)

- **Bytes 30–31 (block count):** 00 82 (or could be 82 13 depending on misalignment) — uncertain; the two-byte block count usually sits at the final two bytes of the 32-byte entry, but the OCR stream shows additional bytes after 82, so the final block-count bytes cannot be confirmed.

- **Trailing fragment after the probable entry:** 13 09 50 52 49 — this likely includes the start of the next directory entry or extra data; "50 52 49" = "PRI".

## References

- "file_entry_dos_#5" — expands on previous directory/file entry (ENTRY #5)
- "file_entry_pri_#7" — expands on next directory/file entry (ENTRY #7)