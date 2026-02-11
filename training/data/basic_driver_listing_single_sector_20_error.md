# Complete BASIC driver: single-sector "20 ERROR" on 1541

**Summary:** Commodore 64 BASIC program that builds and sends a machine-code payload (DATA lines) to a 1541 drive using the DOS command channel (OPEN/PRINT# /GET# /CLOSE) and drive memory read/write commands ("M-W", "M-R") to produce a single-sector 20 error. Contains user prompts, validation of track/sector input, seek/read/write routines, job-queue handling, and embedded machine-code bytes as DATA statements.

## Program structure
- Lines 100–260: user interface and initial drive open/verification. Prompts for track (T) and sector (S), validates ranges, confirms with user, opens drive channel 15 and checks drive status bytes (EN$, EM$, ET$, ES$).
- Lines 270–340: seek and read preparation. Computes JOB value for seek or read and calls the job queue subroutine (GOSUB 570).
- Lines 350–450: READ loop. Reads DATA bytes (machine code) into string array D$(), eight bytes per block, preparing 12 blocks (J=0..11) of 8 bytes each for transfer to the drive.
- Lines 460–540: execute phase. Writes the prepared blocks into the drive's memory (via "M-W" commands) and triggers execution ("M-W" execute packet), then polls with "M-R" and reads a response byte (GET#). Closes device and prints completion message.
- Lines 560–700: job queue subroutine (entry at 570). Implements job submission and polling logic to send job packets to the drive and wait for completion (retry loop of up to 500 tries, with error handling and abort).
- Lines 710–830: embedded DATA statements (machine-code bytes). These are the drive-resident machine routine the BASIC driver sends to the 1541; they are kept as DATA for the READ loop to assemble into D$() blocks.

## Source Code
```basic
100 REM 20 ERROR - 1541
110 DIM D$(11)
120 PRINT "{CLR} 20 ERROR - 1541"
130 PRINT "{DOWN} INSERT CLONE IN DRIVE"
140 INPUT "<DOWN> DESTROY TRACK AND SECTOR (T,S) ";T,S
150 IF T<1 OR T>35 THEN END
160 NS=20+2*(T>17)+(T>24)+(T>30)
170 IF S<0 OR S>NS THEN END
180 INPUT "<DOWN> ARE YOU SURE (Y/N) ";Q$
190 IF Q$<>"Y" THEN END
200 OPEN 15,8,15
210 PRINT#15,"10"
220 INPUT#15,EN$,EM$,ET$,ES$
230 IF EN$="00" THEN GOTO 280
240 PRINT "<DOWN>";EN$;",";EM$;",";ET$;",";ES$
250 CLOSE 15
260 END

270 REM SEEK
280 IF S=0 THEN S=NS:GOTO 300
290 S=S-1
300 JOB=176
310 GOSUB 570

320 REM READ
330 JOB=128
340 GOSUB 570

350 FOR J=0 TO 11
360 FOR I=0 TO 7
370 READ D
380 D$(J)=D$(J)+CHR$(D)
390 NEXT I
400 NEXT J

410 I=0
420 FOR J=0 TO 11
430 PRINT#15,"M-W";CHR$(I);CHR$(5);CHR$(S);D$(J)
440 I=I+8
450 NEXT J

460 REM EXECUTE
470 PRINT#15,"M-W";CHR$(2);CHR$(0);CHR$(1);CHR$(224)
480 PRINT#15,"M-R";CHR$(2);CHR$(0)
490 GET#15,E$
500 IF E$="" THEN E$=CHR$(0)
510 E=ASC(E$)
520 IF E>127 GOTO 480
530 CLOSE 15
540 PRINT "<DOWN> DONE!"
550 END

560 REM JOB QUEUE
570 TRY=0
580 PRINT#15,"M-W";CHR$(8);CHR$(0);CHR$(4);CHR$(T);CHR$(S);CHR$(T);CHR$(S)
590 PRINT#15,"M-W";CHR$(1);CHR$(0);CHR$(0);CHR$(JOB)
600 TRY=TRY+1
610 PRINT#15,"M-R";CHR$(1);CHR$(0)
620 GET#15,E$
630 IF E$="" THEN E$=CHR$(0)
640 E=ASC(E$)
650 IF TRY=500 GOTO 680
660 IF E>127 GOTO 600
670 IF E=1 THEN RETURN
680 CLOSE 15
690 PRINT "<DOWN> :RVS FAILED <ROFF>"
700 END

710 REM 20 ERROR

720 DATA 32,16,245,32,86,245,160,20
730 DATA 165,25,201,18,144,12,136,136
740 DATA 201,25,144,6,136,201,31,144
750 DATA 1,136,230,24,197,24,144,6
760 DATA 240,4,169,0,133,25,169,0
770 DATA 69,22,69,23,69,24,69,25
780 DATA 133,26,32,52,249,32,86,245
790 DATA 169,255,141,3,28,173,12,28
800 DATA 41,31,9,192,141,12,28,162
810 DATA 0,151,36,80,254,184,141,1
820 DATA 28,232,224,8,208,243,80,254
830 DATA 32,0,254,169,1,76,105,249
```

## References
- "overview_and_parameters_single_sector_20_error" — expands on Title, limitations and parameters for the BASIC driver
- "asm_source_listing_single_sector_20_error" — expands on Corresponding assembly source used by the BASIC program (DATA bytes and routines)
- "source_annotation_single_sector_20_error" — expands on Annotation explaining how the BASIC driver and machine routine achieve the 20 error
