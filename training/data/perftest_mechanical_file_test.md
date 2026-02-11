# Mechanical/File-Level Drive Test (BASIC)

**Summary:** This BASIC program performs a mechanical and file-level test of a Commodore 1541 disk drive. It sequentially writes data to a file, reads it back to verify integrity, and then deletes the file. The program utilizes subroutines for I/O status handling, data writing, and data reading.

**Description**

This program conducts a comprehensive test of the disk drive's functionality:

- **Initialization:**
  - Opens the command channel to the disk drive for sending commands.
  - Prints test headings and sets the variable `tt` to 21.

- **Write Test:**
  - Opens a sequential file named "test file" for writing.
  - Calls a subroutine to handle the I/O status response.
  - Writes numbered data lines to the file using a dedicated subroutine.
  - Closes the file and checks the I/O status.

- **Read Test:**
  - Reopens the "test file" for reading.
  - Calls the I/O status response handler.
  - Reads back the data and verifies its integrity using a subroutine.

- **File Deletion:**
  - Sends a command to delete the "test file".
  - Calls the I/O status response handler to confirm deletion.

**Notes:**

- `cc$` is a string variable used to store messages for the I/O response handler.
- `ch` holds the channel number used by the read/write routines.
- The program assumes the command channel (channel 1) is already open to the drive.

## Source Code

```basic
1000 REM INITIALIZE COMMAND CHANNEL
1010 OPEN 1,8,15
1020 PRINT#1,"I0"
1030 CLOSE 1

1350 REM MECHANICAL/FILE-LEVEL DRIVE TEST
1360 PRINT "{DOWN}DRIVE PASS"
1370 PRINT "       MECHANICAL TEST{DOWN}"
1380 tt=21
1390 OPEN 2,8,2,"0:TEST FILE,S,W"
1400 cc$="OPEN WRITE FILE":GOSUB 1840
1410 ch=2:cc$="WRITE DATA":GOSUB 1930
1420 cc$="CLOSE "+cc$:GOSUB 1840
1430 OPEN 2,8,2,"0:TEST FILE,S,R"
1440 cc$="OPEN READ FILE":GOSUB 1840
1450 ch=2:GOSUB 1990
1460 PRINT#1,"S0:TEST FILE"
1470 cc$="SCRATCH FILE{DOWN}":tt=1:GOSUB 1840
```

## References

- "Commodore 1541 Disk Drive User's Guide" – Provides detailed information on disk drive commands and operations.
- "Commodore 64 Programmer's Reference Guide" – Offers insights into BASIC programming and disk I/O handling.
- "Commodore 1541 Test/Demo Diskette" – Contains example programs and utilities for testing and demonstrating disk drive functionality.
