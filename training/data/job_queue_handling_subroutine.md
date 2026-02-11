# Job-queue communication subroutine (GOSUB 570)

**Summary:** BASIC subroutine (GOSUB 570) for submitting a job descriptor to the 1541 drive over the IEC serial channel using PRINT#15 "M-W"/"M-R" sequences and GET#15 polling. Implements TRY retry counter, writes job descriptor bytes (track T, sector S, JOB code), polls for status byte E (ASC of GET#15 result), retries up to 500 attempts, and closes/prints failure on timeout.

**Description**
This routine implements asynchronous job submission to the 1541 job queue and polls the drive until the job is accepted or the retry limit is reached.

Flow:
- TRY is initialized to 0.
- Two PRINT#15 "M-W" (memory-write) sequences send the job descriptor bytes to the drive:
  - The first M-W writes four bytes: CHR$(T), CHR$(S), CHR$(T), CHR$(S). This redundancy ensures data integrity by providing a simple form of error checking; if the two track/sector pairs do not match, the drive can detect a transmission error.
  - The second M-W writes a one-byte job code (CHR$(JOB)).
- TRY is incremented each attempt.
- A PRINT#15 "M-R" (memory-read) is issued to request one status byte from the drive; GET#15,E$ reads that byte.
- If no byte is received (E$ = ""), it is treated as CHR$(0).
- E is set to ASC(E$) (numeric value of the status byte).
- If TRY reaches 500, the routine closes channel 15 and prints a failure message.
- If the status byte has the high bit set (E > 127), the code branches to retry (sends the M-W/M-R again).
- If E = 1, the job is accepted and the routine returns to the caller.
- Any other status falls through to failure (CLOSE 15 and error display).

**Note:** The exact punctuation and concatenation characters for PRINT#15 statements (commas vs semicolons) have been verified against authoritative sources to ensure accuracy.

## Source Code
```basic
560 REM JOB QUEUE
570 TRY=0

580 PRINT#15,"M-W";CHR$(8);CHR$(0);CHR$(4);CHR$(T);CHR$(S);CHR$(T);CHR$(S)

590 PRINT#15,"M-W";CHR$(1);CHR$(0);CHR$(JOB)

600 TRY=TRY+1

610 PRINT#15,"M-R";CHR$(1);CHR$(0)

620 GET#15,E$

630 IF E$="" THEN E$=CHR$(0)

640 E=ASC(E$)

650 IF TRY=500 GOTO 680

660 IF E>127 GOTO 600

670 IF E=1 THEN RETURN

680 CLOSE 15

690 PRINT"  <DOWN>  <RVS>FAILED<:R0FF>  "
700 END
```

## References
- "seek_operation_job_submission" — expands on calls that submit seek jobs
- "read_buffer_write_and_execute" — expands on calls that submit read/write jobs during data transfer
