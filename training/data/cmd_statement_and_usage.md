# CMD statement (BASIC)

**Summary:** CMD <file number>[,string] — C64 BASIC I/O statement that redirects primary output (PRINT and LIST) from the screen to an OPENed file/device (disk/tape/printer/modem). Use PRINT# before CLOSE to "un-listen" the device and return output to the screen.

## Description
TYPE: I/O Statement  
FORMAT: <file number>[,string]

Action: CMD switches the BASIC primary-output device from the TV screen to the specified file/device. The file number must already be opened with OPEN. If the optional string argument is present, that string is sent immediately to the device (useful for titles or headers).

Effect:
- While CMD is in effect, PRINT statements and LIST output are sent to the referenced file/device in the same textual format they would appear on screen.
- To stop redirecting and restore the screen as the primary output, send a blank line to the device (un-listen) with PRINT#<file number> before CLOSEing the file — this ensures the device stops expecting further data and that buffered data is finalized.
- System errors (e.g., ?SYNTAX ERROR) will cause output to revert to the screen automatically. Devices remain "listening" after an error, so send a blank line with PRINT# before CLOSE following an error condition.

Caveats:
- The device/file must be OPENed with the correct parameters (see OPEN) prior to CMD.
- Consult the device's manual (printer/disk/tape) for device-specific buffering or finalization details.

## Source Code
```basic
OPEN 4,4: CMD 4,"TITLE" : LIST          REM LISTS PROGRAM ON PRINTER
PRINT#4: CLOSE 4                        REM UN-LISTENS AND CLOSES PRINTER

10 OPEN 1,1,1,"TEST" : REM CREATE SEQ FILE
20 CMD 1 : REM OUTPUT TO TAPE FILE, NOT SCREEN
30 FOR L = 1 TO 100
40 PRINT L: REM PUTS NUMBER IN TAPE BUFFER
50 NEXT
60 PRINT#1 : REM UNLISTEN
70 CLOSE 1 : REM WRITE UNFINISHED BUFFER, PROPERLY FINISH
```

## References
- "close_statement" — finalizing file output properly (PRINT# then CLOSE)
