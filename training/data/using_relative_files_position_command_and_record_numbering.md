# Opening existing relative files and positioning with POSITION (OPEN, PRINT#, CHR$, REC HI/LO)

**Summary:** This guide explains how to open an existing relative file on the Commodore 64 using the `OPEN` command and how to position the file pointer for read/write operations with the `POSITION` command. It includes details on two-byte record numbering (REC HI/REC LO), conversion formulas, and examples.

**Opening an existing relative file**

To open an existing relative file, use the `OPEN` command. The DOS automatically detects the file type as relative:


If the file exists, it remains unchanged; the replace option will not erase an existing relative file. To delete a relative file, use the `SCRATCH` command.

Before reading or writing any record, you must position the file pointer to the desired record and byte position within the record using the `POSITION` command.

**POSITION command format and fields**

Positioning is achieved by sending a control string to the device channel with `PRINT#`. The control string begins with "P" followed by four `CHR$` bytes:

- `CHR$(channel# + 96)` — device channel encoded as ASCII (channel number + 96)
- `CHR$(rec#lo)` — low (least significant) byte of the record number
- `CHR$(rec#hi)` — high (most significant) byte of the record number
- `CHR$(position)` — byte offset within the record (0 = first byte)

The byte order for the record number is low byte first, then high byte.

`REC HI` and `REC LO` are required because record numbers can exceed 255; the two bytes form a 16-bit value.

Conversion formulas:

- `REC# = REC_HI * 256 + REC_LO`
- `REC_HI = INT(REC# / 256)`
- `REC_LO = REC# - REC_HI * 256`

Example calculation (REC# = 540):

- `REC_HI = INT(540 / 256) = 2`
- `REC_LO = 540 - 2 * 256 = 28`

Note: `POSITION` must be issued before any `INPUT#` or `PRINT#` device record operations.

**Record length example (mailing list)**

Example layout: a mailing list record with these field lengths:

- First name: 12
- Last name: 15
- Address line 1: 20
- Address line 2: 20
- City: 12
- State: 2
- Zip code: 9
- Phone number: 10
- **Total:** 100

To allow separators and prevent `INPUT#` from reading into the next record, allocate extra bytes per field; the example chooses a record length of 108 bytes. Often, a control record (record 1) is used to store the largest record number in use.

## Source Code

```basic
OPEN file#, device#, channel#, "name"
```


Below is a BASIC program that demonstrates creating and using a relative file, including setting up the file, writing records, and positioning for reading:

```basic
10 REM CREATE AND USE RELATIVE FILE
20 OPEN 15,8,15
30 INPUT "ENTER RELATIVE FILE NAME"; FI$
40 INPUT "ENTER RECORD LENGTH"; RL
50 OPEN 1,8,2,"0:" + FI$ + ",L," + CHR$(RL)
60 GOSUB 1000
70 PRINT "RELATIVE FILE "; FI$; " CREATED WITH RECORD LENGTH "; RL
80 CLOSE 1
90 CLOSE 15
100 END

1000 REM WRITE SAMPLE RECORDS
1010 FOR R = 1 TO 10
1020   PRINT#1, "RECORD NUMBER "; R
1030 NEXT R
1040 RETURN

1100 REM POSITION TO SPECIFIC RECORD
1110 INPUT "ENTER RECORD NUMBER TO READ"; REC
1120 RH = INT(REC / 256)
1130 RL = REC - 256 * RH
1140 PRINT#15, "P" + CHR$(2 + 96) + CHR$(RL) + CHR$(RH) + CHR$(0)
1150 INPUT#1, A$
1160 PRINT "RECORD "; REC; ": "; A$
1170 RETURN
```

This program prompts the user to enter a file name and record length, creates a relative file, writes sample records, and includes a routine to position to a specific record for reading.

## References

- "Commodore Disk Drive User's Guide" — provides detailed information on relative files and the POSITION command.