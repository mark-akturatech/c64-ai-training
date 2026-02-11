# EDIT DISK NAME — program start (BASIC)

**Summary:** Beginning of a Commodore 64 BASIC program to edit a 1541 disk name; builds a 16-character padding string (PAD$ using CHR$(160)), prompts user to insert a disk and press RETURN, opens the command channel (OPEN 15,8,15), sends the drive status/identify command ("10"), reads the drive response (INPUT#15 into EN$, EM$, ET$, ES$), and handles initialization failure by printing the error bytes and closing channel 15.

**Program overview**
This chunk contains the front-end and drive-initialization portion of an "EDIT DISK NAME" utility for the 1541 drive. Behavior covered:

- Create a 16-character padding string (PAD$) by repeatedly concatenating CHR$(160) — used later to pad or clear the disk-name field.
- Display UI messages instructing the operator to insert a disk into the drive and press RETURN.
- Wait for the RETURN key (CHR$(13)) using GET C$.
- Open the serial command channel 15 to device 8 with secondary 15 (OPEN 15,8,15).
- Send the "10" command to the drive (PRINT#15,"10") — the drive command used here to request status/identify information.
- Read the drive's response from channel 15 with INPUT#15 into four variables: EN$, EM$, ET$, ES$.
- Test EN$ for the ASCII string "00" (success) and branch to continuation (line 280, not present here) if OK. On failure, print the four returned bytes, CLOSE 15 and END the program.

This chunk does not include the subsequent routine that opens the data channel, reads the BAM/disk-name buffer, or performs the disk-name editing and writing.

## Source Code
```basic
100 REM EDIT DISK NAME
110 FOR I=1 TO 16
120 PAD$ = PAD$ + CHR$(160)
130 NEXT I

140 PRINT "  "; CHR$(147); "  EDIT  DISK  NAME  -  1541"
150 PRINT " "; CHR$(17); "REMOVE   "; CHR$(18); "WRITE  PROTECT  TAB"; CHR$(146)
160 PRINT " "; CHR$(17); " INSERT  DISKETTE   IN  DRIVE"
170 PRINT "  "; CHR$(17); "  PRESS   "; CHR$(18); "  RETURN "; CHR$(146); " TO  CONTINUE"

180 GET C$: IF C$ = "" THEN 180
190 IF C$ <> CHR$(13) THEN 180
200 PRINT "OK"

210 OPEN 15,8,15
220 PRINT#15, "10"
230 INPUT#15, EN$, EM$, ET$, ES$
240 IF EN$ = "00" GOTO 280
250 PRINT " "; CHR$(17); EN$; ", "; EM$; ", "; ET$; ", "; ES$
260 CLOSE 15
270 END
```

## References
- "block_vmte_write_behavior_and_overview" — expands on U2 behavior and example program overview
- "edit_disk_name_read_bam_and_modify_disk_name" — continues this program: opens the data channel, reads the BAM/disk-name buffer and proceeds to edit/write the disk name