# 7.6 How to Create 21 Errors on a Full Track

**Summary:** BASIC driver for the 1541 that destroys a full track to force a "21 ERROR" (FDC timeout) by writing non-sync bytes with a machine-code routine; uses OPEN 15/PRINT#15 job-queue interaction, a user prompt for track number (validated 1–35), and a DATA block of machine-code bytes.

**Description**
This chunk contains a BASIC program that prompts for a track number (validated to 1–35), requests user confirmation, opens the 1541 command channel (device 15), submits machine-code via the drive job queue, and then instructs the drive to execute the code which writes non-sync bytes across the selected track to cause a full-track "21 ERROR" (drive controller timeout).

Program structure (logical sections):
- **User prompt and validation:** Asks for the track number (T) and confirms with the user (Y/N).
- **Drive open/init:** `OPEN 15,8,15` then a `PRINT#15` to initialize/communicate with the drive.
- **Status read:** `INPUT#15,...` reads status/error information back from the drive (`EN$`, `EM$`, `ET$`, `ES$`).
- **SEEK / prepare:** A `GOSUB` to the SEEK section to position the drive head (job SUB/SKIP style).
- **JOB QUEUE interaction:** Writes a job into the drive RAM using low-level "M-W" / "M-R" commands sent to channel 15 (`PRINT#15` with byte sequences built from `CHR$()`); polls for completion via `GET#15` and `ASC()` return bytes; retry loop implemented.
- **EXECUTE:** Issues the command to execute the job in RAM, then closes the channel and exits.
- **Machine-code payload:** A `DATA` block (bytes listed) contains the machine-language routine uploaded to the drive; that routine writes non-sync bytes (no valid sector sync marks) to the whole track, triggering the 1541 FDC timeout resulting in "21 ERROR".

Limitations and parameters:
- **Limitations:** None stated in the source.
- **Parameter:** Track number (validated in the program to be within 1–35).

Caveats:
- The program uses low-level drive commands (`PRINT#15` with raw `CHR$` sequences). This will deliberately damage data on the selected track and is destructive on a physical disk.
- Some OCR artifacts were present in the source; the BASIC listing below has been cleaned for readability.

## Source Code
```basic
100 REM 21 ERROR - 1541
110 PRINT "CLR>21 ERROR - 1541"
120 PRINT "DOWN> INSERT CLONE IN DRIVE"
130 INPUT "DOWN> destroy track";T
140 IF T<1 OR T>35 THEN END
150 INPUT "DOWN> are you sure y ";Q$
160 IF Q$<>"y" THEN END
170 OPEN 15,8,15
180 PRINT#15,"I0"

190 INPUT#15,EN$,EM$,ET$,ES$
200 IF EN$="00" GOTO 250
210 PRINT "<DOWN> ";EN$;",";EM$;",";ET$;",";ES$
220 CLOSE 15
230 END

240 REM SEEK
250 JOB=176
260 GOSUB 400
270 FOR I=0 TO 23
280 READ D
290 D$=D$+CHR$(D)
300 NEXT I
310 PRINT#15,"M-W"+CHR$(0)+CHR$(4)+CHR$(24)+D$

320 REM EXECUTE
330 PRINT "DOWN> DRIVE> DESTROYING TRACK";T
340 JOB=224
350 GOSUB 400
360 PRINT "DOWN> DONE!"
370 CLOSE 15
380 END

390 REM JOB QUEUE
400 TRY=0
410 PRINT#15,"M-W"+CHR$(8)+CHR$(0)+CHR$(2)+CHR$(1)+CHR$(0)
420 PRINT#15,"M-W"+CHR$(1)+CHR$(0)+CHR$(1)+CHR$(JOB)
430 TRY=TRY+1
440 PRINT#15,"M-R"+CHR$(1)+CHR$(0)
450 GET#15,E$
460 IF E$="" THEN E$=CHR$(0)
470 E=ASC(E$)
480 IF TRY=500 GOTO 510
490 IF E>127 GOTO 430
500 RETURN
510 CLOSE 15
520 PRINT "DOWN> DRIVE FAILED/CROFF!"
530 END

540 REM 21 ERROR (machine-code payload)
550 DATA 32,163,253,169,85,141,1,28
560 DATA 162,255,160,48,32,201,253,32
570 DATA 0,254,169,1,76,105,249,234
```

Notes about the Source Code block:
- The above BASIC listing has been cleaned from OCR artifacts: string-variable tokens are normalized to `$` (e.g., `EN$`, `Q$`), `CHR$()` used for byte construction, `GOSUB` used for subroutine calls.
- The `DATA` bytes at lines 550–570 are provided verbatim from the source and represent the machine-code routine uploaded to the 1541 RAM and then executed via the job queue.

## Key Registers
- **$0000–$0005:** Job queue command and status registers.
- **$0006–$0007:** Buffer #0 track and sector register.
- **$0008–$0009:** Buffer #1 track and sector register.
- **$000A–$000B:** Buffer #2 track and sector register.
- **$000C–$000D:** Buffer #3 track and sector register.
- **$000E–$000F:** Buffer #4 track and sector register.

## References
- "Inside Commodore DOS" — detailed information on the 1541 job queue and memory map.
- Commodore 1541 Service Manual — technical details on the 1541 disk drive.
- Commodore 1541 User's Guide — official manual for the 1541 disk drive.