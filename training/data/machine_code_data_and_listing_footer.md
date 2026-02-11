# Trailing BASIC DATA block (lines 1070–1150) — machine-code byte table tail

**Summary:** BASIC DATA statements (lines 1090–1150) containing decimal machine-code byte values used as a loader/data table; includes preceding RETURN/NEW markers and a short numeric footer ('160'). Contains apparent OCR/format corruption (misread line number, malformed numeric tokens).

**Description**
This chunk is the tail end of a BASIC program's machine-code DATA table. Lines 1070–1080 are BASIC control lines (RETURN, NEW). Lines 1090–1150 are DATA statements listing decimal byte values that are intended to be READ by BASIC and POKEd into memory as machine code. The final isolated line "160" appears to be a short numeric/footer line following the DATA block.

Notes:
- Values are given as decimal bytes (examples: 169, 133, 127, 32, 76, 141, 234).
- The DATA block is likely loaded by a BASIC loader that reads the DATA statements and pokes the bytes into memory for execution as 6502 machine code.
- The source shows repeated 234 values at the end of the block (decimal 234), but the final DATA line is corrupted/ambiguous in the transcription and may not reflect the original accurately.
- The line numbered "llOO" in the source appears to be an OCR misread of "1100".

## Source Code
```basic
1070  RETURN
1080  REM  NEW

1090  DATA 169, 0, 133, 127, 32, 0, 193, 169
1100  DATA 76, 141, 0, 6, 169, 199, 141, 1
1110  DATA 6, 169, 250, 141, 2, 6, 169, 224
1120  DATA 133, 3, 164, 81, 185, 49, 4, 133
1130  DATA 19, 185, 84, 4, 133, 18, 192, 35
1140  DATA 208, 240, 165, 3, 48, 252, 76, 148
1150  DATA 193, 234, 234, 234, 234, 234, 234, 234

160
```

## References
- "multiple_id_formatting_driver_source_listing" — expands on driver source using machine-code DATA tables loaded via BASIC DATA statements
