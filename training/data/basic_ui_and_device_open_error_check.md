# byRiclianll - BASIC: Edit Disk Name / Drive OPEN & Status (1541)

**Summary:** Commodore BASIC program showing REM header, string padding via FOR..NEXT (PAD$ + CHR$(160)), user prompts with screen-control tokens, GET C$ loop waiting for RETURN, device open (OPEN 15,8,15), send command channel (PRINT#15,"10"), read drive response (INPUT#15,EN$,EM$,ET$,ES$) and check EN$="00" for success; on error print EN$/EM$/ET$/ES$, CLOSE 15 and END.

## Program description
This BASIC chunk:
- Declares a REM header describing a job queue / disk-name edit utility for 1541.
- Builds a padding string PAD$ by appending 16 times CHR$(160) (used to pad filenames/display).
- Prints multiple instructional messages containing screen-control tokens (e.g. {CLR}, {DOWN}, {RETURN}) to prompt the user to remove/insert diskette and press RETURN.
- Waits for a RETURN via a GET C$ loop: repeatedly GET C$ until C$ contains CR (CHR$(13)).
- On RETURN, prints "OK", opens the drive command channel with OPEN 15,8,15, and sends the drive command "10" to channel 15 using PRINT#15,"10".
- Reads the drive's initial response via INPUT#15,EN$,EM$,ET$,ES$ (EN$ = error number/status). If EN$ = "00" the program branches to success handling (GOTO 290 in original). If EN$ <> "00", it prints the returned status strings EN$/EM$/ET$/ES$, closes the channel and ENDs the program.

**[Note: Source may contain OCR/notation errors — string variables and functions have been normalized to standard Commodore BASIC forms (PAD$, CHR$, C$, EN$, etc.), and PRINT* has been corrected to PRINT# where appropriate.]**

## Source Code
```basic
100 REM JOB QUEUE READ/WRITE - EDIT DISK NAME
110 FOR I = 1 TO 16
120   PAD$ = PAD$ + CHR$(160)
130 NEXT I
140 PRINT "{CLR}EDIT DISK NAME - 1541"
150 PRINT "{DOWN} REMOVE / WRITE PROTECT {TAB}"
160 PRINT "{DOWN} INSERT DISKETTE IN DRIVE"
170 PRINT "{DOWN} PRESS RETURN TO CONTINUE"
180 GET C$: IF C$ = "" THEN 180
190 IF C$ <> CHR$(13) THEN 180
200 PRINT "OK"
210 OPEN 15,8,15
220 PRINT#15,"10"
230 INPUT#15,EN$,EM$,ET$,ES$
240 IF EN$ = "00" GOTO 290
250 PRINT "{DOWN}", EN$, EM$, ET$, ES$
260 CLOSE 15
270 END
```

## References
- "seek_read_and_disk_name_fetch_and_edit_input" — performs SEEK/READ and retrieves the disk name after device open
- "job_queue_subroutine_and_error_handler" — uses the job-queue subroutine (GOSUB 660) to perform SEEK/READ and handle errors
