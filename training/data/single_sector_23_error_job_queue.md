# JOB QUEUE (BASIC subroutine)

**Summary:** BASIC subroutine that queues a drive I/O job to device 15 using serial commands "M-W" (memory write) and "M-R" (memory read), polls the drive with GET#15 and ASC(E$), implements a retry counter TRY up to 500, and on persistent failure CLOSEs device 15 and prints an error. Searchable terms: PRINT#15, GET#15, "M-W", "M-R", TRY, ASC(E$), CLOSE 15.

**Description**
This routine (labels/lines starting at 540) is a helper GOSUB from the main BASIC driver to submit a drive job (machine-code/data transfer) and poll for a response. Flow:

- Initialize TRY=0.
- Send one or more PRINT#15 "M-W" commands to submit the job data to the drive (device channel 15). The exact parameters/CHR$ bytes after "M-W" encode the transfer header (lengths/flags/job id); the source text is partially garbled.
- Enter a polling/retry loop: increment TRY, send PRINT#15 "M-R" to request a status response, then read one byte with GET#15 into E$.
- If GET#15 returns an empty string, it is normalized to CHR$(0). Convert the first byte to numeric with E = ASC(E$).
- If TRY reaches 500, close the drive (CLOSE 15) and print an error message, then END.
- If the response byte equals 27 (ASCII ESC) the routine returns (success); otherwise it loops to re-issue the write/read sequence and increments TRY.

This subroutine implements minimal error handling (retry loop + final CLOSE/END path) and is used for SEEK/READ and for transferring embedded machine code via drive I/O. The exact bytes sent in the "M-W" commands and some token names are garbled/missing in the source and are listed in Incomplete.

## Source Code
```basic
540 REM JOB QUEUE
550 TRY=0

560 PRINT#15,"M-W";CHR$(8);CHR$(0);CHR$(4);CHR$(T);CHR$(S);CHR$(0);CHR$(0)
570 PRINT#15,"M-W";CHR$(1);CHR$(0);CHR$(JOB)

580 TRY=TRY+1

590 PRINT#15,"M-R";CHR$(1);CHR$(0)
600 GET#15,E$
610 IF E$ = "" THEN E$ = CHR$(0)
620 E = ASC(E$)

630 IF TRY = 500 GOTO 660
640 IF E <> 27 GOTO 580
650 RETURN

660 CLOSE 15
670 PRINT "<DOWN> <RVS3  FAILED<ROFF>"
680 END
```

Notes in code:
- Line 560 sends an "M-W" command to write 4 bytes to the drive's memory starting at address $0008. The bytes written are CHR$(T), CHR$(S), CHR$(0), and CHR$(0). Variables T and S are likely defined elsewhere in the program and represent specific values required by the drive's job queue.
- Line 570 sends another "M-W" command to write a single byte to the drive's memory at address $0001. This byte is the JOB variable, which should contain the job code corresponding to the desired operation (e.g., read, write, verify, etc.). The job codes are defined in the drive's documentation, with common values being:
  - $80 (128) for READ
  - $90 (144) for WRITE
  - $A0 (160) for VERIFY
  - $B0 (176) for SEEK
  - $C0 (192) for BUMP
  - $D0 (208) for JUMP
  - $E0 (224) for EXECUTE
- The boolean/conditional comparisons have been restored to idiomatic BASIC (e.g., IF TRY = 500 GOTO 660; IF E <> 27 GOTO 580) based on likely intent of the original listing.

## References
- "Inside Commodore DOS" — provides detailed information on the 1541's job queue and memory write commands. ([pagetable.com](https://www.pagetable.com/docs/Inside%20Commodore%20DOS.pdf?utm_source=openai))
- "Commodore 1541 User's Guide" — offers guidance on using the "M-W" and "M-R" commands for direct drive communication. ([datassette.s3.us-west-004.backblazeb2.com](https://datassette.s3.us-west-004.backblazeb2.com/manuais/1541_users_guide.pdf?utm_source=openai))
