# Crunching BASIC Programs (Commodore 64)

**Summary:** Techniques to shorten Commodore 64 BASIC programs (crunching) using keyword abbreviations, shorter line numbers, multiple statements per line, and REM/comment removal; notes on LIST vs SAVE behavior and BASIC tokenization.

## Overview
Crunching is the deliberate shortening of BASIC source so the program uses less RAM and leaves more room for runtime data. Motivations include fitting a program into limited memory, and preserving free RAM for arrays, strings, or user-entered data (inventories, text, numbers).

The Commodore 64 stores BASIC keywords as tokens when a program is saved (tokenization). LIST shows the full keywords (expanded), but the saved program keeps the compact token form. The common PRINT abbreviation is the question mark (?) which stands for PRINT.

## Techniques
- Abbreviating keywords
  - Use BASIC abbreviations (e.g., ? for PRINT). A full list is provided in Appendix A (not included here).
  - Abbreviations let you pack more text per line. Note: LIST will display full-length keywords even if you entered abbreviations.
  - Typical workflow: write and debug with full keywords, then replace with abbreviations immediately before SAVEing.

- Line-number shortening
  - Use fewer digits in line numbers where possible to save characters (e.g., 10,20,30 instead of 1000,1010).
  - Reorganize line-number gaps to minimize number length while preserving structure (e.g., reserve larger gaps only when needed for inserts).

- Multiple statements per line
  - Put more than one statement on a line separated by ":" (use ":" to separate statements).
  - This reduces the overhead of additional line numbers and line starts.

- REM/comment removal
  - Remove unnecessary REM statements or shorten comments to save space.
  - Consider using no REM or minimal comments in the final, crunched version.

## Additional notes on LIST/SAVE and editing
- LIST shows expanded keywords and may display a single program line as more than one screen line (80 characters == 2 screen lines).
- If a line exceeds 80 characters when shown with full keywords and you need to edit it, you must re-enter that line using abbreviations before SAVEing (because the expanded LIST view can prevent direct editing of the long, expanded line).
- SAVE writes tokenized keywords so the saved file does not inflate by storing full keyword text (keywords are stored as tokens). (tokenization: keywords stored as single tokens)

## References
- "abbreviating_keywords_and_tokenization" — expands on BASIC keyword abbreviations and tokenization