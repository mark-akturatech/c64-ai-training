# FULL TRACK 27 ERROR — 1541 BASIC Program

**Summary:** Commodore 64 BASIC program that drives a 1541 via channel 15 (OPEN/PRINT#15/INPUT#15) to build and submit many malformed sector write jobs using M-W / M-E sequences and job codes (JOB=176 / JOB=224). Includes user prompts, safety checks (track range), buffer building via CHR$ concatenation, job queue control and final status messages.

## Description
This chunk is a cleaned, OCR-corrected transcription of a BASIC program that intentionally constructs and sends malformed write jobs to a Commodore 1541 drive to create many errors on a full track. The program:

- Prompts for a track number T and confirms user intention (safety check: T must be 1..35).
- Opens the drive command channel (OPEN 15,8,15), sends a simple command and reads the drive response (INPUT#15 to collect EN$, EM$, ET$, ES$ status fields).
- Computes a starting sector count NS based on track ranges: NS = 20 + 2*(T>17) + (T>24) + (T>30).
- Builds write buffers by concatenating CHR$() values into string variables and string arrays (uses repeated READ D loops to convert numeric data into CHR$(D) bytes).
- Uses "M-W" (Memory-Write) and "M-E" (Memory-Execute) command blocks written to channel 15 to queue jobs on the drive; sets JOB codes (176 and 224) to control drive behavior.
- Iterates nested loops to create many malformed sectors across the full track, then sends an M-E command to execute/commit the queued jobs.
- Closes channel 15 and prints a final DONE message.

Caveats and fidelity notes:
- The original source was OCR-noisy. This transcription normalizes common OCR artifacts (0/O, * / $) while preserving program structure and commands.
- DATA statements referenced by READ D loops were not present in the provided source and therefore are left absent here (the program will expect DATA values for the READs).
- There are at least one clear control-flow inconsistency in the original (GOSUB targets without matching RETURNs). See the note below.

## Source Code
```basic
100 REM 27M ERROR - 1541
110 DIM D$(25)
120 PRINT "CCLR] MULTIPLE 27 ERROR - 1541"
130 PRINT "CDOWN> INSERT CLONE IN DRIVE"
140 INPUT "CDOWN3 DESTROY TRACK ";T
150 IF T<1 OR T>35 THEN END
160 INPUT "CDOWN3 ARE YOU SURE Y<:LEFT 3>";D$
170 IF D$<>"y" THEN END
180 OPEN 15,8,15
190 PRINT#15,"I0"
200 INPUT#15,EN$,EM$,ET$,ES$
210 IF EN$="00" GOTO 260
220 PRINT "CDOWN J ";EN$;",";EM$;",";ET$;",";ES$
230 CLOSE 15
240 END

250 REM SEEK
260 NS = 20 + 2*(T>17) + (T>24) + (T>30)
270 S = NS
280 JOB = 176
290 GOSUB 550
300 FOR I = 0 TO 23
310   READ D
320   D$ = D$ + CHR$(D)
330   I$ = I$ + CHR$(0)
340 NEXT I
350 PRINT#15, "M-W"; CHR$(0); CHR$(6); CHR$(24); D$
360 REM EXECUTE

370 PRINT "DESTROYING TRACK"; T
380 JOB = 224
390 GOSUB 580

400 PRINT#15, "M-W"; CHR$(0); CHR$(6); CHR$(24); I$
410 FOR J = 0 TO 25
420   FOR I = 0 TO 7
430     READ D
440     D$(J) = D$(J) + CHR$(D)
450   NEXT I
460 NEXT J
470 I = 0
480 FOR J = 0 TO 25
490   PRINT#15, "M-W"; CHR$(I); CHR$(4); CHR$(8); D$(J)
500   I = I + 8
510 NEXT J
520 REM EXECUTE
530 PRINT#15, "M-E"; CHR$(0); CHR$(4)
540 CLOSE 15
550 PRINT " <D0WN> DONE ! "
560 END
```

**[Note: Source may contain an error — the program issues GOSUB 550 and GOSUB 580 but no corresponding RETURN statements or subroutines at those targets; DATA statements referenced by READ are missing in the supplied source.]**

## Key Registers
- (none) — This chunk is a drive-protocol / BASIC program and does not document memory-mapped C64 I/O registers.

## References
- "job_queue_and_mrw_protocol" — expands on how the BASIC job queue uses M-R and M-W sequences to communicate with the drive
- "full_track_20_error_source_annotation" — expands on a similar strategy used in a machine-language formatting routine