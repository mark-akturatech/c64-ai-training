# Labeled sector-offset block: A8:, B0:, B8: (directory/relative-file side sectors)

**Summary:** Byte-by-byte hex dump for offsets A8:, B0:, and B8: showing many 00 markers; represents three contiguous offset records in directory/relative-file side sectors (precedes C0: transition to ASCII text). Useful for understanding the structure of directory/relative-file sector layouts.

**Description**

This chunk presents a labeled hex dump covering three contiguous sector-offset records labeled A8:, B0:, and B8:. Each label corresponds to a 16-byte row, a common format in hex dumps. The data is part of the directory/relative-file side sectors and is followed by the C0: row, which contains a transition toward ASCII-text bytes.

Observations:

- **Row Labels:** The labels A8:, B0:, and B8: indicate sequential 16-byte offsets (A8 → B0 → B8), following a conventional hex-dump stride of +8 (hex) between row labels.
- **Zero Padding:** Many bytes are 00, suggesting zero-padding or null entries in these sector records.
- **Ambiguous Tokens:** The original source contained "OO" tokens, which are likely OCR artifacts representing "00" (zero bytes). This has been corrected in the dump below.
- **Label Correction:** The second row label appeared as "BO:" in the source text; this has been corrected to "B0:" (with a zero) to maintain consistency with hexadecimal notation.

The structure of relative file side sectors is as follows:

- **Bytes 0-1:** Track and sector of the next side sector block.
- **Byte 2:** Side sector number (0-5).
- **Byte 3:** Record length.
- **Bytes 4-5:** Track and sector of the first side sector (number 0).
- **Bytes 6-7:** Track and sector of the second side sector (number 1).
- **Bytes 8-9:** Track and sector of the third side sector (number 2).
- **Bytes 10-11:** Track and sector of the fourth side sector (number 3).
- **Bytes 12-13:** Track and sector of the fifth side sector (number 4).
- **Bytes 14-15:** Track and sector of the sixth side sector (number 5).
- **Bytes 16-255:** Track and sector pointers to 120 data blocks.

This structure allows the DOS to manage relative files efficiently by maintaining pointers to data blocks and side sectors. ([s3.amazonaws.com](https://s3.amazonaws.com/com.c64os.resources/weblog/sd2iecdocumentation/manuals/1541-II_Users_Guide.pdf?utm_source=openai))

## Source Code

```text
A8: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
B0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
B8: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
```

## References

- "hex_dump_initial_zero_padding" — expands on preceding zero-padding and context for initial bytes
- "sector_offset_C0_and_transition_to_text" — expands on the following C0: row and the transition toward ASCII text bytes