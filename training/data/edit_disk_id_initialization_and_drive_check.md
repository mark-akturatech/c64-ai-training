# EDIT DISK ID (BASIC fragment — 1541 status query)

**Summary:** BASIC program fragment that prompts to insert a disk, waits for Return, opens command channel 15 to device 8 with `OPEN15,8,15`, sends the "I0" command via `PRINT#15,"I0"`, reads four status tokens (EN$, EM$, ET$, ES$) with `INPUT#15`, checks if `EN$="00"` before proceeding, and prints the error codes otherwise.

**Description**
This BASIC fragment performs an early-drive-status check on a Commodore 1541 (device 8) before continuing. It:

- Prints user prompts (disk insert and press RETURN).
- Waits for a carriage-return key press.
- Prints "OK", opens logical file 15 to device 8 (`OPEN15,8,15`).
- Sends the string "I0" to the drive command channel with `PRINT#15,"I0"`.
- Performs `INPUT#15, EN$, EM$, ET$, ES$` to read four status tokens returned by the drive.
- Tests `EN$ = "00"` (no error) and branches to line 250 if OK; otherwise prints the four tokens and closes channel 15, then ends.

The listing shows typical 1541 command-channel I/O: open channel 15, send a command string, then `INPUT#` the drive's textual response into string variables.

## Source Code
```basic
100 REM EDIT DISK ID

110 PRINT "EDIT DISK ID - 1541"

120 PRINT "REMOVE WRITE PROTECT TAB"

130 PRINT "INSERT DISKETTE IN DRIVE"

140 PRINT "PRESS RETURN TO CONTINUE"

150 GET C$: IF C$ = "" THEN 150

160 IF C$ <> CHR$(13) THEN 150

170 PRINT "OK"

180 OPEN 15,8,15

190 PRINT#15, "I0"

200 INPUT#15, EN$, EM$, ET$, ES$

210 IF EN$ = "00" THEN GOTO 250

220 PRINT EN$, EM$, ET$, ES$

230 CLOSE 15

240 END

250 REM CONTINUE PROGRAM
```

## References
- "edit_disk_id_overview_and_block_write_alternatives_top" — expands on what the program does and where the write operation occurs
- "edit_disk_id_buffer_open_and_dos_version_query" — expands on continuing by opening logical file 2 and querying DOS version