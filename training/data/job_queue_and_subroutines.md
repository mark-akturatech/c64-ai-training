# Post-certification Bad-sector Allocation, SEEK/WRITE Job Routines, and JOB QUEUE (BASIC)

**Summary:** This document provides Commodore BASIC routines for post-certification bad-sector allocation and low-level disk job queue control using IEC device #15 (PRINT#15/GET#15). It includes a loop that issues "B-A" (bad-allocate) commands to the drive, small SEEK/WRITE job wrappers (JOB = $B0/$90), and a JOB QUEUE implementation that assembles M-W / M-R job packets with retry logic and error-code handling (ASC/GET#). The BASIC code has been corrected for OCR errors.

**Description**

This document contains Commodore BASIC code that:

- Iterates over a table (arrays T7 and S7) and sends a "B-A" record-allocation command to IEC device #15 for each bad sector entry, allocating previously recorded bad sectors after certification.
- Provides two small wrappers for SEEK and WRITE disk jobs by setting JOB and calling the JOB QUEUE subroutine.
  - JOB values observed: 176 (decimal) for SEEK, 144 (decimal) for WRITE.
- Implements a JOB QUEUE subroutine that:
  - Initializes a TRY counter.
  - Sends an "M-W" packet to the drive to write a job packet: the packet is assembled from string literals and control bytes produced by CHR$().
  - Sends a second "M-W" with job packet header/body that includes the JOB byte.
  - Increments TRY, issues an "M-R" to read the job result, then GETs a single response byte from the drive into a string variable and converts it to a numeric code using ASC().
  - If no byte is returned, substitutes CHR$(0) (zero byte).
  - If the TRY counter reaches 500, returns with the current state. If the returned code is >127, it loops to retry (re-issues packet). Otherwise, it returns (success case).
- Uses IEC channel 15 (device channel) for all PRINT# and GET# operations.

**Notes:**

- The source contained OCR errors that were corrected where unambiguous (e.g., G0SUB -> GOSUB, G0TO -> GOTO, CHR* -> CHR$, E* -> E$, numeric/authentic character fixes).
- The code uses CHR$-produced control bytes as packet fields; the exact meanings of the individual bytes (e.g., CHR$(8), CHR$(0), CHR$(2)) correspond to job-packet fields expected by the disk controller firmware. The JOB byte is appended as CHR$(JOB).

## Source Code

```basic
960 FOR I = 1 TO A
970 PRINT#15, "B-A"; 0; T7(I); S7(I)
980 NEXT I
990 CLOSE 15

1000 PRINT "DOWN! DONE!"
1010 END

1020 REM SEEK
1030 JOB = 176
1040 GOSUB 1120
1050 IF E = 1 GOTO 1040
1060 RETURN

1070 REM WRITE
1080 JOB = 144
1090 GOSUB 1120
1100 RETURN

1110 REM JOB QUEUE
1120 TRY = 0
1130 PRINT#15, "M-W"; CHR$(8); CHR$(0); CHR$(2); CHR$(T); CHR$(S)
1140 PRINT#15, "M-W"; CHR$(1); CHR$(0); CHR$(1); CHR$(JOB)
1150 TRY = TRY + 1
1160 PRINT#15, "M-R"; CHR$(1); CHR$(0)
1170 GET#15, E$
1180 IF E$ = "" THEN E$ = CHR$(0)
1190 E = ASC(E$)
1200 IF TRY = 500 GOTO 1220
1210 IF E > 127 GOTO 1150
1220 RETURN
```

## References

- "buffer_init_certify_loop_and_restore_bam" — expands on the routines used to perform the actual disk write/allocate operations during certification.
- "annotated_line_range_summary" — documents the subroutine ranges and intermediate disk programming notes for lines 1020-1230.
