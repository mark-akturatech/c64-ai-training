# BASIC example: Memory-Read (M-R) from buffer #0 ($0300-$03FF), block-read Track 18 Sector 0

**Summary:** Demonstrates OPEN 15,8,15 command channel usage, issuing a UI block-read into buffer #0 ($0300–$03FF), then reading bytes from buffer #0 with the M-R (memory-read) command sent as binary parameters (CHR$), retrieving returned bytes with GET#, handling null (CHR$(0)), converting with ASC, and printing characters and numeric values.

**Description**
This program selects buffer #0 (memory $0300–$03FF) as a workspace, requests a block-read of track 18 sector 0 into that buffer via the disk command interface, then reads each byte of the 256-byte buffer back to the C64 one at a time.

Steps performed:
- Open the drive command channel (channel 15) and query the drive with the initialization/status command to ensure the drive is ready.
- Open a secondary channel (channel 2) to buffer #0 on the drive to receive the block.
- Issue the UI (block-read) command to the drive to transfer Track 18, Sector 0 into buffer #0 on the drive.
- Verify success from the drive’s response bytes.
- Loop I = 0 to 255:
  - Send the M-R (memory-read) command with CHR$(low) and CHR$(high) parameters (low = I, high = 3) to request the single byte at address $03xx where xx = I.
  - Use GET# to read the returned byte into B$.
  - Replace an empty return with CHR$(0) to preserve null-byte values.
  - Use ASC(B$) to get the numeric value and print the index, numeric value, and (if printable) the character.
- Close the buffer channel and the command channel.

Notes on parameters:
- The M-R command is sent as the ASCII string "M-R" followed immediately by binary parameters created with CHR$ to represent address low/high (and additional parameters if a different protocol is used). In this example the high byte is CHR$(3) to access addresses $0300–$03FF; the low byte is the loop index I.
- GET# returns a 1-character string for a single returned byte; ASC() converts that to an integer 0–255. The GET# reading must handle the case where the returned character is the NUL (CHR$(0)), which some BASIC implementations may present as an empty string.

## Source Code
```basic
100 REM TWD PARAMETER MEMORY-READ
110 OPEN 15,8,15
120 PRINT#15,"I0"
130 INPUT#15,EN$,EM$,ET$,ES$
140 IF EN$<>"00" GOTO 300
150 OPEN 2,8,2,"#0"
160 PRINT#15,"UI";2;0;18;0
170 INPUT#15,EN$,EM$,ET$,ES$
180 IF EN$<>"00" GOTO 280
190 FOR I=0 TO 255
200 PRINT#15,"M-R";CHR$(I);CHR$(3)
210 GET#15,B$
220 IF B$="" THEN B$=CHR$(0)
230 A=ASC(B$)
240 PRINT I, A,
250 IF A>31 AND A<96 THEN PRINT B$,
260 PRINT
270 NEXT I
280 CLOSE 2
290 INPUT#15,EN$,EM$,ET$,ES$
300 CLOSE 15
310 END
```

## References
- "memory_read_overview_and_syntax" — expands on M-R command syntax used in this example
- "buffer_sharing_and_get_usage" — expands on GET# retrieval details and buffer usage illustrated by this program
