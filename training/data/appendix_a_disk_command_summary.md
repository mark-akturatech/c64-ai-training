# Disk Command Quick Reference (PRINT# forms)

**Summary:** PRINT# file I/O command forms for Commodore disk operations: NEW, COPY, RENAME, SCRATCH, INITIALIZE, VALIDATE, BLOCK-READ/WRITE/ALLOCATE/FREE, BUFFER-POINTER, USER1/2, POSITION, BLOCK-EXECUTE, MEMORY-READ/WRITE/EXECUTE, and USER commands using PRINT# syntax and CHR$ argument encoding.

## Command formats
General format for all commands sent to the disk device: PRINT#file#, command

- CHR$(...) byte-encoding is used where numeric bytes must be sent (e.g. channel, drive, track, block, address low/high, counts).
- The quoted command token (first character or token) selects the disk command; parameters follow in the required order, separated by semicolons where shown.
- "Duplicate" is not available for single-drive systems (source note).

## Source Code
```basic
' PRINT# forms (command tokens and parameter order)
PRINT#file#, "N                ' NEW
PRINT#file#, "C:new file=:original file   ' COPY
PRINT#file#, "R:new name=old name        ' RENAME
PRINT#file#, "S:file name               ' SCRATCH
PRINT#file#, "I                        ' INITIALIZE
PRINT#file#, "V                        ' VALIDATE
' DUPLICATE          not for single drives

PRINT#file#, "B-R:"; channel; drive; track; block    ' BLOCK-READ
PRINT#file#, "B-W:"; channel; drive; track; block    ' BLOCK-WRITE
PRINT#file#, "B-A:"; drive; track; block             ' BLOCK-ALLOCATE
PRINT#file#, "B-F:"; drive; track; block             ' BLOCK-FREE
PRINT#file#, "B-P:"; channel; position               ' BUFFER-POINTER

PRINT#file#, "Un:"; channel; drive; track; block      ' USER1 and USER2 (USER commands variant)

' POSITION uses raw byte values via CHR$
' Example parameter order: CHR$(channel#) CHR$(rec#lo) CHR$(rec#hi) CHR$(position)
PRINT#file#, "P"; CHR$(channel#); CHR$(rec_lo); CHR$(rec_hi); CHR$(position)

PRINT#file#, "B-E:"; channel; drive; track; block     ' BLOCK-EXECUTE

' MEMORY operations use CHR$ for 16-bit addresses and counts/data
PRINT#file#, "M-R"; CHR$(addr_lo); CHR$(addr_hi)     ' MEMORY-READ
PRINT#file#, "M-W"; CHR$(addr_lo); CHR$(addr_hi); CHR$(#chars); "data"  ' MEMORY-WRITE
PRINT#file#, "M-E"; CHR$(addr_lo); CHR$(addr_hi)     ' MEMORY-EXECUTE

' USER Commands generic form:
PRINT#file#, "Un"
```

## References
- "disk_command_summary" — expanded succinct command summary used in in-chapter examples
- "appendix_b_error_code_summary_list" — Appendix B: disk error code list and meanings
