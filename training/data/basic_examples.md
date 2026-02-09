# Commodore IEC Serial Bus — Common BASIC Programming Patterns

**Summary:** Common C64 BASIC IEC bus patterns for device 8 (floppy): program LOAD/SAVE, error-channel I/O via OPEN 15,8,15 and INPUT#15, sending drive commands with OPEN 15,"S:...", and sequential file read/write using OPEN/GET#/PRINT#.

## BASIC Patterns
- Loading a program from device 8 with cartridge-style load: use LOAD "FILENAME",8,1.
- Saving a program to device 8: use SAVE "FILENAME",8.
- Reading the drive error/status channel: open channel 15 to device 8 with secondary 15, then use INPUT#15 to receive the drive's error/status response.
- Sending drive commands (command channel): open channel 15 to device 8 with a command string such as "S:FILENAME" to scratch (delete) a file, then CLOSE the channel.
- Sequential file read: OPEN a channel with a filename and mode string like "DATAFILE,S,R", then GET# to read records; loop on the channel status variable (example uses ST) and CLOSE when done.
- Sequential file write: OPEN with "DATAFILE,S,W", then use PRINT# to write lines and CLOSE.

(Examples below show the exact BASIC syntax to use.)

## Source Code
```basic
  Loading a program:
    LOAD "FILENAME",8,1

  Saving a program:
    SAVE "FILENAME",8

  Reading the error channel:
    OPEN 15,8,15
    INPUT#15,A,B$,C,D
    PRINT A;B$;C;D
    CLOSE 15

  Sending a disk command:
    OPEN 15,8,15,"S:FILENAME"  ; Scratch (delete) a file
    CLOSE 15

  Sequential file read:
    OPEN 2,8,2,"DATAFILE,S,R"
    10 GET#2,A$
    20 IF ST=0 THEN PRINT A$;:GOTO 10
    CLOSE 2

  Sequential file write:
    OPEN 2,8,2,"DATAFILE,S,W"
    PRINT#2,"HELLO WORLD"
    CLOSE 2
```

## References
- "status_reporting_and_error_codes" — expands on reading and interpreting the error/status channel
- "assembly_examples_for_channel_io" — expands on equivalent operations in assembly via KERNAL calls