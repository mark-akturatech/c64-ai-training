# DESTROY A SECTOR (BASIC front-end for 1541)

**Summary:** BASIC front-end that prompts for a 1541 track and sector, validates track (1–35) and sector against the track's sector count, computes NS (number of sectors on the chosen track) using the 1541 geometry formula, and asks for a final Y confirmation before proceeding to drive access.

**Program purpose**
This BASIC chunk prepares and validates parameters for a later drive-access routine: it prompts the user for a track T and sector S to "destroy", computes the allowed sector count (NS) for the chosen track, rejects out-of-range inputs, and requests an explicit confirmation (Y) before continuing. It does not perform any disk I/O itself; those actions are covered by separate chunks (device_open_and_drive_status_check, seek_operation_job_submission).

**Parameter parsing and validation**
- DIM D$(7) reserves a short string variable (source used D$(7); exact usage is for forming drive commands later).
- The program forces T to the valid 1541 track range 1..35: IF T<1 OR T>35 THEN END.
- NS is calculated from the chosen track using 1541 geometry. The canonical sector counts per track are: 1–17 = 21, 18–24 = 19, 25–30 = 18, 31–35 = 17. The corrected compact formula used here is:
  NS = 21 - 2*(T>17) - (T>24) - (T>30)
  which yields the values above for integer T in 1..35.
- The program then checks that S is within the allowed sector numbers for that track. Valid sector numbering on the 1541 is typically 0..NS-1; this listing enforces that range with IF S<0 OR S>NS-1 THEN END.
- Finally, a confirmation prompt reads Q$ and exits unless the user explicitly enters "Y".

**[Note: Source may contain an error — the original OCRed formula read NS=20+2*(T>17)+(T>24)+(T>30), which does not match the standard 1541 sector counts; the formula above is corrected to the standard geometry.]**

## Source Code
```basic
100 REM DESTROY A SECTOR - 1541
110 DIM D$(7)
120 PRINT CHR$(147);"DESTROY A SECTOR - 1541"
130 PRINT CHR$(17);" INSERT CLONE IN DRIVE"
140 INPUT CHR$(17);" DESTROY TRACK AND SECTOR (T,S)";T,S
150 IF T<1 OR T>35 THEN END
160 NS = 21 - 2*(T>17) - (T>24) - (T>30)
170 IF S<0 OR S>NS-1 THEN END
180 INPUT CHR$(17);" ARE YOU SURE (Y/N)";Q$
190 IF Q$<>"Y" THEN END
```

## References
- "device_open_and_drive_status_check" — opens the drive and reads status after parameters are entered
- "seek_operation_job_submission" — uses validated track/sector values to perform the seek/write operation
