# raw_block_dump_d0_d8

**Summary:** Uninterpreted raw block-dump lines for offsets D0: and D8: containing hex bytes and ASCII translations from the DIR program's internal BASIC fragments; includes likely OCR/artifact characters (e.g., "Bl", "B*") that prevent a direct byte-for-byte certainty.

**Description**

This chunk preserves two raw block-dump lines as presented. Each line appears to be an 8-byte region labeled for the D0: and D8: offsets and followed by a loose ASCII translation column, but the text contains non-hex tokens and spacing artifacts that make automatic parsing unreliable. The data is from the DIR program's internal BASIC fragments; no address-to-register mapping is implied.

Notable points:

- The first line is labeled "do:" (lowercase o) in the source; this likely refers to offset D0: but the label is reproduced exactly in Source Code.
- Several tokens are not strict hex byte values (e.g., "Bl", "B*", "A7" appears valid). These should be treated as OCR/artifacts until verified against the original binary or a higher-quality scan.
- The ASCII translation column includes punctuation and parentheses; alignment is inconsistent.
- Do not treat these lines as register dumps (no Key Registers are provided).

## Source Code

```text
.    do:    8B  20  42  24  B3  Bl   C7  28   .    B*  ( 

.    D8:    33  34  29  20  A7  20  39  30  34)    .  90 
```

## References

- "raw_block_dump_c0_c8" — expands on C0: and C8: block-dump (previous group)
- "raw_block_dump_e0_e8_f0_f8" — expands on E0:/E8:/F0:/F8: block-dumps (next group)
- "raw_block_dump_b0_b8" — expands on B0: and B8: block-dump (related data)