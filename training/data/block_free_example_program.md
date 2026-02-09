# BLOCK-FREE (BASIC) — deallocate every sector on a diskette

**Summary:** Sample Commodore 64 BASIC program using OPEN 15,8,15, PRINT#15 "10", INPUT#15, and a direct-access channel (OPEN 2,8,2,"#") to issue DOS "B-F" (block-free) commands for every sector on a 35-track 1541-formatted disk (skips track 18 directory). Computes per-track sector counts with a compact boolean-expression formula and prints progress.

**Description**
This BASIC listing opens the DOS command channel (device 8) and queries the DOS version with the "10" command. If the disk controller responds with EN*="00" (no error), the program opens a direct-access channel (logical #2) and loops tracks T=1..35, skipping T=18 (the directory track). For each track, it computes NS, the highest sector number for that track, using a boolean-expression that yields the correct sector counts for a Commodore 1541 drive:
- Tracks 1–17 → 21 sectors (NS = 20)
- Tracks 18–24 → 19 sectors (NS = 18)
- Tracks 25–30 → 18 sectors (NS = 17)
- Tracks 31–35 → 17 sectors (NS = 16)

For every sector S=0..NS, the program sends the DOS "B-F" command on the command channel to deallocate the block, increments BF (block-free counter), and prints progress T,S,BF. After finishing the loops, it closes the direct channel and the command channel.

Behavioral notes:
- Uses PRINT#15 and INPUT#15 for command/response to device 8.
- The directory track (18) is explicitly skipped.
- The boolean-expression in the NS calculation assumes Commodore BASIC relational results (true → -1) and is written to produce the correct numeric NS values on a 1541.

## Source Code
```basic
100 REM  BLOCK-FREE

110 OPEN 15,8,15
120 PRINT#15,"10"
130 INPUT#15,EN*,EM*,ET*,ES*
140 IF EN*<>"00" GOTO 260

150 OPEN 2,8,2,"#"

160 FOR T=1 TO 35
170 IF T=18 GOTO 240
180 NS = 20 + 2*(T>17) + (T>24) + (T>30)
190 FOR S=0 TO NS
200 PRINT#15,"B-F";0;T;S
210 BF = BF + 1
220 PRINT T,S,BF
230 NEXT S
240 NEXT T

250 CLOSE 2

260 INPUT#15,EN*,EM*,ET*,ES*
270 CLOSE 15
280 END

REM Line range annotation:
REM 150  Open a direct-access channel.
REM 160  Begin loop for tracks 1 to 35.
REM 170  Don't deallocate the directory (track 18).
```

## References
- "block_free_command_description" — expands on the B-F command to deallocate sectors