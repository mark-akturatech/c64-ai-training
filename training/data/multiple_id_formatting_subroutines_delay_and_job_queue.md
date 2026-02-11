# REM DELAY / REM JOB QUEUE — I/O-wait and job-queue logic for multiple-ID formatter

**Summary:** Commodore BASIC routines implementing a keyboard-wait (DELAY) that loops on GET to wait for CR and a drive/job-queue loop that composes M-W/M-R packets on channel #15, normalizes GET#15 responses (E$->CHR$(0) if empty), converts to numeric with ASC, supports a TRY retry counter and a TRY=500 timeout, and retries on a specific response value (E=27).

**Description**
This chunk contains two related BASIC routines used by the multiple-ID formatter:

- **DELAY (lines 900–950):** Prompts the user and busy-waits for a carriage-return (CHR$(13)) from the keyboard using GET, then prints "OK" and RETURNs.
- **JOB QUEUE (lines 960–1060):** Repeatedly sends write ("M-W") job packets to the drive on logical device channel #15, sends a follow-up read/poll ("M-R"), reads a single-byte response with GET#15 into E$, normalizes empty responses to CHR$(0), converts the response to numeric via E = ASC(E$), increments a TRY counter and implements a maximum-retry timeout (IF TRY = 500 GOTO 1070). If the response equals 27, the routine branches to retry the job (GOTO 1000). Packet composition uses CHR$ bytes (example variables shown: T, S, JOB) — these represent job parameters (track/sector/job code).

Behavioral notes (from the listing):
- I/O is done on channel 15 using PRINT#15 and GET#15.
- Response handling deliberately converts empty returns (E$ = "") to CHR$(0) before ASC().
- Retry/backoff behavior: TRY increments at each iteration; after 500 attempts, it jumps to a handler at 1070 (not present in this chunk).
- The listing ends mid-sequence; subsequent flow at/after 1070 and further job logic is not included here.

## Source Code
```basic
900 REM DELAY
910 PRINT "PRESS RETURN TO CONTINUE"
920 GET C$: IF C$ = "" THEN 920
930 IF C$ <> CHR$(13) THEN 920
940 PRINT "OK"
950 RETURN

960 REM JOB QUEUE
970 TRY = 0
980 PRINT#15, "M-W"; CHR$(8); CHR$(0); CHR$(2); CHR$(T); CHR$(S)
990 PRINT#15, "M-W"; CHR$(1); CHR$(0); CHR$(1); CHR$(JOB)
1000 TRY = TRY + 1
1010 PRINT#15, "M-R"; CHR$(1); CHR$(0)
1020 GET#15, E$
1030 IF E$ = "" THEN E$ = CHR$(0)
1040 E = ASC(E$)
1050 IF TRY = 500 THEN GOTO 1070
1060 IF E = 27 THEN GOTO 1000
```

Notes on the source listing:
- Variable names T, S, JOB appear in CHR$() arguments — these hold job parameters (e.g., track/sector/job code) and are preserved as variables rather than expanded.
- Channel used for drive commands is #15 (standard C64 drive/open channel convention).

## References
- "job_queue_error_handling" — expands on related job-queue logic used earlier for the single-sector duplication example
- "multiple_id_formatting_write_parameters_and_execute" — expands on routines that perform SEEK/READ/WRITE job exchanges and wait for drive responses during formatting
