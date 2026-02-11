# EDIT LOAD ADDRESS — 1541 DOS Handshake and Initial UI

**Summary:** This Commodore 64 BASIC program fragment displays UI prompts, waits for user input, establishes communication with the 1541 disk drive, sends a DOS inquiry command, reads the DOS response, handles error codes, queries the DOS version, and branches based on the DOS version detected.

**Description**

This program segment performs the following steps:

- Displays a UI header and instructions prompting the user to insert a disk and press RETURN to continue.
- Waits for the user to press the RETURN key.
- Opens the command channel (15) to device 8 (the 1541 disk drive).
- Sends the DOS "inquiry" command by writing the string "I0" to the command channel.
- Reads the four returned status tokens: EN$ (error number), EM$ (error message), ET$ (track), and ES$ (sector).
- If EN$ equals "00" (indicating no error), the program proceeds to query the DOS version.
- For non-"00" error codes, the program prints the error information, closes the command channel, and ends.
- To query the DOS version, the program sends the memory read command "M-R" followed by two CHR$(1) characters to read a byte from memory location $0101.
- Reads the returned byte into DOS$, converts it to a numeric value, and branches based on the DOS version detected.

This fragment serves as the initial DOS probe before proceeding to file operations.

## Source Code

```basic
100 REM EDIT LOAD ADDRESS
110 H$=" 0123456789ABCDEF "
120 PRINT"  {CLR}EDIT LOAD ADDRESS - 1541"
130 PRINT"  {DOWN} REMOVE {RVS}WRITE PROTECT{OFF} TAB"
140 PRINT"  {DOWN} INSERT DISKETTE IN DRIVE 1"
150 PRINT"  {DOWN}PRESS {RVS}RETURN{OFF} TO CONTINUE"
160 GET A$: IF A$="" THEN 160
170 IF A$<>CHR$(13) THEN 160
180 PRINT"OK"
190 OPEN 15,8,15
200 PRINT#15,"I0"
210 INPUT#15,EN$,EM$,ET$,ES$
220 IF EN$="00" GOTO 260
230 PRINT"  {DOWN}" EN$ "," EM$ "," ET$ "," ES$
240 CLOSE 15
250 END
260 PRINT#15,"M-R"+CHR$(1)+CHR$(1)
270 GET#15,DOS$
280 IF DOS$="" THEN DOS$=CHR$(0)
290 DOS=ASC(DOS$)
300 IF DOS=65 GOTO 330
310 PRINT"  {DOWN} 73, CBM DOS V2.6 1541,00,00"
320 GOTO 910
```

## References

- "filename_input_and_file_open" — expands on prompts for filename and opens the file after DOS initialization.
- Commodore 1541 User's Guide
- Inside Commodore DOS
- Commodore 1541 Service Manual
