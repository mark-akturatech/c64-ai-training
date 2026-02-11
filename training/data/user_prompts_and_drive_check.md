# Certifier — user interaction and drive initialization (BASIC)

**Summary:** This Commodore 64 BASIC program fragment displays a certification warning message, waits for user confirmation, initializes communication with the disk drive, sends a DOS command to check the drive status, and processes the response.

**Program behavior**

This BASIC fragment:

- Prints a multi-line certification and warning message using PETSCII control codes for screen formatting.
- Waits for the user to press RETURN, looping on GET until CHR$(13) is detected.
- Opens the serial command channel to device 8 (OPEN 15,8,15).
- Sends the DOS command "I0" to the drive via PRINT#15.
- Reads the drive's response with INPUT#15 into the string variables EN$, EM$, ET$, and ES$ (representing DOS error/status fields).
- Checks if EN$ equals "00"; if true, the program continues at line 330, otherwise it prints the error message, closes the channel, and ends.

## Source Code

```basic
160 PRINT "  {CLR}  CERTIFY  A  DISKETTE"
170 PRINT "  {DOWN}  {RVS}WARNING{OFF}"
180 PRINT "  {DOWN}{RVS}RANDOM  ACCESS  AND  DELETE  FILES  WILL  BE  LOST{OFF}"
190 PRINT "REMOVE  {RVS}WRITE  PROTECT  TAB{OFF}"
200 PRINT " {DOWN} INSERT  DISKETTE  IN  DRIVE  1"
210 PRINT " {DOWN} PRESS  {RVS}RETURN{OFF} TO  CONTINUE"
220 GET C$ : IF C$ = "" THEN 220
230 IF C$ <> CHR$(13) THEN 220      : REM wait for RETURN
240 PRINT "OK"
250 OPEN 15,8,15
260 PRINT#15,"I0"
270 INPUT#15,EN$,EM$,ET$,ES$
280 IF EN$ = "00" GOTO 330
290 PRINT " {DOWN} "; EN$; " , "; EM$; " , "; ET$; " , "; ES$
300 CLOSE 15
310 END
```

## References

- "certify_program_header_and_variable_initialization" — expands on header variables and buffers used by the certifier
- "read_bam_and_dos_check" — follows this fragment with reading the BAM and checking DOS/version details
