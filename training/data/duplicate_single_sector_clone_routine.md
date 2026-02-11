# Single-sector duplication BASIC routine (device 15, SEEK/READ/WRITE, M-R / M-W sequences)

**Summary:** BASIC routine that closes/reopens device 15, uses a job-queue subroutine (GOSUB 550) with JOB values 176 (SEEK), 128 (READ), and 144 (WRITE), issues drive commands via PRINT#15 ("M-R" / "M-W" with CHR$ bytes), polls GET#15 responses, prompts user to swap master/clone disks, writes the sector to the clone (final M-W includes CHR$(7)), closes the device, and prints a completion message.

**Description**
This chunk is a straight-line BASIC program implementing the main duplication flow for a single sector using the disk drive command channel (device 15). Sequence:

- Ensure device 15 is closed, then later re-opened with OPEN 15,8,15.
- Use a job-queue subroutine at line 550 (GOSUB 550) to perform drive jobs; the program sets the job number variable (JOB) to request different actions:
  - JOB = 176 — SEEK
  - JOB = 128 — READ
  - JOB = 144 — WRITE
- After the READ job, the program sends a drive command via PRINT#15 of the form "M-R" with appended CHR$ bytes (drive command parameters), then uses GET#15 to receive a response into D$ and normalizes empty response to CHR$(0).
- The program prompts the operator to remove the master disk and insert the clone, waits for a RETURN (CR), then reopens device 15 and issues SEEK and M-W sequences to write the previously-read sector to the clone. The write sequence includes a final M-W containing CHR$(7) (end-of-record / finalization byte).
- Program closes device 15 and prints a completion message, then END.

Behavioral notes preserved from source:
- The job-queue subroutine (GOSUB 550) is responsible for issuing the low-level disk jobs corresponding to the numeric JOB values and must handle interpolation between BASIC and drive serial protocol.
- Drive commands are sent with PRINT#15 of textual command tokens ("M-R", "M-W") followed by CHR$(...) bytes to form the binary parameter sequence.
- GET#15 is used to fetch the drive's single-byte or short response into D$; empty responses are converted to CHR$(0) by the program.

## Source Code
```basic
240 CLOSE 15
250 END

260 REM SEEK
270 JOB = 176
280 GOSUB 550

290 REM READ
300 JOB = 128
310 GOSUB 550

320 PRINT#15, "M-R"; CHR$(56); CHR$(0)
330 GET#15, D$
340 IF D$ = "" THEN D$ = CHR$(0)
350 CLOSE 15

360 PRINT "REMOVE MASTER DISK FROM DRIVE"
370 PRINT "INSERT CLONE DISK INTO DRIVE"
380 PRINT "PRESS RETURN TO CONTINUE"

390 GET C$
395 IF C$ = "" THEN 390
400 IF C$ <> CHR$(13) THEN 390

410 PRINT "OK"
420 OPEN 15,8,15

430 REM SEEK
440 JOB = 176
450 GOSUB 550

460 PRINT#15, "M-W"; CHR$(71); CHR$(0); CHR$(1); D$

470 REM WRITE
480 JOB = 144
490 GOSUB 550

500 PRINT#15, "M-W"; CHR$(71); CHR$(0); CHR$(1); CHR$(7)

510 CLOSE 15
520 PRINT "DONE!"
530 END

550 REM JOB-QUEUE SUBROUTINE
560 REM This subroutine sends the JOB value to the drive's job queue
570 REM and waits for the operation to complete.
580 REM JOB values:
590 REM   176 - SEEK
600 REM   128 - READ
610 REM   144 - WRITE
620 POKE 1, JOB
630 POKE 8, 17  : REM Track 17
640 POKE 9, 0   : REM Sector 0
650 REM Wait for job completion
660 WAIT 1, 128, 0
670 RETURN
```

## References
- "job_queue_error_handling" — Uses the job-queue subroutine for issuing/confirming drive commands
- "duplicate_single_sector_error_source_listing" — Explains the observed error source related to this duplication routine
