# MEMORY-READ (M-R)

**Summary:** Disk drive MEMORY-READ (PRINT#file#,"M-R" CHR$(low) CHR$(high)) uses the error channel (channel 15) to read bytes from the disk controller's RAM/ROM/buffers; next GET# or successive GET#s on channel 15 return bytes starting at that address. Example BASIC program: RDISKMEM.PRG.

## Memory-Read (M-R)

There is 16K of ROM and 2K of RAM in the disk drive. The MEMORY-READ command selects a start address in the disk controller's memory and causes the next byte(s) read via the error channel (channel 15) to be returned from that memory.

Format (no abbreviation allowed):
PRINT#file#, "M-R" CHR$(low byte of address) CHR$(high byte of address)

Notes:
- Open the error channel to the drive before use, e.g. OPEN 15,8,15.
- The next GET# on channel 15 returns the byte at the specified address; successive GET#s return subsequent bytes.
- Using INPUT# on the error channel while in this mode may produce peculiar results; issuing any other (non-memory) command to the disk clears this state.
- The command targets the disk controller's memory (ROM/RAM/buffers), not the C64 system RAM.

Minimal example usage (single-instruction example):
PRINT#15,"M-R" + CHR$(low) + CHR$(high)  then GET#15,...

## Source Code
```basic
10 OPEN 15,8,15
20 INPUT "location please";A
25 FOR L=1 TO 50
30 A1=INT(A/256):A2=A-A1*256
40 PRINT#15,"M-R" CHR$(A2)CHR$(A1)
50 GET#15,A$: REM get chars from error channel
60 PRINT ASC(A$+CHR$(0))
70 A=A+1
80 NEXT
90 INPUT "continue";A$
100 IF LEFT$(A$,1)="y" THEN 25
110 GOTO 20
```

## References
- "appendix_a_disk_command_summary" — expands on summary entry for MEMORY-READ (M-R) and other memory commands
