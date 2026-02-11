# KERNAL Error Codes (Commodore 64)

**Summary:** List of KERNAL error return codes (A = error number) with the carry flag set; includes codes 0–9 and 240. Note: some KERNAL I/O routines report errors via the READST routine instead of returning these codes.

## Error codes
When a KERNAL routine detects an error the carry flag is set and the accumulator (A) is loaded with the error number. The common KERNAL error numbers are listed below; some KERNAL I/O routines do not use these codes and instead report errors with the READST routine (see References).

Meaning of codes:
- 0: Routine terminated by the STOP key
- 1: Too many open files
- 2: File already open
- 3: File not open
- 4: File not found
- 5: Device not present
- 6: File is not an input file
- 7: File is not an output file
- 8: File name is missing
- 9: Illegal device number
- 240: Top-of-memory change (RS-232 buffer allocation/deallocation)

## Source Code
```text
+-----------------------------------------------------------------------+
| NOTE: Some KERNAL I/O routines do not use these codes for error       |
| messages. Instead, errors are identified using the KERNAL READST      |
| routine.                                                              |
+-----------------------------------------------------------------------+
+-------+---------------------------------------------------------------+
| NUMBER|                          MEANING                              |
+-------+---------------------------------------------------------------+
|   0   |  Routine terminated by the <STOP> key                         |
|   1   |  Too many open files                                          |
|   2   |  File already open                                            |
|   3   |  File not open                                                |
|   4   |  File not found                                               |
|   5   |  Device not present                                           |
|   6   |  File is not an input file                                    |
|   7   |  File is not an output file                                   |
|   8   |  File name is missing                                         |
|   9   |  Illegal device number                                        |
|  240  |  Top-of-memory change RS-232 buffer allocation/deallocation   |
+-------+---------------------------------------------------------------+
```

## References
- "readst_kernal_routine" — discussion of KERNAL READST usage for I/O errors