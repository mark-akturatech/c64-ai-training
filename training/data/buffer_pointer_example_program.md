# Buffer-pointer example (BASIC) — read disk name from BAM (track 18, sector 0)

**Summary:** BASIC program for Commodore disk drive device 8 demonstrating OPEN 15/command channel, PRINT#15 B-P (buffer-pointer) use, GET# from data channel (2) to read bytes 144–159 of track 18 sector 0 (BAM disk name). Shows byte-normalization: NUL handling, high-bit stripping, printable-range forcing, and building DN$.

**Description**
This short program opens the drive command channel (OPEN 15,8,15), requests the drive to read track 18 sector 0 into buffer 2, sets the buffer pointer to byte offset 144 (the disk-name field in the BAM sector), and performs 16 GET#2 reads to retrieve bytes 144–159 into a string DN$. Each byte is normalized:
- If input is empty, treat as CHR$(0).
- If high bit set (value >127), subtract 128.
- Force to printable range 32–95; out-of-range values become 63 ("?").
- Double-quote (34) is converted to 63 to avoid quoting issues.

After assembling DN$, the program prints "DISK NAME:" and the extracted DN$.

This demonstrates reading only selected bytes from a buffer (buffer-pointer technique, "B-P"), avoiding a full-sector parse.

**Operation details**
- Device 8 command channel (channel 15) is used for issuing DOS commands and receiving status bytes (EN$, EM$, ET$, ES$).
- Data channel 2 is opened to read the buffer contents after the sector is fetched into a disk buffer (buffer number 2).
- The command PRINT#15,"U1;2;0;18;0" tells the drive to read track 18, sector 0 into buffer 2. The program checks the returned error code EN$ and aborts/cleans up if not "00".
- PRINT#15,"B-P";2;144 sets the current read pointer for channel 2 to byte offset 144; subsequent GET#2 reads return consecutive bytes starting from that offset.
- Loop runs 16 times to read the standard 16-byte disk-name field in the BAM sector.

## Source Code
```basic
100 REM BUFFER-POINTER
110 OPEN 15,8,15
120 PRINT#15,"I0"
130 INPUT#15,EN$,EM$,ET$,ES$
140 IF EN$<>"00" GOTO 320
150 OPEN 2,8,2,"#"
160 PRINT#15,"U1;2;0;18;0"
170 INPUT#15,EN$,EM$,ET$,ES$
180 IF EN$<>"00" GOTO 300
190 PRINT#15,"B-P";2;144
200 FOR I=1 TO 16
210 GET#2,B$
220 IF B$="" THEN B$=CHR$(0)
230 A=ASC(B$)
240 IF A>127 THEN A=A-128
250 IF A<32 OR A>95 THEN A=63
260 IF A=34 THEN A=63
270 DN$=DN$+CHR$(A)
280 NEXT I
290 PRINT "   DISK NAME: "; DN$
300 CLOSE 2
310 INPUT#15,EN$,EM$,ET$,ES$
320 CLOSE 15
330 END
```

## References
- "buffer_pointer_b-p_syntax" — expands on B-P syntax used in the program