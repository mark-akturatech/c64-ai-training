# EXIGNT ($ACFC) — ASCII text for input error messages

**Summary:** $ACFC contains KERNAL ASCII text strings used by INPUT/READ error reporting: the two messages '?EXTRA IGNORED' and '?REDO FROM START', each terminated by a carriage return ($0D) and a zero byte ($00).

## Description
The ROM location starting at $ACFC (decimal 44284) stores two null-terminated (CR + $00) ASCII messages used by the BASIC INPUT/READ error-reporting code. The first string at $ACFC is "?EXTRA IGNORED" followed by $0D,$00. Immediately after it (at $AD0C) is the second string "?REDO FROM START" followed by $0D,$00. These exact strings are referenced by INPUT/READ error handling in the KERNAL/BASIC implementation.

## Source Code
```text
$ACFC: 3F 45 58 54 52 41 20 49 47 4E 4F 52 45 44 0D 00
        '?' 'E' 'X' 'T' 'R' 'A' ' ' 'I' 'G' 'N' 'O' 'R' 'E' 'D' CR NUL
        ; "?EXTRA IGNORED"<CR><0>

$AD0C: 3F 52 45 44 4F 20 46 52 4F 4D 20 53 54 41 52 54 0D 00
        '?' 'R' 'E' 'D' 'O' ' ' 'F' 'R' 'O' 'M' ' ' 'S' 'T' 'A' 'R' 'T' CR NUL
        ; "?REDO FROM START"<CR><0>
```

## Key Registers
- $ACFC-$AD1D - KERNAL ROM - ASCII text strings for INPUT/READ error messages ("?EXTRA IGNORED" and "?REDO FROM START", each terminated by CR ($0D) and NUL ($00))

## References
- "input_hash_statement" — expands on INPUT# behavior regarding EXTRA IGNORED
- "read_statement" — expands on READ/INPUT use of these messages during error conditions

## Labels
- EXIGNT
