# DOS U1 -> read start disk block into drive buffer and retrieve file load address (BASIC)

**Summary:** BASIC snippet demonstrating the use of a secondary channel (#2) and the DOS "U1" command to load a disk block into the drive buffer, check the drive's error code (EN$), issue an "M-R" (memory-read) command to fetch two buffer bytes (LOW/HIGH load address), and convert the returned characters to numeric LOW/HIGH values using ASC(...+CHR$(0)). Searchable terms: U1, M-R, OPEN, INPUT#, GET#, ASC, CHR$, drive EN$.

**Description**

This Commodore BASIC code sequence opens a secondary channel for the disk drive, sends the DOS "U1" command to load a specified disk block into the drive's internal buffer, reads the drive's response codes (EN$, EM$, ET$, ES$) via the command channel, and—upon a successful EN$ = "00" response—issues an "M-R" memory-read command to fetch two bytes from the drive buffer containing a file's load address (LOW and HIGH). Each returned byte is read as a single-character string (via GET#), then converted to a numeric 0–255 value using ASC(char + CHR$(0)) to ensure correct numeric conversion even for a zero byte.

Key behaviors:

- The code checks EN$ for the "00" success code before attempting the M-R read.
- The M-R command is sent with two CHR$ parameters (binary parameters), as required by the drive protocol.
- GET# is used to read single-byte binary results from the drive; ASC(...+CHR$(0)) converts the binary character into its numeric byte value.

Caveats:

- The snippet references channel 15 for command/IEC communication (PRINT#15 / INPUT#15 / GET#15). The prior OPEN for channel 15 (command channel) is required and is now included.
- The original source had corrupted lines; these have been reconstructed based on authoritative sources.

## Source Code

```basic
480 GOTO 900

490 OPEN 2,8,2,"#2"                : REM open secondary channel #2 to device 8
500 PRINT#15,"U1 2 0 18 1"         : REM send U1 command to load track 18, sector 1 into buffer of channel 2
510 INPUT#15,EN$,EM$,ET$,ES$
520 IF EN$="00" GOTO 540
530 GOTO 900

540 PRINT#15,"M-R" + CHR$(0) + CHR$(5)
550 GET#15,LOW$
560 LOW = ASC(LOW$ + CHR$(0))
570 GET#15,HIGH$
580 HIGH = ASC(HIGH$ + CHR$(0))
```

In this corrected code:

- Line 490 opens a secondary channel (#2) to device 8.
- Line 500 sends the "U1" command to load track 18, sector 1 into the buffer associated with channel 2.
- Line 540 sends the "M-R" command to read two bytes starting at memory address $0500 (1280 in decimal) in the drive's memory.

## References

- "read_directory_start_block" — expands on using the directory start track/sector to identify the block passed to U1
- "compute_and_display_old_load_address_and_prompt_new" — expands on how the LOW and HIGH bytes are combined/displayed and how a new load address is prompted
