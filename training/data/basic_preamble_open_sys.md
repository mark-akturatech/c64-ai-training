# BASIC preamble: REM lines, OPEN2 to device 8 with "@0:" command string, and SYS40960 ($A000)

**Summary:** BASIC preamble with REM comments, an OPEN 2,8,2,"@0: FAD.  B, P,  W" device command string (device 8, secondary 2, channel 2), and a machine-code call SYS40960 (decimal) — address $A000. Contains OCR artifacts in the source (□PEN2, stray "5").

## Description
This chunk is the BASIC-side invocation and descriptive REMs for a machine-code driver:

- REM lines: short descriptive comments. The first REM contains "FAD. PAL" (likely the driver/format name and TV standard indicator; PAL = television standard).
- OPEN 2,8,2,"@0: FAD.  B, P,  W": opens channel 2 to device 8 with secondary address 2 and sends the command string "@0: FAD.  B, P,  W" to the drive (the "@0:" prefix targets drive 0). The remainder of the string is driver-specific data/command text (do not assume standard file type semantics).
- SYS40960: issues a machine-code call to decimal 40960, which is $A000 — a common load/run address for cartridges or resident drivers on the C64.

**[Note: Source may contain OCR/artifact errors — '□PEN2' should be 'OPEN2', and a stray "5" appears after SYS40960; the "5" is likely not part of the intended BASIC listing.]**

## Source Code
```basic
REM  FAD. PAL
REM

OPEN2,8,2,"@0: FAD.  B, P,  W"
REM

SYS40960
```

## References
- "listing_title_and_basic_line_numbers" — expands on listing header and BASIC line numbers
- "assembler_directives_origin_equates" — expands on assembly directives and equates that follow the BASIC preamble