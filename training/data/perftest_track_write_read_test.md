# PERFTEST: Track-level performance test (BASIC listing)

**Summary:** BASIC program that opens a command channel to a device (OPEN 4,8,4,"#"), sends a block-protect (b-p) command with a pseudo-random buffer index, constructs a 255-byte buffer (nn$) and writes it to the drive file handle, issues U2 (write track) and U1 (read track) commands for a logical track variable (lt) and track 1, uses GOSUB 1840 to display device responses, then closes the handle and prints success/removal/power-down messages.

## Description
This BASIC snippet performs a drive-level performance/verification sequence:

- Setstting tt=21 (line 1510) — likely a test identifier.
- Opens logical file handle 4 to device 8 with secondary address 4 as the command channel: OPEN 4,8,4,"#".
- Sends a block-protect command to the drive with a pseudo-random target buffer index via PRINT#1,"b-p";4;nn% (line 1530).
- Builds a 255-byte buffer nn$ by concatenating CHR$(1) through CHR$(255) in a loop (line 1540).
- Writes that 255-byte buffer to the previously opened file handle (PRINT#4,nn$) (line 1550).
- Issues U2 (write track) commands to the drive for the variable lt and track 1; after each U2 it sets cc$ and calls GOSUB 1840 (lines 1560–1590) to display status/responses.
- Issues U1 (read track) commands for lt and track 1, again using GOSUB 1840 to display responses (lines 1600–1630).
- Closes the handle (CLOSE 4) and prints user instructions to remove the disk and power down (lines 1640–1720).
- Program ends with END (1720).

Important behavioral details preserved from the source:
- The buffer length is exactly 255 bytes (nn$).
- The pseudo-random index for the block-protect command uses nn%=(1+rnd(ti)*254+nn%) and masks with AND 255 to ensure 0–255 range (line 1530).
- Device commands are sent using PRINT# to a command channel (the snippet shows PRINT#1 for device commands).
- Device responses are handled/displayed by a separate subroutine at line 1840 (not included in this chunk).

**[Note: Source may contain an error — device command PRINT# lines target channel 1 while the OPEN uses file handle 4; likely PRINT#4 was intended. This discrepancy is present in the original listing.]**

## Source Code
```basic
 1490 :
 1500 :
 1510 tt=21
 1520 open 4,8,4,"#"
 1530 nn%=(1+rnd(ti)*254+nn%)and 255:print#1,"b-p";4;nn%
 1540 nn$="":for i=1 to 255:nn$=nn$+chr$(i):next
 1550 print#4,nn$
 1560 print#1,"u2:";4;0;lt;0
 1570 cc$="write track"+lt$:gosub 1840
 1580 print#1,"u2:";4;0;1;0
 1590 cc$="write track 1":gosub 1840
 1600 print#1,"u1:";4;0;lt;0
 1610 cc$="read track"+lt$:gosub 1840
 1620 print#1,"u1:";4;0;1;0
 1630 cc$="read track 1":gosub 1840
 1640 close 4
 1650 :
 1660 :
 1670 print "{down} unit has passed"
 1680 print "     performance test!"
 1690 print "{down} pull diskette from"
 1700 print "{down}  drive before turning"
 1710 print "   power off."
 1720 end
```

## References
- "perftest_io_response_handler" — expands on displays and checks responses for the b-p/u2/u1 track commands
- "perftest_tokenized_prg_blob" — tokenized PRG (PERFTEST.PRG) binary follows the BASIC listing