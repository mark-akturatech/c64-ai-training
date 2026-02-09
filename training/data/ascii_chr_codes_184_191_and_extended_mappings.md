# CHR$ table fragment: codes 184–191 and extended-code mappings

**Summary:** Final Commodore 64 CHR$ table fragment showing printable CHR$ codes 184–191 and the extended-code mapping rules: CODES 192–223 = 96–127, CODES 224–254 = 160–190, CODE 255 = 126. Useful for lookups when converting byte values to displayed glyphs.

## Fragment
This chunk contains the printed-matrix fragment for CHR$ values 184–191 as presented in the original reference plus the accompanying summary lines that map higher-valued CHR$ codes to earlier ranges. The fragment is the final table fragment (page footer removed) and does not show glyph artwork — only the numeric CHR$ codes as printed in the original documentation.

## Extended-code mapping
- Codes 192–223 are identical to codes 96–127 (i.e., these bytes display the same glyphs as 96–127).
- Codes 224–254 are identical to codes 160–190 (i.e., these bytes display the same glyphs as 160–190).
- Code 255 is identical to code 126.

These mappings are the document's canonical remappings for the high-byte range of CHR$ values.

## Source Code
```text
  +-----------------+-----------------+-----------------+-----------------+
  |  PRINTS   CHR$  |  PRINTS   CHR$  |  PRINTS   CHR$  |  PRINTS   CHR$  |
  +-----------------+-----------------+-----------------+-----------------+
  |           184   |           186   |           188   |           190   |
  |           185   |           187   |           189   |           191   |
  +-----------------+-----------------+-----------------+-----------------+

  CODES 192-223 SAME AS  96-127
  CODES 224-254 SAME AS 160-190
  CODE 255 SAME AS 126
```

## References
- "appendix_c_intro_and_ascii_chr_codes_0_63" — intro and CHR$ table covering codes 0–63  
- "ascii_chr_codes_68_183" — middle CHR$ table covering codes 68–183 (letters, function keys, colors)