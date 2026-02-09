# Sector dump tail — offsets $F0/$F8 (ASCII fragments, 0x0D/0x2E padding)

**Summary:** Final bytes from a sector dump at offsets $F0 and $F8 showing ASCII fragments (bytes 4E, 20, 38, 33, 36 etc.), carriage-returns (0x0D), and trailing filler periods (0x2E). Contains raw hex/ASCII and an OCR-correction note.

## Description
This chunk is the tail of a record/string area and the trailing padding in a sector dump. Bytes at $F0..$F7 contain ASCII characters and CR (0x0D). Bytes at $F8..$FF are repeated period (0x2E) and CR (0x0D) bytes used as trailing filler/padding.

- 0x4E = 'N', 0x20 = space, 0x38/0x33/0x36 = ASCII digits '8','3','6'.  
- 0x0D = CR (carriage return).  
- 0x2E = '.' (period) used here as padding/filler bytes, alternating with CRs.

**[Note: Source may contain an error — the original dump used letter O in place of digit 0 (shown as "OD"); those have been corrected to 0D (hex).]**

## Source Code
```text
$F0: 4E 20 38 33 36 0D 33 36 0D   ; ASCII: "N 836<CR>36<CR>"
$F8: 2E 0D 0D 2E 0D 2E 0D 2E     ; ASCII: ".<CR><CR>.<CR>.<CR>."
```

(Interpretation: the $F0 region holds text bytes followed by CRs; the $F8 region is repeating '.' (0x2E) and CR (0x0D) byte pairs used as trailing padding.)

## References
- "ascii_block_D8_E0_callable" — continues the ASCII/text fragments in D8:/E0:/E8: