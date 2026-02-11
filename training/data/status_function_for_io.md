# STATUS (ST)

**Summary:** STATUS (a.k.a. ST) is the KERNAL-supplied integer status value for the last I/O operation on any open file or peripheral; it uses bit flags (bit positions and numeric values) to report cassette, serial-bus, tape-verify/load, EOF/EOT, device-present and checksum conditions.

## Description
STATUS is a system-defined integer function/variable (FORMAT: STATUS) that returns the completion/status code for the most recent input/output operation performed on an open file or peripheral device. The KERNAL stores the status in the system variable ST; the BASIC keyword STATUS returns that value. The value is an 8-bit bitfield where each bit indicates a particular condition (numeric values 1,2,4,8,16,32,64, and the sign-bit shown as -128 in the original table).

Common checks:
- Test individual conditions with bitwise AND, e.g. IF STATUS AND 64 THEN ... (handles end-of-file).
- Test for any I/O error condition with IF ST > 0 THEN ... (as used in examples).

(Note: the table below presents the bit positions, their numeric values, and how they map to cassette read errors, serial-bus R/W conditions, and tape verify/load conditions. Bit 7 is shown as -128 in the source (two's-complement sign-bit).)

## Source Code
```text
+---------+------------+---------------+------------+-------------------+
|  ST Bit | ST Numeric |    Cassette   |   Serial   |    Tape Verify    |
| Position|    Value   |      Read     |  Bus R/W   |      + Load       |
+---------+------------+---------------+------------+-------------------+
|    0    |      1     |               |  time out  |                   |
|         |            |               |  write     |                   |
+---------+------------+---------------+------------+-------------------+
|    1    |      2     |               |  time out  |                   |
|         |            |               |    read    |                   |
+---------+------------+---------------+------------+-------------------+
|    2    |      4     |  short block  |            |    short block    |
+---------+------------+---------------+------------+-------------------+
|    3    |      8     |   long block  |            |    long block     |
+---------+------------+---------------+------------+-------------------+
|    4    |     16     | unrecoverable |            |   any mismatch    |
|         |            |   read error  |            |                   |
+---------+------------+---------------+------------+-------------------+
|    5    |     32     |    checksum   |            |     checksum      |
|         |            |     error     |            |       error       |
+---------+------------+---------------+------------+-------------------+
|    6    |     64     |  end of file  |     EOI    |                   |
+---------+------------+---------------+------------+-------------------+
|    7    |   -128     |  end of tape  | device not |    end of tape    |
|         |            |               |   present  |                   |
+---------+------------+---------------+------------+-------------------+
```

```basic
10 OPEN 1,4:OPEN 2,8,4,"MASTER FILE,SEQ,W"
20 GOSUB 100:REM CHECK STATUS
30 INPUT#2,A$,B,C
40 IF STATUS AND 64 THEN 80:REM HANDLE END-OF-FILE
50 GOSUB 100:REM CHECK STATUS
60 PRINT#1,A$,B;C
70 GOTO 20
80 CLOSE1:CLOSE2
90 GOSUB 100:END
100 IF ST > 0 THEN 9000:REM HANDLE FILE I/O ERROR
110 RETURN
```

## References
- "open_statement_and_file_device_management" — expands on STATUS relevant to file/device operations after OPEN/INPUT#/PRINT#

## Labels
- ST
- STATUS
