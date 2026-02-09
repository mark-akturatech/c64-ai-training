# ATNCON — Table of ATN (arctangent) series constants ($E33E-$E376)

**Summary:** KERNAL data table ATNCON at $E33E-$E376 containing a one-byte counter and a sequence of 5-byte Commodore floating-point constants (Commodore 5-byte FP) used by the ATN (arctangent) series expansion routine.

## Table description
The table begins with a one-byte count (0x0B = 13) followed by a sequence of 5-byte floating-point constants (Commodore 5-byte FP format). These constants are the series coefficients used by the KERNAL ATN implementation.

- Location (as listed): $E33E - $E376
- First byte: 0x0B — claimed counter for 13 following constants
- Entries: a sequence of 5-byte FP values (comments give approximate decimal values and constant indices)

**[Note: Source inconsistencies]**
- The header/inline comment and the first byte (0x0B = 13) indicate 13 five-byte constants (13 × 5 = 65 bytes), which would require the table to extend to $E37F. The provided end address $E376 does not match that size — the address range vs. declared count appears inconsistent.
- The inline constant numbering skips "constant 4" (comments go 1,2,3,5,...). This may be a transcription/comment error in the source.

## Source Code
```asm
                                *** ATNCON: TABLE OF ATN CONSTANTS
                                The table holds a 1 byte counter and the following 5 byte
                                flpt constants.
.:E33E 0B                       ; 13 (one byte counter for ATN series)
.:E33F 76 B3 83 BD D3           ; -0.000684793912 (ATN constant 1)
.:E344 79 1E F4 A6 F5           ; 0.00485094216   (ATN constant 2)
.:E349 7B 83 FC B0 10           ; -0.161117018    (ATN constant 3)
.:E34E 7C 0C 1F 67 CA           ; 0.034209638     (ATN constant 5)
.:E353 7C DE 53 CB C1           ; -0.0542791328   (ATN constant 6)
.:E358 7D 14 64 70 4C           ; 0.0724571965    (ATN constant 7)
.:E35D 7D B7 EA 51 7A           ; -0.0898023954   (ATN constant 8)
.:E362 7D 63 30 88 7E           ; 0.110932413     (ATN constant 9)
.:E367 7E 92 44 99 3A           ; -0.14283908     (ATN constant 10)
.:E36C 7E 4C CC 91 C7           ; 0.19999912      (ATN constant 11)
.:E371 7F AA AA AA 13           ; -0.333333316    (ATN constant 12)
.:E376 81 00 00 00 00           ; 1               (ATN constant 13)
```

## Key Registers
(omitted — table is ROM data, not hardware registers)

## References
- "atn_routine" — expands on the ATN series implementation and uses of these constants