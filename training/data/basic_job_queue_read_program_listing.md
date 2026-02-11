# BASIC: Job Queue Read Example (drive job queue, M-W/M-R, buffer $0300-$03FF)

**Summary:** Example Commodore 64 BASIC program that opens the drive command channel (15), initializes the drive, submits SEEK (job code 176) and READ (job code 128) jobs via a JOB QUEUE subroutine that writes job/header entries with "M-W" and polls with "M-R", then reads 256 bytes from the device buffer area ($0300–$03FF) with GET# and prints ASCII/decimal output.

## Description
This BASIC listing demonstrates direct drive job-queue usage over the IEC command channel (device channel 15). Flow:

- Open command channel 15 and send the drive initialization string ("10"), then read the drive status response into EN$, EM$, ET$, ES$ and abort if EN$ <> "00".
- Submit a SEEK job by setting T (track) and S (sector) and JOB = 176, then call the JOB QUEUE subroutine at line 370.
- Submit a READ job by setting JOB = 128 and calling the JOB QUEUE subroutine again.
- After READ completes, loop I = 0 to 255: for each byte send an "M-R" request (with index/length bytes as in the listing), GET#15 one byte into B$, default empty reads to CHR$(0), compute A = ASC(B$) and print index, decimal value and ASCII when printable.
- The JOB QUEUE subroutine (lines 370–470) composes and sends job/header entries with PRINT#15 "M-W" followed by CHR$ bytes (track/sector and header fields and the job code). It then polls the drive by repeatedly issuing PRINT#15 "M-R" and GET#15 to read a single status byte; if the returned status byte value E > 127 the job is still running and the routine loops (with a TRY limit of 500), otherwise it returns.

Caveats:
- The source listing contains OCR/typo artifacts in several places (variable names and some CHR$ sequences used for the second "M-W" write). The job-payload/write sequence in the second "M-W" line is garbled in the source; see the Source Code section for the original text and the note below.
- Variables in the listing: EN$, EM$, ET$, ES$ (drive status response), T (track), S (sector), JOB (job code), TRY (poll attempt counter), E$/E (status byte read during polling), B$/A (data byte read and its ASC value).

## Source Code
```basic
100 REM JOB QUEUE READ
110 OPEN 15,8,15
120 PRINT#15,"10"
130 INPUT#15,EN$,EM$,ET$,ES$
140 IF EN$<>"00" GOTO 340
150 REM SEEK
160 T=18
170 S=0
180 JOB=176
190 GOSUB 370
200 IF EOl GOTO 340
210 REM READ
220 JOB=128
230 GOSUB 370
240 IF EOl GOTO 340
250 FOR I=0 TO 255
260 PRINT#15,"M-R";CHR$(I);CHR$(3)
270 GET#15,B$
280 IF B$="" THEN B$=CHR$(0)
290 A=ASC(B$)
300 PRINT ST,I,A,
310 IF A>31 AND A<96 THEN PRINT B$,
320 PRINT
330 NEXT I
340 CLOSE 15
350 END

360 REM JOB QUEUE
370 TRY=0
380 PRINT#15,"M-W";CHR$(6);CHR$(0);CHR$(2);CHR$(T);CHR$(S)
390 PRINT#15,"M-W";CHR$(0);CHR$(0);CHR$(DC)CHR$(JOB)
400 TRY=TRY+1
410 PRINT#15,"M-R";CHR$(0);CHR$(0)
420 GET#15,E$
430 IF E$="" THEN E$=CHR$(0)
440 E=ASC(E$)
450 IF TRY=500 GOTO 470
460 IF E>127 GOTO 400
470 RETURN
```

**[Note: Source may contain an error — the second "M-W" write (line 390) contains garbled/uncertain bytes (shown here as the original OCR text `CHR$(DC)CHR$(JOB)`); the exact header/job-bytes should be confirmed against the device/job-queue specification or the original listing.]**

## References
- "direct_access_intro_and_example_summary" — context and purpose of this BASIC example
- "program_line_by_line_explanation" — expanded line-range descriptions of the listing
- "job_queue_mechanism_and_job_code_bit7" — mechanics of stuffing job/header entries and polling for completion (bit-7 semantics)
