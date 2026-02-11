# BASIC JOB QUEUE (1541 I/O: PRINT#15 / GET#15 retry loop)

**Summary:** BASIC subroutine implementing a 1541 "job queue" I/O exchange using PRINT#15 (drive command sequences "M-W" / "M-R"), GET#15 for single-byte responses, ASCII/CHR$ handling, a TRY retry counter (max 500), and error paths that CLOSE the channel and print a failure message.

**Description**
This chunk is a self-contained BASIC subroutine (lines REM JOB QUEUE … END) that performs these steps:
- Builds and sends 1541 command packets to device channel 15 using PRINT#15 and CHR$() bytes: an initial memory-write ("M-W") setup packet, a second "M-W" packet carrying the JOB byte, then a memory-read ("M-R") request.
- Uses GET#15 to read a single-character reply into E$; empty replies are normalized to CHR$(0) and converted to numeric with ASC(E$) into E.
- Uses TRY as a retry counter. On receiving a response with its high bit set (E > 127) the routine considers it an error/negative response and retries the exchange (increments TRY and reissues the write/read sequence).
- If TRY reaches 500 the code branches to the return path (line 540) to avoid infinite retry.
- On persistent failure the code CLOSEs channel 15 and prints a failure message, then ENDs.

Variables referenced but not defined here (must be set by the caller):
- T — track number (byte sent in CHR$)
- S — sector number (byte sent in CHR$)
- JOB — job/command payload byte sent in the second "M-W" packet

Behavior specifics preserved from source:
- Response normalization: empty GET#15 result becomes CHR$(0).
- Response interpretation: numeric E = ASC(E$); E > 127 treated as an error trigger that causes a retry.
- Maximum retry gate: TRY is compared to 500; if TRY = 500 the routine returns without further retries.
- Error path closes channel 15, prints a failure indicator with PETSCII-like control tokens (as present in source), and ends.

## Source Code
```basic
430 REM JOB QUEUE
440 TRY = 0
450 PRINT#15, "M-W"; CHR$(8); CHR$(0); CHR$(2); CHR$(T); CHR$(S)
460 PRINT#15, "M-W"; CHR$(1); CHR$(0); CHR$(1); CHR$(JOB)
470 TRY = TRY + 1
480 PRINT#15, "M-R"; CHR$(1); CHR$(0)
490 GET#15, E$
500 IF E$ = "" THEN E$ = CHR$(0)
510 E = ASC(E$)
520 IF TRY = 500 GOTO 540
530 IF E > 127 GOTO 470
540 RETURN
550 CLOSE 15
560 PRINT "<:down><:rvs>failed<:roff>"
570 END
```

## References
- "full_track27_error_annotation_and_single_sector_22_error_listing" — expands on commands used by the single-sector 22 error BASIC program to send/receive commands to the drive
- "single_sector_22_error_source_and_duplicate_error_intro" — expands on duplicate-22-error procedure which reuses the same I/O/job-queue logic
