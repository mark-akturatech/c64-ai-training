# Directory: File Entry #8 (Track 18, Sector 1) — Raw hex & ASCII decode

**Summary:** Raw hex and ASCII dump for directory entry #8 from Track 18, Sector 1; includes filename fragments ("K ADDR C", "HANGE"), trailing padding bytes, and the final per-entry numeric bytes at the end of the sector.

**Decoded structure**

This chunk presents the tail end of a directory sector (Track 18, Sector 1) displaying bytes associated with directory entry #8. The fragments appear to be parts of the filename area split across offsets and the trailing numeric/padding bytes that follow each 32-byte directory entry. The source contains OCR artifacts (e.g., "OO" for "00"); these are preserved in the raw dump below but noted as likely zero bytes where appropriate.

Observed textual decodes (from the shown bytes):

- At offset E8: bytes decode to ASCII "K ADDR C" (4B 20 41 44 44 52 20 43).
- At offset F0: bytes decode to ASCII "HANGE" followed by zero bytes (48 41 4E 47 45 00 00 00).
- The following bytes at F8 appear as a sequence of mostly zero/padding bytes with a 04 present near the end of the shown fragment; the listing contains multiple "OO" tokens (likely OCR for 00). Exact semantic meaning of the trailing numeric bytes (file size low/high, track/sector pointers, or other per-entry fields) is not fully recoverable from this fragment alone.

Interpretation notes:

- Combining the two ASCII fragments yields a filename-like phrase "K ADDR C HANGE" (spaces preserved as shown). Whether this is the complete filename, a truncated portion, or an entry split across bytes is not determined from the fragment alone.
- The trailing bytes (shown with OO/00) are the per-entry numeric/padding area at the end of the sector; one non-zero byte shown is 04 (positioned near the end of the fragment).
- Because the dump appears truncated and contains OCR artifacts, treat exact byte values marked "OO" as uncertain (very likely 00).

## Source Code

```text
E8:  4B 20 41 44 44 52 20 43
      K   ␠  A  D  D  R  ␠  C
    -> "K ADDR C"

F0:  48 41 4E 47 45 00 00 00
      H  A  N  G  E  00 00 00
    -> "HANGE" + 00 padding

F8:  00 00 00 00 00 00 04 00
      00 00 00 00 00 00 04 00
    -> trailing per-entry numeric/padding bytes (many zeros; one 04 present)

Notes:
- "OO" and "oo" in the source appear to be OCR artifacts for hexadecimal 00.
- Periods (.) and stray colons in the original text were preserved where present; they likely reflect formatting/printing noise.
- The listing is a fragment (tail of the sector) not a full 32-byte aligned dump of a single entry.
```

## References

- "file_entry_pri_#7" — expands on previous directory/file entry (ENTRY #7)
- "directory_entries_intro_track18_sector1" — expands on sector header and context
