# Edit Load Address — line-range functional map

**Summary:** This program allows users to modify the load address of a specified file on a Commodore 64 disk. It performs the following functions:

- Queries the DOS version by reading the byte at memory location $0101.
- Prompts the user for a filename.
- Opens and closes logical file number 2 to device 8 with a secondary address of 2.
- Reads the starting track and sector of the specified file from the directory entry bytes $0018 (track) and $0019 (sector).
- Reads the first block of the file into buffer $0500–$05FF.
- Fetches the two-byte load address from buffer offsets $0502–$0503 using the memory-read (M-R) command.
- Converts the load address between hexadecimal and decimal for display and input.
- Writes a new load address into buffer offsets $0502–$0503 using the memory-write (M-W) command.
- Writes the modified buffer back to disk.

**Line-range functional descriptions**

- **260–320**: Query DOS version by reading the byte at $0101.
- **330–350**: Prompt for and input the filename.
- **360–390**: Open logical file number 2 to device 8 with a secondary address of 2 for reading the program.
- **400–440**: Fetch the file's starting track ($0018) and sector ($0019) from the directory entry.
- **450**: Close logical file number 2.
- **490**: Reopen logical file number 2 to device 8 with a secondary address of 2, assigning buffer number 2 ($0500–$05FF) as a workspace.
- **500**: Read the starting block of the file from drive 0, as specified by $0018 and $0019, into channel 2 buffer area ($0500–$05FF).
- **540**: Issue a three-parameter memory-read (M-R) command to fetch the two-byte load address from buffer offsets $0502–$0503.
- **550**: Fetch the low byte of the load address from $0502.
- **570**: Fetch the high byte of the load address from $0503.
- **590–640**: Convert the fetched load address from hexadecimal to decimal for display.
- **660–700**: Prompt for and input a new load address.
- **710–780**: Convert the entered new load address from decimal to hexadecimal.
- **790**: Use the memory-write (M-W) command to write the new two-byte load address into buffer offsets $0502–$0503.
- **800**: Write the channel 2 buffer ($0500–$05FF) back to drive 0 at the track and sector specified in $0018 and $0019.

## Source Code

```basic
260 REM QUERY DOS VERSION
270 OPEN 15,8,15
280 PRINT#15,"I"
290 INPUT#15,A$
300 CLOSE 15
310 PRINT "DOS VERSION: ";A$

330 REM INPUT FILENAME
340 INPUT "ENTER FILENAME: ";F$

360 REM OPEN FILE FOR READING
370 OPEN 2,8,2,F$
380 IF DS$<>"" THEN PRINT DS$:CLOSE 2:END

400 REM FETCH FILE'S STARTING TRACK AND SECTOR
410 OPEN 15,8,15
420 PRINT#15,"U1";CHR$(2);CHR$(0);CHR$(0)
430 INPUT#15,T,S
440 CLOSE 15

450 REM CLOSE FILE
460 CLOSE 2

490 REM REOPEN FILE WITH BUFFER
500 OPEN 2,8,2,F$,B2

500 REM READ FIRST BLOCK INTO BUFFER
510 OPEN 15,8,15
520 PRINT#15,"U1";CHR$(2);CHR$(T);CHR$(S)
530 CLOSE 15

540 REM MEMORY-READ COMMAND TO FETCH LOAD ADDRESS
550 OPEN 15,8,15
560 PRINT#15,"M-R";CHR$(2);CHR$(5);CHR$(2)
570 INPUT#15,A$,B$
580 CLOSE 15

590 REM CONVERT LOAD ADDRESS TO DECIMAL
600 LA=ASC(A$)+256*ASC(B$)
610 PRINT "CURRENT LOAD ADDRESS: ";LA

660 REM INPUT NEW LOAD ADDRESS
670 INPUT "ENTER NEW LOAD ADDRESS: ";NL

710 REM CONVERT NEW LOAD ADDRESS TO HEX
720 NH=INT(NL/256)
730 NL=NL-NH*256

790 REM MEMORY-WRITE COMMAND TO WRITE NEW LOAD ADDRESS
800 OPEN 15,8,15
810 PRINT#15,"M-W";CHR$(2);CHR$(5);CHR$(2);CHR$(NL);CHR$(NH)
820 CLOSE 15

830 REM WRITE BUFFER BACK TO DISK
840 OPEN 15,8,15
850 PRINT#15,"U2";CHR$(2);CHR$(T);CHR$(S)
860 CLOSE 15

870 PRINT "LOAD ADDRESS UPDATED SUCCESSFULLY."
```

## Key Registers

- **$0101**: DOS version/status byte as read by the program.
- **$0018**: Directory entry byte indicating the file's starting track.
- **$0019**: Directory entry byte indicating the file's starting sector.
- **$0500–$05FF**: Channel 2 buffer workspace (buffer #2 used for read/modify/write operations).
- **$0502–$0503**: Two-byte load address stored in the file's first block (low byte at $0502, high byte at $0503).

## References

- "Inside Commodore DOS" — Detailed explanation of DOS commands and memory operations. ([pagetable.com](https://www.pagetable.com/docs/Inside%20Commodore%20DOS.pdf?utm_source=openai))
- "Commodore 1541 User's Guide" — Official manual detailing disk drive commands and operations. ([datassette.s3.us-west-004.backblazeb2.com](https://datassette.s3.us-west-004.backblazeb2.com/manuais/1541_users_guide.pdf?utm_source=openai))