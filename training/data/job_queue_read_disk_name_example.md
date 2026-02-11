# BASIC: Job-queue read — disk name from Track 18 Sector 0 into buffer #1

**Summary:** Example C64 BASIC program demonstrating direct IEC job-queue operations: SEEK job (176) then READ job (128) into buffer #1 ($0400-$04FF), then a three-parameter memory-read (M-R) of bytes 144-159 ($0490-$049F) to fetch the 16-byte disk name; uses OPEN/PRINT#15/GET#15 polling and normalizes nonprintable/quote characters to '?'.

**Description**
This BASIC program opens the serial channel to device 8 (disk drive), checks drive status, issues a SEEK job (job code 176 decimal) to position the head to track 18 sector 0, then issues a READ job (job code 128 decimal) to read that sector into buffer #1 ($0400-$04FF). After the READ completes, it performs a three-parameter memory-read ("M-R") to fetch 16 bytes starting at address $0490 (decimal 144 low, 4 high) — these bytes contain the disk name. The program collects 16 bytes via GET#15, handles empty reads as zero, strips the IEC high-bit if set (value >127), normalizes control/nonprintable bytes (<32 or >95) and quote (34) to ASCII question mark (63), and assembles the disk name string DN$.

The job-queue subroutine (GOSUB 390) writes the track and sector into the drive header table and posts a job code into the job queue via M-W (memory-write) commands, then enters a TRY poll loop that issues M-R to read the drive response and checks for completion. The TRY counter is a safety timeout (example uses 500 iterations) to avoid hanging if the drive fails to complete the job.

Behavioral notes preserved from source:
- The drive may abort and return an error code on its own; polling lets you detect completion or persistent failure.
- The routine treats empty GET# returns as 0 and handles IEC bytes with the high bit set by subtracting 128 (IEC often sets bit 7).
- Disk name bytes returned from the drive are filtered to printable range and quotes are replaced by '?'.

## Source Code
```basic
100 REM JOB QUEUE READ - DISK NAME
110 OPEN 15,8,15
120 PRINT#15,"10"                ' INIT/STATUS TALK? (get drive status)
130 INPUT#15,EN$,EM$,ET$,ES$     ' read status response
140 IF EN$<>"00" GOTO 360        ' non-zero status -> exit

150 REM SEEK (position head to track 18)
160 T=18
170 S=0
180 JOB=176                      ' SEEK job code (decimal 176)
190 GOSUB 390
200 IF EOI GOTO 360              ' EOI used in original; keep guard (source had EOl)

210 REM READ (read sector into buffer #1)
220 JOB=128                      ' READ job code (decimal 128)
230 GOSUB 390
240 IF EOI GOTO 360

250 PRINT#15, "M-R"; CHR$(144); CHR$(4); CHR$(16)  ' M-R start_low,start_high,length (read $0490-$049F)
260 FOR I=1 TO 16
270   GET#15,B$
280   IF B$="" THEN B$=CHR$(0)
290   A=ASC(B$)
300   IF A>127 THEN A=A-128       ' strip IEC high bit if set
310   IF A<32 OR A>95 THEN A=63   ' normalize to '?'
320   IF A=34 THEN A=63           ' replace quote with '?'
330   DN$=DN$+CHR$(A)
340 NEXT I
350 PRINT "  > DISK NAME: "; DN$
360 CLOSE 15
370 END

380 REM JOB QUEUE SUBROUTINE - posts job and polls for completion
390 TRY=0
400 ' Write header: M-W addr_low addr_high count ... then data (T,S)
410 PRINT#15, "M-W"; CHR$(8); CHR$(0); CHR$(2); CHR$(T); CHR$(S)   ' header table write (example offsets)
420 ' Post job code into job queue (M-W to job queue address)
430 PRINT#15, "M-W"; CHR$(1); CHR$(0); CHR$(1); CHR$(JOB)
440 TRY=TRY+1
450 PRINT#15, "M-R"; CHR$(1); CHR$(0); CHR$(1)  ' read job response byte
460 GET#15,E$
470 IF E$="" THEN E$=CHR$(0)
480 E=ASC(E$)
490 IF TRY=500 GOTO 510         ' timeout bailout (500 tries)
500 IF E>127 GOTO 440           ' if high-bit set, job not complete -> poll again
510 RETURN
```

## References
- "job_queue_buffer_mapping_and_read_example" — expands on buffer #1 mapping ($0400-$04FF => job $0001, header $0008/$0009)