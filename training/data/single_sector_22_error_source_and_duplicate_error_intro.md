# DUPLICATE A SINGLE SECTOR 22 ERROR (1541) — program header and initial I/O

**Summary:** BASIC program for the Commodore 64 / 1541 that duplicates a single-sector "22" error by modifying a data-block identifier (line 340 decrements the block ID; line 380 restores it). Contains prompts for master disk insertion, Track/Sector input validation, confirmation, and the initial OPEN/PRINT/INPUT#15 command/response exchange with the drive.

**Explanation**
This chunk documents the explanatory note and the start of the BASIC listing "DUPLICATE A SINGLE SECTOR 22 ERROR". The technique requires disk swapping and takes Track (T) and Sector (S) as parameters. The source states that line 340 performs the destructive change (decrementing the data-block identifier) to produce a single-sector 22 error and that line 380 restores the original value.

The provided listing includes:
- Program header and REM line.
- Prompt to insert the master disk and request for Track and Sector (INPUT T,S).
- Validation checks:
  - T must be >= 10 and <= 35 (line 140: `IF T<10 OR T>35 THEN END`).
  - Sector S is checked against NS (line 160) where NS is computed from T (line 150).
- NS calculation (line 150): `NS = 20 + 2*(T>17) + (T>24) + (T>30)` — used to compute number of sectors on the selected track (expression uses Boolean-to-integer evaluation typical in BASIC).
- Confirmation prompt before proceeding (line 170/180).
- Early drive I/O: `OPEN 15,8,15` to channel 15, `PRINT#15, "I0"` (drive command), `INPUT#15, EN$, EM$, ET$, ES$` to read the drive response; if EN$ = "00" the program branches to line 270; otherwise it prints the returned status bytes.

Note: Several PRINT strings and variable tokens in the OCR'd source appear garbled (e.g., "CCLRJDUFLICATE", "CDOWNJ", "Q*"). The code block below preserves original text as provided. Short parenthetical clarifications are used sparingly in this descriptive section only: (channel 15 is the serial channel to the 1541).

## Source Code
```basic
100 REM DUPLICATE A 22 ERROR - 1541
110 PRINT "DUPLICATE A 22 ERROR - 1541"
120 PRINT "INSERT MASTER IN DRIVE"
130 INPUT "TRACK AND SECTOR (T,S)"; T, S
140 IF T<10 OR T>35 THEN END
150 NS = 20 + 2*(T>17) + (T>24) + (T>30)
160 IF S<0 OR S>NS THEN END
170 INPUT "ARE YOU SURE (Y/N)"; Q$
180 IF Q$ <> "Y" THEN END
190 OPEN 15,8,15
200 PRINT#15, "I0"
210 INPUT#15, EN$, EM$, ET$, ES$
220 IF EN$ = "00" THEN GOTO 270
230 PRINT EN$, EM$, ET$, ES$
```

## References
- "full_track27_error_annotation_and_single_sector_22_error_listing" — expands on related technique: creating a single-sector 22 error.
- "job_queue_subroutine_listing_and_io_handling" — shares the same drive I/O/command conventions and uses the job-queue subroutine for communication.