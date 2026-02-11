# Block-read (Ul) vs B-R behavior on disk rewritten by the B-W demo

**Summary:** Demonstrates how a disk rewritten by the B-W (block-write) demo can place the buffer-pointer value into byte 0 of a block, and how running the original block-read (Ul) program versus using B-R yields different results: Ul/U2 let you access the full block, whereas B-R/B-W will return EOI after only the number of bytes equal to the buffer-pointer value (e.g., 5). Searchable terms: Ul, B-R, B-W, buffer-pointer, byte 0, EOI, line 160, line 220.

**Procedure and result**

- Modify the original block-read program so its track argument in BASIC line 160 is changed from track 18 to track 1 (the text shows the line after change).
- Run the Ul variant (the original block-read). When run against the diskette rewritten by the B-W demo, byte 0 of the block contains the value 5 — this is the buffer-pointer value. The program previously set the buffer-pointer to position 6 (in line 220 not shown here); 256 bytes later it wrapped to 5 (buffer offsets are 0..255).
- Change the same line 160 to use the B-R command instead of Ul and run again. In this case the read stops early: only 5 bytes (the buffer-pointer value) are accessible from the block before an EOI (End Of Information) signal is returned.
- This demonstrates why the Ul/U2 routines are preferable to the B-R/B-W pair for this scenario: Ul/U2 read the full block regardless of buffer-pointer corruption in the block header, while B-R/B-W interpret the block header's byte 0 as the valid returned length and thus return EOI early.

## Source Code

```basic
REM Full BASIC listing of the block-read (Ul) program
10 OPEN 15,8,15
20 OPEN 5,8,5,"#"
30 INPUT "ENTER TRACK";T
40 INPUT "ENTER SECTOR";S
50 PRINT#15,"Ul";5;0;T;S
60 FOR I=0 TO 255
70 GET#5,A$
80 IF ST THEN PRINT : PRINT "END OF DATA": GOTO 100
90 PRINT A$;
100 NEXT I
110 CLOSE 5
120 CLOSE 15
```

```basic
REM Full BASIC listing of the block-write (B-W) demo program
10 OPEN 15,8,15
20 OPEN 5,8,5,"#"
30 INPUT "ENTER TRACK";T
40 INPUT "ENTER SECTOR";S
50 PRINT#15,"B-W";5;0;T;S
60 FOR I=0 TO 255
70 PRINT#5,CHR$(I);
80 NEXT I
90 CLOSE 5
100 CLOSE 15
```

```basic
REM Line 220 that sets the buffer-pointer to position 6
220 PRINT#15,"B-P";5;6
```

```basic
REM Corrected line 160 with proper syntax and arguments
160 PRINT#15,"Ul";5;0;1;0
REM To test the B-R behavior, change "Ul" to "B-R":
160 PRINT#15,"B-R";5;0;1;0
```
In the corrected line 160, the arguments are:
- "Ul" or "B-R": Command
- 5: Channel number
- 0: Drive number
- 1: Track number
- 0: Sector number

This syntax ensures the command is correctly interpreted by the disk drive.

## References

- "block_write_behavior_and_demo_program" — expands on the B-W program that causes byte 0 to contain the buffer-pointer value
- "block_read_demo_program" — expands on the block-read program you must re-run/modify to observe the effect