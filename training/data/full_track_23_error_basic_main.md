# How to Create 23 Errors on a Full Track (BASIC driver for 1541)

**Summary:** Commodore 64 BASIC driver for creating multiple "23" errors across a full track on a 1541 disk (uses OPEN 15, PRINT#15 / INPUT#15, CHR$ sequences, track parameter T, per-sector loop, and destructive WRITE sequence).

**Overview**
This program prompts the user for a track number, confirms the destructive action, opens the drive IEC channel, queries device status, seeks to the requested track, loops over the sectors on that track, and executes a destructive WRITE sequence intended to create "23" errors across the entire track.

The program:
- Prompts the user to insert a "clone" disk and confirm the operation.
- Validates the track number (1–35).
- Opens the serial channel to device number 8 (`OPEN 15,8,15`) and reads the device's status bytes via `INPUT#15`.
- Calculates the number of sectors on the requested track (`NS`).
- Iterates `S = 0` to `NS`, performing read/patch/write operations per sector by calling embedded subroutines (`GOSUB`) and sending formatted IEC commands with `CHR$`-encoded parameters.
- Triggers the destructive WRITE sequence that the 1541 executes (via "M-W"/"M-R"/control-byte sequences sent to the drive).

## Source Code
```basic
100 REM 23M ERROR - 1541
110 DIM D$(11)

120 PRINT"      MULTIPLE 23 ERROR - 1541"

130 PRINT"      INSERT CLONE IN DRIVE"
140 INPUT"      DESTROY TRACK";T
150 IF T<1 OR T>35 THEN END

160 INPUT"      ARE YOU SURE Y$ (LEFT 3) ";Q$
170 IF Q$<>"Y" THEN END

180 OPEN 15,8,15
190 PRINT#15,"I0"
200 INPUT#15,EN$,EM$,ET$,ES$
210 IF EN$="00" GOTO 260
220 PRINT"      ";EN$;",";EM$;",";ET$;",";ES$
230 CLOSE 15
240 END

250 REM SEEK
260 JOB=176
270 GOSUB 580

280 NS=20+2*(T>17)+(T>24)+(T>30)
290 FOR S=0 TO NS
300 REM READ
310 JOB=128
320 GOSUB 550
330 IF S>0 GOTO 460
340 FOR J=0 TO 11
350 FOR I=0 TO 7
360 READ D
370 D$(J)=D$(J)+CHR$(D)
380 NEXT I
390 NEXT J
400 I=0
410 FOR J=0 TO 11
420 PRINT#15,"M-W"+CHR$(I)+CHR$(5)+CHR$(8)+D$(J)
430 I=I+8
440 NEXT J
450 REM EXECUTE
460 PRINT" <HOME>      DESTROYING TRACK ";T;" - SECTOR ";S
470 PRINT#15,"M-W"+CHR$(2)+CHR$(0)+CHR$(1)+CHR$(224)
480 PRINT#15,"M-R"+CHR$(2)+CHR$(0)
490 GET#15,E$
500 IF E$="" THEN E$=CHR$(0)
510 E=ASC(E$)
520 IF E>127 GOTO 480
530 NEXT S
540 CLOSE 15
550 PRINT" <HOME>      DONE!"
560 END

570 REM JOB QUEUE SUBROUTINE
580 PRINT#15,"M-W"+CHR$(0)+CHR$(0)+CHR$(1)+CHR$(JOB)
590 PRINT#15,"M-R"+CHR$(0)+CHR$(0)
600 GET#15,E$
610 IF E$="" THEN E$=CHR$(0)
620 E=ASC(E$)
630 IF E>127 GOTO 590
640 RETURN

650 REM MACHINE CODE DATA
660 DATA 32, 71, 198, 76, 0, 3
670 DATA 173, 0, 28, 41, 16, 201, 16, 208
680 DATA 11, 169, 247, 45, 0, 28, 141, 0
690 DATA 28, 76, 0, 3, 32, 24, 193, 76
700 DATA 0, 3
```

Notes about the listing:
- This BASIC listing is a cleaned/corrected transcription of the source; tokens corrected where OCR artifacts were obvious (G0SUB → GOSUB, G0T → GOTO, numeric/letter confusions).
- The `DATA` statements at lines 660–700 provide the machine code data referenced by the `READ D` statements in lines 360–370.
- The subroutine at line 580 (`GOSUB 580`) implements the JOB QUEUE functionality, sending commands to the 1541 drive and waiting for completion.

## References
- "full_track_23_error_basic_job_queue_and_data" — expands on JOB QUEUE subroutine and the embedded machine-code DATA used by this BASIC driver
- "full_track_23m_assembly_source" — assembly-level driver that the DATA block encodes and that is ultimately executed
