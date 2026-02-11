# Recovering from a Full NEW (interrupted FORMAT)

**Summary:** Recovery steps and technical notes for an interrupted 1541 full FORMAT / "NEW" operation: open the drive immediately, stop further formatting (one track lost per stepper-motor click), run the 1541 BACKUP program and VALIDATE A DISKETTE to assess and often recover files; formatting order is track 1 (outer) → track 35 (inner) and DOS allocates files starting at track 18 and working outward.

**Procedure**

- **Immediate Action:** If a full FORMAT (NEW) is running and you notice it, open the 1541 drive door immediately to halt formatting. Prompt action limits damage.

- **Track Loss Awareness:** Each audible stepper-motor click during formatting corresponds to one full track lost. Act quickly to minimize the number of tracks overwritten.

- **Backup Attempt:** After stopping the process, attempt to make a disk copy using the 1541 BACKUP program. This program attempts to copy intact tracks before they are overwritten.

- **Validation:** Load and run VALIDATE A DISKETTE to assess which files and directory entries remain intact. Validation often allows recovery of many files.

**Technical Details**

- **Format Direction:** The 1541 full-format runs from the outermost track (track 1) inward to the innermost track (track 35).

- **DOS Allocation Behavior:** The DOS places files beginning at track 18 and works outward from there. Therefore, if formatting was interrupted before reaching track 18 (for example, stopped while formatting inner tracks), many files and directory information may remain intact.

- **Practical Consequence:** If you stopped formatting with track 18 still intact (or earlier), most files may be recoverable because allocation/used data typically resides on or outward from track 18.

- **Recovery Priority:** Do not continue normal use of the disk; attempt backup and validation immediately to avoid further writes that could overwrite recoverable tracks.

## Source Code

```text
100 REM 1541 BACKUP
110 POKE 56,33
120 CLR
130 FOR I=1 TO 144
140 READ D
150 POKE 49151+I,D
160 NEXT I
170 DIM T(35)
180 FOR I=1 TO 35
190 T(I)=1
200 NEXT I
210 READ SRW,ERW
220 PRINT "{CLR} 1541 BACKUP"
230 PRINT "{DOWN} INSERT MASTER IN DRIVE"
240 GOSUB 1110
250 OPEN 15,8,15
260 RW=8448
270 FOR I=1 TO 126
280 POKE 8447+I,0
290 NEXT I
300 RAM=8704
310 POKE 252,34
320 C=0
330 REM SEEK
340 FOR T=SRW TO ERW
350 NS=20+2*(T>17)+(T>24)+(T>30)
360 IF T(T)=0 GOTO 410
370 JOB=176
380 GOSUB 1190
390 IF E=1 GOTO 470
400 T(T)=0
410 RW=RW+(NS+1)
420 RAM=RAM+(256*(NS+1))
```

*Note: The above program listing is an excerpt from the "1541 BACKUP" program, which is designed to copy intact tracks from a diskette. For the complete listing and detailed instructions, refer to the "Inside Commodore DOS" manual.*

```text
10 REM VALIDATE A DISKETTE
20 OPEN 15,8,15
30 PRINT#15,"V0"
40 CLOSE 15
50 PRINT "DISK VALIDATED"
```

*Note: The above program listing is a simple implementation of the "VALIDATE A DISKETTE" procedure, which sends the "V0" command to the disk drive to validate the diskette.*

## References

- "Inside Commodore DOS" — provides detailed information on disk operations and recovery procedures.

- "Commodore 1541 User's Guide" — offers guidance on disk drive operations and maintenance.