# BASIC: Block-Read (B-R) demonstration program (OPEN 15 / PRINT#15 / GET#2)

**Summary:** Demonstration BASIC program exercising CBM DOS block-read (B-R) via command channel OPEN 15, sending PRINT#15 "B-R" and checking status with INPUT#15, opening a data channel (OPEN 2,8,2,"#"), issuing B-P to reset the B-P pointer, then reading 256 bytes with GET#2 and printing index, ASC code, and printable characters (uses CHR$ and ASC).

## Description
This program exercises the CBM DOS B-R behavior and shows how to:
- Open the command/status channel (OPEN 15,8,15) and poll status with INPUT#15,EN$,EM$,ET$,ES$.
- Open a data channel to the drive buffer (OPEN 2,8,2,"#") and issue a B-R command via the command channel to request a block read.
- Check the drive's error code after the B-R request, then issue a "B-P" to reset the buffer pointer before reading.
- Read 256 bytes (0–255) from the data channel using GET#2 into B$, convert to numeric with ASC(B$) (with CHR$(0) substitution for empty), and print the byte index, numeric value, and the printable character when in ASCII range 32..95.
- Close channels and cleanly exit.

Notes:
- The program prints three columns: byte index (I), ASCII code (A), and the character (when printable). Non-printable bytes are represented as their numeric code only.
- The B-R command parameters are sent exactly as shown in the source (B-R;2;0;18;0). The meaning/semantics of those parameters are left as in the original example.

## Source Code
```basic
100 REM BLOCK-READ (B-R)
110 OPEN 15,8,15
120 PRINT#15,"10"
130 INPUT#15,EN$,EM$,ET$,ES$
140 IF EN$<>"00" GOTO 300
150 OPEN 2,8,2,"#"
160 PRINT#15,"B-R";2;0;18;0
170 INPUT#15,EN$,EM$,ET$,ES$
180 IF EN$<>"00" GOTO 280
190 PRINT#15,"B-P";2;0
200 FOR I=0 TO 255
210 GET#2,B$
220 IF B$="" THEN B$=CHR$(0)
230 A=ASC(B$)
240 PRINT I, A,
250 IF A>31 AND A<96 THEN PRINT B$;
260 PRINT
270 NEXT I
280 CLOSE 2
290 INPUT#15,EN$,EM$,ET$,ES$
300 CLOSE 15
310 END
```

## References
- "direct_access_entomology_intro_and_block_read_overview" — expands on B-R anomalies and overview
- "block_read_and_block_write_interaction_and_recommendation" — expands on B-R behavior after block-write (B-W) rewrites and recommendations
