# Block-read (U1) BASIC example — read BAM (track 18, sector 0)

**Summary:** Example Commodore BASIC program demonstrating a 1541 block-read (U1) via the command channel and reading the returned 256-byte buffer with GET# from a direct-access channel; illustrates GET# byte-by-byte retrieval, null-string handling (convert "" to CHR$(0) before ASC()), and printing index, ASCII value, and printable character for track 18 sector 0 (BAM).

**Description**
This program:
- Opens the command channel (device 8) on logical file 15 and issues the initialize command ("I0") to the 1541.
- Opens a direct-access logical file (channel 2) so the drive assigns a buffer for block transfers.
- Sends the block-read (U1) command to read track 18, sector 0 (the BAM) into the drive buffer: `PRINT#15,"U1";2;0;18;0`.
- After a successful U1, the buffer pointer is left at position 255; bytes 0–255 are then accessible from the starting position (byte 0) via GET# from the direct-access channel.
- Uses GET# (not INPUT*) because the block may contain null bytes and control characters that INPUT* would misinterpret.
- Tests each GET# byte for the null string "" and converts it to CHR$(0) before calling ASC() — otherwise ASC("") causes an ILLEGAL QUANTITY ERROR.
- Prints the byte index (I), the ASCII numeric value (A), and the character if its ASCII value is in the printable range (32–95).

This listing is a cleaned and OCR-corrected transcription of the source example; obvious OCR artifacts have been corrected (e.g., EN* → EN$, B* → B$, PRINT#15,"10" → PRINT#15,"I0").

## Source Code
```basic
100 REM BLOCK-READ (U1)
110 OPEN 15,8,15
120 PRINT#15,"I0"
130 INPUT#15,EN$,EM$,ET$,ES$
140 IF EN$<>"00" GOTO 290
150 OPEN 2,8,2
160 PRINT#15,"U1";2;0;18;0
170 INPUT#15,EN$,EM$,ET$,ES$
180 IF EN$<>"00" GOTO 270
190 FOR I=0 TO 255
200 GET#2,B$
210 IF B$="" THEN B$=CHR$(0)
220 A=ASC(B$)
230 PRINT I, A,
240 IF A>31 AND A<96 THEN PRINT B$,
250 PRINT
260 NEXT I
270 CLOSE 2
280 INPUT#15,EN$,EM$,ET$,ES$
290 CLOSE 15
300 END
```

## References
- "block_read_u1_syntax" — expands on U1 syntax used in the example
- "block_read_program_explanation" — line-by-line explanation of the sample program