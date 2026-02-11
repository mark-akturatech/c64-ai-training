# 7.9 How to Duplicate a 23 Error on a Single Sector

**Summary:** This Commodore 64 BASIC program for the 1541 disk drive reproduces a "23 error" on a specified track and sector by reading from a master disk. The program prompts the user for track and sector numbers, validates the input, calculates the number of sectors per track, confirms the operation, and initiates disk I/O operations. The core seek/read and clone-write sequence is referenced but not included in this chunk.

**Procedure**

The program follows these steps:

1. Display a title and prompt the user to insert the master disk.
2. Prompt the user to input the track (T) and sector (S) numbers.
3. Validate that T is within the allowed range (1 to 35).
4. Calculate the number of sectors on the specified track (NS) based on standard 1541 sector-count logic.
5. Validate that S is within the range 0 to NS.
6. Ask for confirmation to proceed.
7. Open the command channel to the disk drive and send a command.
8. Read the drive's response and check for errors.
9. If no errors are detected, proceed to the clone/write sequence (not included here).
10. If errors are detected, display the error message, close the command channel, and end the program.

## Source Code

```basic
100 REM DUPLICATE A 23 ERROR - 1541
110 DIM D$(10)

120 PRINT CHR$(147) "DUPLICATE A 23 ERROR - 1541"
130 PRINT "INSERT MASTER DISKETTE IN DRIVE"

140 INPUT "READ TRACK AND SECTOR (T,S) "; T, S

150 IF T < 1 OR T > 35 THEN END

160 IF T <= 17 THEN NS = 21
    IF T >= 18 AND T <= 24 THEN NS = 19
    IF T >= 25 AND T <= 30 THEN NS = 18
    IF T >= 31 AND T <= 35 THEN NS = 17

170 IF S < 0 OR S >= NS THEN END

180 INPUT "ARE YOU SURE (Y/N) "; Q$

190 IF Q$ <> "Y" AND Q$ <> "y" THEN END

200 OPEN 15, 8, 15
210 PRINT#15, "I"

220 INPUT#15, EN$, EM$, ET$, ES$

230 IF EN$ = "00" THEN GOTO 280

240 PRINT EN$, EM$, ET$, ES$
250 CLOSE 15
260 END
```

## References

- "duplicate_23_error_master_read_and_clone_write_sequence" — expands on core seek/read and clone write flow called after initial checks
- "duplicate_23_error_machine_language_data_payload" — expands on machine-language payload invoked/used by the BASIC execute steps