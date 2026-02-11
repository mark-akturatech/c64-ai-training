# Filename input and DOS OPEN (OPEN 2,8,2 "O:<filename>,P,R")

**Summary:** Prompts for a filename (string), enforces filename length (1–16 chars), and issues a DOS open command using OPEN 2,8,2 with the drive command string "O:<filename>,P,R". Waits for the drive response on channel 15 via INPUT#15 (EN$, EM$, ET$, ES$) and branches on EN$ ("00" = success) to error/continuation handlers.

**Behavior / Operation**
- User is prompted for a filename string and the program checks its length: it must be greater than 0 and less than 17 characters (i.e., 1–16 characters).
- On invalid length, the code branches to an error/retry handler (GOTO 920 in the listing).
- On valid filename, the program issues:
  - `OPEN 2,8,2,"O:"+F$+",P,R"`
  - This sends the DOS command O: (open) with parameters P,R (open-for-read) to device 8 using secondary channel 2. The DOS response is sent to the command channel (channel 15).
- The program waits for the drive status string with:
  - `INPUT#15,EN$,EM$,ET$,ES$`
  - EN$ is the two-digit error code returned by the drive (EN$="00" indicates success). The program checks EN$ and branches to the appropriate handler (success → GOTO 400, failure → GOTO 940 in the listing).
- The listing uses standard Commodore DOS I/O conventions: open via a secondary channel and reading the drive reply via INPUT#15 (command channel) to obtain EN$, EM$, ET$, ES$ status fields.

## Source Code
```basic
330 INPUT "Filename: ";F$
340 IF LEN(F$)>0 AND LEN(F$)<17 THEN GOTO 360
350 GOTO 920
360 OPEN 2,8,2,"O:"+F$+",P,R"
370 INPUT#15,EN$,EM$,ET$,ES$
380 IF EN$="00" GOTO 400
390 GOTO 940
400 REM Success handler: Proceed to read file's start track/sector
410 REM (Implementation depends on specific program requirements)
920 REM Error/retry handler: Prompt user again or handle error
930 REM (Implementation depends on specific program requirements)
940 REM Failure handler: Handle DOS error based on EN$, EM$, etc.
950 REM (Implementation depends on specific program requirements)
```

## References
- "program_header_and_dos_initialization" — expands on DOS/channel initialization and inquiry
- "read_directory_start_block" — expands on next step: read the file's start track/sector after open