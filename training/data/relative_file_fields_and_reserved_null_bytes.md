# Directory entry bytes $15-$1B — REL side-sector pointers, record size, and reserved nulls

**Summary:** Describes directory-entry byte fields $15 (21), $16 (22), and $17 (23) used by relative (REL) files (side-sector pointers and record size), and the following four bytes ($18-$1B) which are always unused/null ($00). Searchable terms: $15, $16, $17, REL file, side sectors, record size, directory entry.

**Description**
- Bytes $15 (hex) / 21 (dec) and $16 (hex) / 22 (dec) are a two‑byte pointer used only for relative (REL) files: they point to the first set of side sectors for the REL file.
- Byte $17 (hex) / 23 (dec) contains the record size (the fixed record length) with which the REL file was created.
- The next four bytes — $18, $19, $1A, $1B (dec 24–27) — are always unused for other file types and should be $00 (null).
- These fields are meaningful only when the directory entry's file type is REL (see related file type $84 in file_types_table_part2).

## Source Code
```text
Directory-entry byte map (reference):
Offset (hex) - Offset (dec) - Meaning
$15         - 21           - REL: pointer to first set of side sectors (first byte)
$16         - 22           - REL: pointer to first set of side sectors (second byte)
$17         - 23           - REL: record size (fixed record length)
$18-$1B     - 24-27        - Reserved / unused for non-REL files — set to $00
```

## References
- "file_types_table_part2" — expands on relative file type ($84) and REL-file semantics
