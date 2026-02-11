# Single-Sector 22 Error Creator (1541) — BASIC Listing

**Summary:** Commodore 64 BASIC program to provoke a DOS error 22 on a single sector on a 1541 disk drive. The program utilizes direct drive I/O on channel 15, including `PRINT#15` and `INPUT#15` commands, the `M-W` command with `CHR$` byte parameters, and a job queue subroutine. Parameters: track (T) and sector (S).

**Description**

This chunk contains the cleaned BASIC listing (lines 100–420) for the "SINGLE SECTOR 22 ERROR" utility. The program prompts for a track and sector, validates the parameters, opens the drive command channel (channel 15), polls the drive status, then uses the drive job/format routines (via a `JOB` variable and `GOSUB 440`) and raw `M-W` commands (binary bytes sent with `CHR$`) to provoke a write/read sequence that will create a DOS 22 (sector not found/damaged) error on a single sector.

OCR corrections applied where the original text contained obvious character corruption: `G0SUB` -> `GOSUB`, `J0B` -> `JOB`, `CHR*` -> `CHR$`, `EN*/EM*/ET*/ES*` -> `EN$/EM$/ET$/ES$`, `OPEN15,a,15` -> `OPEN 15,8,15`, and typical BASIC spacing/punctuation corrections to restore valid BASIC syntax. The program calls external subroutines (job queue and format/wait loop) which are referenced but not included here.

Behavior summary:
- Validate track `T` in allowed range (10–35).
- Compute sector count `NS` for a track (formula from the source).
- Validate sector `S` in 0..`NS`.
- Confirm user intent (Y) before proceeding.
- Open drive command channel (`OPEN 15,8,15`), request status, read `EN$/EM$/ET$/ES$`.
- If drive reports "00" (OK), proceed to SEEK (`JOB=176`) and perform `GOSUB 440` (job queue subroutine).
- Perform READ (`JOB=128`) and `GOSUB 440`; on certain errors proceed to write steps.
- Send `M-W` commands with binary arguments using `CHR$` to manipulate sector contents (two writes shown, second write uses `CHR$(7)`).
- Close channel and exit.

External dependencies (not included): `GOSUB 440` (job queue subroutine) and the format/wait routine referenced earlier (format routine setup and wait loop).

## Source Code

```basic
100 REM 22A ERROR - 1541
110 PRINT "<CLR>22A ERROR - 1541"
120 PRINT "<DOWN> INSERT CLONE IN DRIVE"
130 INPUT "<DOWN> DESTROY TRACK AND SECTOR (T,S) ";T,S
140 IF T<10 OR T>35 THEN END
150 NS = 20 + 2*(T>17) + (T>24) + (T>30)
160 IF S<0 OR S>NS THEN END

170 INPUT "<DOWN> ARE YOU SURE (Y/N) ";Q$
180 IF Q$ <> "Y" THEN END

190 OPEN 15,8,15
200 PRINT#15,"10"
210 INPUT#15,EN$,EM$,ET$,ES$
220 IF EN$ = "00" GOTO 270
230 PRINT "<DOWN> ";EN$; " "; EM$; " "; ET$; " "; ES$
240 CLOSE 15
250 END

260 REM SEEK
270 JOB = 176
280 GOSUB 440
290 IF E <> 1 GOTO 550

300 REM READ
310 JOB = 128
320 GOSUB 440
330 IF E <> 1 AND E <> 4 AND E <> 5 GOTO 550

340 PRINT#15,"M-W";CHR$(71);CHR$(0);CHR$(1);CHR$(6)

350 REM WRITE
360 JOB = 144
370 GOSUB 440
380 PRINT#15,"M-W";CHR$(71);CHR$(0);CHR$(1);CHR$(7)

390 IF E <> 1 GOTO 550
400 CLOSE 15
410 PRINT "<DOWN> DONE !"
420 END
```

## Key Registers

- **EN$**: Error number string from the drive.
- **EM$**: Error message string from the drive.
- **ET$**: Error track number string from the drive.
- **ES$**: Error sector number string from the drive.
- **JOB**: Job code sent to the drive to perform specific operations.
- **E**: Error code returned from the drive after job execution.

## References

- "format_routine_setup_and_wait_loop" — assembly pieces of the formatting/attack routine used earlier in the chapter.
- "job_queue_subroutine_listing_and_io_handling" — subroutine (job queue) called by the BASIC listing for device I/O and retries.