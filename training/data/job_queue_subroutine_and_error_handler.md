# JOB QUEUE (GOSUB 660) — Drive M-W / M-R Polling and Error Handler

**Summary:** This BASIC subroutine (GOSUB 660) manages drive job-queue operations by writing to the drive's RAM using the "M-W" command and reading the status with "M-R" and GET#15. It utilizes a retry counter (TRY) with a timeout at 500 iterations, interprets the drive status byte (E via ASC(E$)), considers E > 127 as "in progress," E = 1 as success, and handles errors by formatting track/sector strings (ET$, ES$), mapping FDC error codes to EN$/EM$ messages, and closing channel 15 upon failure.

**Description**

This subroutine enqueues a job into the disk drive's job queue by writing two blocks into the drive RAM and then polling the drive for completion.

**Flow Summary:**
- Initialize TRY=0 (line 660).
- Write header table (track T and sector S) into the drive RAM via a PRINT#15 "M-W" command (line 670). This sequence sends a byte count and the T/S bytes to the drive.
- Write the job entry (JOB) into the drive RAM via a second PRINT#15 "M-W" (line 680).
- Enter a polling loop:
  - Increment TRY (line 690).
  - Issue a PRINT#15 "M-R" to read the status byte from the drive (line 700).
  - Read the response with GET#15 into a string variable E$ (line 710).
  - Normalize an empty response to CHR$(0) (line 720).
  - Convert the single-character status into numeric E using E=ASC(E$) (line 730).
  - If TRY reaches 500, jump to the error handler (timeout) (line 740).
  - If E > 127, the job is still in progress (drive sets high bit); loop back to TRY (line 750 → 690).
  - If E = 1, the job completed successfully and the subroutine returns (line 760).
- Error handling (lines 770–890):
  - Format track and sector as two-character strings (ET$, ES$): strip the leading space returned by STR$(n) and prepend "0" when <10 (lines 780–810).
  - Map FDC error codes E to a numeric EN$ code using RIGHT$(STR$(E+18),2) for E in 2..11 (line 820). Otherwise, set EN$="02" and EM$="?TIME OUT" (line 830).
  - For specific error codes (E=7 or E=8), set EM$="WRITE ERROR" (line 840); otherwise, set EM$="READ ERROR" (line 850).
  - Print a formatted error report containing EN$, EM$, ET$, ES$ (lines 860–870), close channel 15 (line 880), and END the program (line 890).

**Variables and Meanings:**
- TRY — Retry/timeout counter (timeout when TRY=500).
- T, S — Disk track and sector numbers being written/read into the drive's header table.
- JOB — Job identifier/job entry byte transmitted to the drive.
- E$ — Single-character response read from the drive (GET#15).
- E — Numeric status read from the drive (E=ASC(E$)); E > 127 → in progress, E = 1 → success.
- ET$, ES$ — Formatted two-character track and sector strings for display.
- EN$, EM$ — Error number and error message for the printed report.

**Notes:**
- The code uses drive channel 15 (PRINT#15 / GET#15 / CLOSE 15).
- The mapping EN$=RIGHT$(STR$(E+18),2) creates a two-digit display code derived from the FDC status byte; the listing assumes a specific offset mapping used elsewhere.
- The original text used OCR artifacts where $ was rendered as *; variables have been normalized to standard BASIC names (E$, ET$, ES$, EN$, EM$).

## Source Code
```basic
650 REM JOB QUEUE
660 TRY=0
670 PRINT#15,"M-W";CHR$(10);CHR$(0);CHR$(2);CHR$(T);CHR$(S)
680 PRINT#15,"M-W";CHR$(2);CHR$(0);CHR$(1);CHR$(JOB)
690 TRY=TRY+1
700 PRINT#15,"M-R";CHR$(2);CHR$(0)
710 GET#15,E$
720 IF E$="" THEN E$=CHR$(0)
730 E=ASC(E$)
740 IF TRY=500 GOTO 780
750 IF E>127 GOTO 690
760 IF E=1 THEN RETURN
770 REM ERROR HANDLER
780 ET$=RIGHT$(STR$(T),LEN(STR$(T))-1)
790 IF T<10 THEN ET$="0"+ET$
800 ES$=RIGHT$(STR$(S),LEN(STR$(S))-1)
810 IF S<10 THEN ES$="0"+ES$
820 IF E>1 AND E<12 THEN EN$=RIGHT$(STR$(E+18),2):GOTO 840
830 EN$="02":EM$="?TIME OUT":GOTO 860
840 IF E=7 OR E=8 THEN EM$=" WRITE ERROR":GOTO 860
850 EM$="READ ERROR"
860 PRINT " DOWN ";EN$;",";EM$;",";ET$;",";ES$
870 PRINT " DOWN >RVS>FAILED t ROFF > "
880 CLOSE 15
890 END
```

## References
- "seek_read_review_and_buffer_addresses" — explains the job order and memory addresses the subroutine manipulates
- "write_new_disk_name_and_finalize" — called (GOSUB 660) to perform the WRITE job and poll for completion
- "seek_read_and_disk_name_fetch_and_edit_input" — called (GOSUB 660) to perform SEEK and READ jobs used to fetch the disk name
