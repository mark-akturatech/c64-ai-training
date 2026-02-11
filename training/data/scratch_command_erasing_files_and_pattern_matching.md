# SCRATCH (PRINT# 15, "S:name")

**Summary:** Use the PET/CBM disk command PRINT# 15, "SCRATCH:name" (abbreviated PRINT# 15, "S:name") to delete one or multiple files; supports pattern matching and wildcards. After a scratch, the disk error channel contains a number (normally the track number field) indicating how many files were scratched.

## Description
SCRATCH erases files from the disk and frees their blocks for reuse. You may specify a single filename or use pattern matching/wildcards to remove multiple files in one command.

Format:
- PRINT# 15, "SCRATCH:name"
- Abbreviated: PRINT# 15, "S:name"

Pattern matching/wildcard behavior (as used with SCRATCH):
- "?" matches a single character (example below).
- "*" matches zero or more characters (example below).
- Patterns are applied against directory filenames; any file matching the pattern is scratched.

Note on the error channel:
- After issuing a SCRATCH, check the disk error channel. The numeric field that is normally used for the track number will instead contain the number of files scratched by that command.

Examples from source:
- If the directory contains KNOW and GNAW, then:
  - PRINT# 15, "S:?N?W" will scratch both KNOW and GNAW.
- If the directory contains TEST, TRAIN, TRUCK, and TAIL, then:
  - PRINT# 15, "S:T*" will scratch all four files.

## Source Code
```basic
PRINT# 15, "SCRATCH:name"
PRINT# 15, "S:name"

PRINT# 15, "S:?N?W"   ' Example: matches KNOW and GNAW
PRINT# 15, "S:T*"     ' Example: matches TEST, TRAIN, TRUCK, TAIL
```

## References
- "pattern_matching_and_wildcards" — expands on pattern matching and wildcard rules used with SCRATCH
