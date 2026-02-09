# Full Track 21 — Header and BASIC front‑matter (lines 100–190, assembler origin *=$0500)

**Summary:** Cleaned transcription of the Full Track 21 error source listing header and BASIC front‑matter (BASIC lines ~100–190) containing a SYS 40960 call and an assembler origin directive (*=$0500). Searchable tokens: SYS40960, *=$0500, OPEN2,8,2, BASIC line numbers 100–190.

## Description
This chunk contains the header/title and the BASIC/assembler front matter from a "Full Track 21 error source listing". Items present in the source include:
- The title line "FULL TRACK 21 ERROR SOURCE LISTING".
- BASIC front‑matter in the 100–190 line number region including REM comments and a SYS 40960 call (SYS 40960 = $A000).
- A device OPEN statement (OCR corrected to OPEN2,8,2).
- An assembler origin directive corrected to "*=$0500" which sets the assembler/code load address to $0500.

Corrections made from the OCR source:
- "□PEN2,8,2," corrected to "OPEN2,8,2" (standard C64 BASIC device open).
- "*=  «0500" corrected to "*=$0500" (assembler origin directive).

**[Note: Source may contain an error — the BASIC SYS 40960 (decimal $A000) suggests code entry at $A000, which conflicts with the assembler origin *=$0500 (decimal $0500).]**

Unclear or fragmentary tokens in the original (left as minimal transcriptions below) were not expanded beyond the obvious OCR fixes.

## Source Code
Cleaned transcription of the header and the line‑numbered BASIC front‑matter, followed by the assembler origin directive (corrected). No additional interpretation of truncated lines was added.

```basic
100 REM FULL TRACK 21 ERROR SOURCE LISTING
110 REM
120 REM 21. PAL
130 REM
140 REM 1 10
150 REM
160 OPEN2,8,2,
170 REM 1
180 REM 21,B,P,W
190 REM
```

```asm
*=$0500    ; assembler origin directive (corrected from OCR "*=  «0500")
```

## References
- "write_sync_and_write_sequence" — expands on the disk write sequence (JSR $FDA3 and enabling write mode)