# BASIC front-end: "23 ERROR - 1541" (lines 100–530)

**Summary:** Commodore BASIC front-end that prompts for a track/sector pair, validates parameters, opens the 1541 drive (OPEN15,8,15), exchanges command/response with the drive via PRINT#15 / INPUT#15, calls a job subroutine (GOSUB 550) for SEEK/READ (JOB=176 / JOB=128), assembles sector data into strings (D$ array), and sends low-level drive commands (PRINT#15 "M-W"/"M-R", GET#15) to execute the final operation.

**Program overview and control flow**
This listing is a BASIC driver and front-end that:

- Displays prompts and asks the user for a track/sector pair to operate on ("DESTROY TRACK AND SECTOR (T,S)").
- Validates the track (T) and sector (S) ranges and computes a track-specific sector count NS using a boolean arithmetic expression.
- Asks for user confirmation before proceeding.
- Opens channel 15 to device 8 (the 1541): OPEN15,8,15
- Sends a short command to the drive and reads a multi-field response with INPUT#15 into response variables (E$, EM$, ET$, ES$). If the response is "00" it continues; otherwise it prints the error fields and exits.
- Sets JOB to 176 and 128 for SEEK and READ respectively and calls a job-queue subroutine at line 550 (GOSUB 550) to perform the low-level drive operations.
- Iterates over 12 blocks (J=0..11) and 8 bytes per block (I=0..7) to collect raw bytes and append them to D$ strings.
- Writes the collected blocks back to the drive using "M-W" low-level write commands (PRINT#15 with CHR$ sequences and data strings), then issues an execute sequence ("M-W" with specific CHR$ parameters followed by "M-R" and GET#15 to read a status byte).
- Interprets the returned status byte (converts via ASC) and loops or finishes depending on its value; closes channel 15 and prints a completion message.

**Validation and parameter handling**
- Track bounds check: IF T<10 OR T>35 THEN END — disallow tracks below 10 or above 35.
- Sector count NS computed by a boolean-style expression (NS=20+2*(T>17)+(T>24)+(T>30)), reflecting C-style use of relational expressions as 0/1 values to compute per-track sector counts.
- Sector bounds check: IF S<0 OR S>NS THEN END
- Confirmation prompt: INPUT "... ARE YOU SURE Y (Y/N) ";Q$ followed by IF Q$<>"Y" THEN END

**Drive I/O sequence (high-level)**
- OPEN15,8,15 to claim channel 15 to the 1541 (device 8).
- PRINT#15,"10" then INPUT#15,E$,EM$,ET$,ES$ — sends a command and reads a four-field response from the drive. The code expects E$="00" to continue; otherwise it prints the response and exits.
- SEEK: JOB=176 then GOSUB 550 — job-queue subroutine performs the physical seek (subroutine not included here).
- READ: JOB=128 then GOSUB 550 — job-queue subroutine performs the low-level read into an internal buffer (subroutine not included here).
- Data assembly loops collect individual bytes (via CHR$) into D$ string elements.
- Data transfer to the drive uses PRINT#15 with "M-W" commands and CHR$ parameters to write blocks (no spacing via semicolons in the PRINT#15 statement).
- EXECUTE: issues a final "M-W" with parameters, then "M-R" and GET#15 to obtain a status byte; if status indicates continuation (E>127), it loops reading status again.
