# DOS Error Messages: Read and Write Evaluation Order (FDC / IP codes)

**Summary:** Order in which Commodore DOS evaluates errors during disk READ and WRITE operations, listing FDC job requests, FDC error codes ($XX), IP error codes (decimal), and textual messages (e.g. No Sync Character, Header Block Not Found, Checksum Error in Header Block, Disk ID Mismatch, Data Block Not Present, Write Protect On, Write-Verify Error, DOS Mismatch).

## Description
This chunk documents the sequence DOS uses to evaluate errors during a disk READ and a disk WRITE, and provides the mapping between:
- FDC Job Request (operation step like SEEK, READ, WRITE, VERIFY),
- FDC Error Code (hex with decimal),
- IP Error Code (decimal), and
- the textual Error Message returned by DOS.

DOS tests error conditions in the exact order shown in the READ ERRORS and WRITE ERRORS tables; it reports the first matching error encountered. FDC error codes are shown as hex ($..) with decimal in parentheses where present; IP error codes are shown as decimal numbers and map to the textual messages listed.

## Source Code
```text
READ ERRORS

FDC Job Request      FDC Error Code    IP Error Code    Error Message

SEEK                 $03 (3)           21               No Sync Character
SEEK                 $02 (2)           20               Header Block Not Found
SEEK                 $09 (9)           27               Checksum Error in Header Block
SEEK                 $0B (11)          29               Disk ID Mismatch
READ                 $02 (2)           20               Header Block Not Found
READ                 $04 (4)           22               Data Block Not Present
READ                 $05 (5)           23               Checksum Error in Data Block
READ                 $01 (1)           0                OK

WRITE ERRORS

FDC Job Request      FDC Error Code    IP Error Code    Error Message

WRITE                $0B (11)          73               DOS Mismatch
WRITE                $08 (8)           29               Disk ID Mismatch
WRITE                $07 (7)           26               Write Protect On
WRITE                $01 (1)           25               Write-Verify Error
VERIFY               $01 (1)           0                OK
```

## References
- "dos_error_descriptions" — expanded explanations for each error code and additional context.
