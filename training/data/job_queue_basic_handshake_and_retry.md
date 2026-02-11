# BASIC Job Queue — Drive Handshake & Retry Loop (Channel 15)

**Summary:** This Commodore 64 BASIC subroutine implements a handshake mechanism with the disk drive over IEC channel 15. It sends "M-W" (memory-write) commands containing job identifiers and track/sector information using `PRINT#15` and `CHR$()`, polls the drive with "M-R" (memory-read) commands using `GET#15`, converts the response via `ASC()`, and retries with a counter (`TRY`) up to a limit of 500. On timeout, it closes the channel and prints a failure message.

**Description**

This BASIC routine facilitates communication with the disk drive by sending command blocks and awaiting responses. Key behaviors include:

- **Initialization:** The `TRY` counter is set to 0 (line 580) to track retry attempts.
- **Sending Commands:** Two `PRINT#15` statements send "M-W" commands:
  - The first writes a block of data to the drive's memory, including control bytes and track/sector information.
  - The second writes the job identifier.
- **Polling for Response:** The routine sends an "M-R" command to read the drive's response and processes it:
  - Reads a single character from the drive.
  - Converts it to its numeric ASCII code.
  - Checks if the response indicates a retry is needed (bit 7 set).
- **Retry Mechanism:** If the response requires a retry and the `TRY` counter is less than 500, the routine repeats the process.
- **Timeout Handling:** If `TRY` reaches 500, the routine closes the channel and prints a failure message.
- **Assumptions:**
  - Channel 15 is already open elsewhere in the program.
  - Variables `JOB`, `T`, and `S` (job ID, track, and sector) are set prior to calling this routine.

## Source Code

```basic
570 REM JOB QUEUE
580 TRY=0

590 PRINT#15,"M-W";CHR$(8);CHR$(0);CHR$(4);CHR$(T);CHR$(S);CHR$(T);CHR$(S)

600 PRINT#15,"M-W";CHR$(1);CHR$(0);CHR$(JOB)

610 TRY=TRY+1

620 PRINT#15,"M-R";CHR$(1);CHR$(0)

630 GET#15,E$

640 IF E$="" THEN E$=CHR$(0)

650 E=ASC(E$)

660 IF TRY=500 THEN GOTO 690

670 IF E>127 THEN GOTO 610

680 RETURN

690 CLOSE 15

700 PRINT "  CDOWNJ  <:RVS>FAILED<R0FF>  "
710 END
```

*Note: Semicolons in `PRINT#15` statements prevent automatic spaces; `CHR$()` is used for single-byte literals; `GET#15` reads into `E$`.*

## References

- "track23_error_data_bytes" — details the data bytes sent/loaded into the drive by this routine.
- "track23_error_source_listing_assembly" — provides the full assembly source for the corresponding drive-side routine.
