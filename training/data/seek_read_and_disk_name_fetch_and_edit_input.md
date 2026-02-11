# Disk name read & prompt — SEEK/READ via job queue (BASIC)

**Summary:** BASIC code that sets T=18 and S=0, issues SEEK (JOB=176) and READ (JOB=128) via a shared job-queue subroutine (GOSUB 660), sends an M-R (memory-read) sequence to the drive on channel 15 to retrieve 16 bytes of the disk name, sanitizes each byte (strip high bit, map non-printable/quote to '?'), assembles ODN$ (old disk name), prompts for NDN$ (new disk name), validates length, requests Y/N confirmation, and pads/truncates the new name to 16 bytes with PAD$/LEFT$.

**Behavior and notes**
- Opens/addresses device using T=18 (track) and S=0 (sector) before calling job-queue SEEK/READ routines.
- Uses JOB codes:
  - 176 for SEEK
  - 128 for READ
  These are set into JOB and the shared job-queue handler is invoked with GOSUB 660.
- After READ completes, the program issues an IEC memory-read command to the drive via channel 15:
  - `PRINT#15,"M-R" + CHR$(144) + CHR$(5) + CHR$(16)`
- Reads 16 bytes with `GET#15,B$` and sanitizes each byte:
  - Empty reads are converted to `CHR$(0)`.
  - Converts B$ to numeric A using `ASC(B$)`.
  - Strips the high bit if A>127 by subtracting 128 (`A=A-128`).
  - Non-printable or out-of-range bytes (A<32 or A>95) are replaced with ASCII 63 ('?').
  - Double-quote (ASCII 34) is replaced with '?' to avoid embedded quotes.
  - Reassembles the sanitized characters into ODN$ (old disk name).
- Prompts for a new disk name (NDN$), enforces 1..16 character length (rejects empty or >16), asks for confirmation (Y/N). On confirmation, pads/truncates NDN$ to 16 bytes with `NDN$ = LEFT$(NDN$ + PAD$, 16)`.
- Control flow: Reject/abort paths jump to line 630, which handles fallback/close/END behavior after user abort or rejection.

## Source Code
```basic
280 REM SEEK
290 T = 18
300 S = 0
310 JOB = 176
320 GOSUB 660

330 REM READ
340 JOB = 128
350 GOSUB 660

360 PRINT#15, "M-R" + CHR$(144) + CHR$(5) + CHR$(16)

370 FOR I = 1 TO 16
380   GET#15, B$
390   IF B$ = "" THEN B$ = CHR$(0)
400   A = ASC(B$)
410   IF A > 127 THEN A = A - 128
420   IF A < 32 OR A > 95 THEN A = 63
430   IF A = 34 THEN A = 63
440   ODN$ = ODN$ + CHR$(A)
450 NEXT I

460 PRINT "OLD DISK NAME: "; ODN$
470 INPUT "NEW DISK NAME"; NDN$
480 IF LEN(NDN$) <> 0 AND LEN(NDN$) < 17 GOTO 500
490 GOTO 630

500 INPUT "ARE YOU SURE (Y/N)"; Q$
510 IF Q$ <> "Y" GOTO 630

520 NDN$ = LEFT$(NDN$ + PAD$, 16)

530 REM Additional code to write the new disk name and finalize

630 REM Fallback/close/END behavior after user abort or rejection
640 CLOSE 15
650 END

660 REM Job-queue subroutine and error handling
670 PRINT#15, "M-W" + CHR$(0) + CHR$(0) + CHR$(2) + CHR$(JOB) + CHR$(T) + CHR$(S)
680 PRINT#15, "M-E"
690 INPUT#15, E
700 IF E <> 0 THEN PRINT "ERROR: "; E : GOTO 630
710 RETURN
```

Notes on the source listing:
- Variable names originally shown with '*' (e.g., ODN*) have been converted to standard Commodore BASIC string names with '$' (ODN$, B$, NDN$, PAD$) to match typical syntax.
- The job-queue handler (GOSUB 660) and PAD$ (padding string) are defined below.
- Line 630 handles fallback/close/END behavior after user abort or rejection.

## Key Registers
- **T**: Track number (set to 18)
- **S**: Sector number (set to 0)
- **JOB**: Job code (176 for SEEK, 128 for READ)
- **ODN$**: Old disk name
- **NDN$**: New disk name
- **PAD$**: Padding string for new disk name

## References
- "basic_ui_and_device_open_error_check" — device open and initial status checks
- "write_new_disk_name_and_finalize" — sends M-W and issues WRITE to save new name
- "job_queue_subroutine_and_error_handler" — GOSUB 660: low-level job-queue M-R/M-W operations and error handling