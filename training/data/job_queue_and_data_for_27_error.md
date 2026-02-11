# byRiclianll — Support routines and DATA for the "create 27 errors" BASIC program

**Summary:** BASIC driver snippets demonstrating channel 15 disk job-queue setup via PRINT#15 "M-W"/"M-R" sequences (IEC/serial device protocol), polling with GET#15 and ASC/ASCII checks, a TRY timeout loop, and embedded DATA records containing the injected machine-code/data blocks.

**Job-queue setup and M-W / M-R protocol**

This chunk contains the BASIC-level support routines that build and submit disk jobs to device channel 15 using the "M-W" (memory-write) command sequences and read back status/results with "M-R" (memory-read). The code follows the pattern:

- **OPEN channel 15**: The code assumes channel 15 is already opened; the OPEN statement is not present in this excerpt.
- **PRINT#15, "M-W"**: Sends the "M-W" command followed by CHR$ bytes to form a job record (device command block).
- **PRINT#15, "M-R"**: Sends the "M-R" command followed by CHR$ bytes to request the result/status.
- **GET#15, E$**: Fetches the reply byte(s).
- **ASC(E$)**: Converts the response byte to a numeric status.
- **TRY counter loop**: Polls until a final status (E ≤ 127) is returned or a timeout occurs (TRY reaches 500), at which point the code CLOSEs channel 15 and fails.

Behavioral notes:

- **E$ normalization**: If GET#15 returns nothing (E$ = ""), E$ is set to CHR$(0) to avoid errors with ASC("").
- **Status conversion**: E = ASC(E$) converts the response byte to a numeric status.
- **Timeout handling**: If TRY reaches 500, the code jumps to the failure path (CLOSE 15 and program END).
- **Polling loop**: If E > 127, the code increments TRY and re-issues an "M-R" (poll loop).
- **Success path**: On success, the routine RETURNs to the caller.

This pattern is typical for issuing block/disk commands over the IEC bus, where the host writes a command packet and repeatedly reads status bytes until the drive replies with a final (≤127) status or a timeout is reached.

**Error handling and control flow**

- **TRY initialization**: TRY is initialized to 0 and incremented each poll cycle (TRY = TRY + 1).
- **Timeout threshold**: The timeout threshold is 500 polls.
- **Empty reply handling**: An empty reply is normalized to CHR$(0) to avoid ASC("") errors.
- **Timeout behavior**: On timeout, the code CLOSEs channel 15 and prints a failure message before ENDing.
- **DATA blocks**: The listing contains two DATA groups labeled "21 ERROR" and "27M ERROR" — these are the machine-code/data blocks injected by the BASIC program into the disk job queue. They are likely the payloads that cause the "create 27 errors" test to execute on the disk drive or emulated device.

## Source Code

```basic
570 REM JOB QUEUE
580 TRY=0

590 PRINT#15,"M-W";CHR$(12);CHR$(0);CHR$(2);CHR$(T);CHR$(S)

600 PRINT#15,"M-W";CHR$(3);CHR$(0);CHR$(1);CHR$(<JOB>)

610 TRY=TRY+1

620 PRINT#15,"M-R";CHR$(3);CHR$(0)

630 GET#15,E$

640 IF E$ = "" THEN E$ = CHR$(0)

650 E = ASC(E$)

660 IF TRY = 500 THEN GOTO 690

670 IF E > 127 THEN GOTO 610

680 RETURN

690 CLOSE 15

700 PRINT " CDOWN - DRVS FAILED TROFF "
710 END
```

DATA blocks (verbatim as provided; may be part of machine-code payloads):

```basic
720 REM 21 ERROR
730 DATA 32,163,253,169,85,141,1,28
740 DATA 162,255,160,48,32,201,253,32
750 DATA 0,254,169,1,76,105,249,234

760 REM 27M ERROR
770 DATA 169,0,133,127,166,12,134,81
780 DATA 134,128,166,13,232,134,67,169
790 DATA 6,193,232,232,0,232,0,93
800 DATA 2,40,186,162,250,49,229,49
810 DATA 247,0,133,6,14,141,32,6
820 DATA 169,8,141,169,0,141,40,6
830 DATA 32,162,0,169,10,157,0,3
840 DATA 232,173,40,6,157,0,3,165
850 DATA 81,157,0,3,232,169,157,0
860 DATA 3,232,157,0,3,169,15,157
870 DATA 0,3,232,157,0,3,232,169
880 DATA 0,93,250,2,251,2,93,252
890 DATA 2,93,253,157,249,2,254,249
900 DATA 2,238,6,173,40,6,197,67
910 DATA 208,138,72,169,75,141,0,5
920 DATA 1,138,157,0,5,232,208,169
930 DATA 0,133,48,169,3,133,32,48
940 DATA 254,104,168,136,32,253,32,245
950 DATA 253,169,5,133,32,233,245,133
960 DATA 58,32,143,169,35,133,81,169
970 DATA 169,141,6,169,5,141,1,6
980 DATA 169,141,2,6,169,49,141,3
990 DATA 169,76,141,4,6,169,170,1
1000 DATA 5,6,169,252,141,6,6
```

## References

- "basic_create_27_errors_full_track" — expands on main BASIC driver that uses these job-queue patterns
- "m_w_m_r_machine_protocol" — expands on low-level M-W / M-R command formats used on channel 15
