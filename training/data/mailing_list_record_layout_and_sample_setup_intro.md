# Mailing-list relative-file example (CBM BASIC: OPEN, device 8, error 50, record tracker)

**Summary:** Example CBM BASIC program fragment demonstrating how to open a relative (L) file on device 8 with a specified record length (OPEN ... "...,L," + CHR$(108)), utilize the command channel (OPEN 1,8,15) to send drive/DOS commands, handle ERROR 50 (RECORD NOT PRESENT), and maintain a simple record-number tracker. Includes an error-handling subroutine and the foundation for a mailing-list management routine.

**Program Overview**

- **Channel Openings:**
  - `OPEN 1,8,15`: Opens the DOS command channel (channel 1) to the disk drive.
  - `OPEN 2,8,3,"0:MAILING LIST,L," + CHR$(108)`: Opens a logical channel (2) to device 8, secondary address 3, for the file "MAILING LIST" as a relative file ("L") with a record length of 108 bytes (specified by `CHR$(108)`).

- **Command Channel Operations:**
  - The program sends a sequence of bytes to the drive via `PRINT#1` to position the file pointer to a specific record. The byte sequence is:
    - `"P"`: Position command.
    - `CHR$(3+96)`: Secondary address (3) plus 96.
    - `CHR$(1)`: Low byte of record number.
    - `CHR$(0)`: High byte of record number.
    - `CHR$(1)`: Position within the record.

- **Error Handling:**
  - Lines 900–920 implement an error subroutine that captures the error code into variable `E`. Line 60 checks `IF E=50 THEN ...` to detect Error 50.
  - Error #50 indicates "RECORD NOT PRESENT," meaning the requested relative record does not exist yet; writing to that record will create it.

- **Record Length and Field Layout:**
  - The record length is set to 108 bytes. A typical mailing list record layout within this length could be:
    - First Name: 12 bytes
    - Last Name: 15 bytes
    - Address Line 1: 20 bytes
    - Address Line 2: 20 bytes
    - City: 12 bytes
    - State: 2 bytes
    - ZIP Code: 10 bytes
    - Phone Number: 15 bytes
    - Total: 106 bytes
  - The remaining 2 bytes can be used for field separators or future expansion.

- **Field Separators:**
  - Separator bytes (e.g., `CHR$(13)` for carriage return) are used between fields to delineate them. This practice ensures that each field can be accurately parsed when reading records.

## Source Code

```basic
5 X=0
10 OPEN 1,8,15
20 OPEN 2,8,3,"0:MAILING LIST,L," + CHR$(108)
30 GOSUB 900
40 PRINT#1 "P" CHR$(3+96) CHR$(1) CHR$(0) CHR$(1)
50 GOSUB 900
60 IF E=50 THEN PRINT#2,1:GOTO 40
70 INPUT#2,X
75 PRINT X
300 STOP:CLOSE 1:CLOSE 2:END
900 INPUT#1,E,B$,C,D: REM ERROR SUBROUTINE
910 IF (E=50) OR (E<20) THEN RETURN
920 PRINT E;B$;C;D:STOP:RETURN
```

## Key Registers

- **Logical File Number:** 2
- **Device Number:** 8
- **Secondary Address:** 3
- **Command Channel Logical File Number:** 1
- **Command Channel Secondary Address:** 15

## References

- Commodore 1541 User's Guide: Detailed information on relative files and error handling.
- Commodore 64 Programmer's Reference Guide: Insights into file operations and BASIC programming techniques.