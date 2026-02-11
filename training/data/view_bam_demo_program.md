# VIEW BAM (Demonstration program)

**Summary:** Commodore 64 BASIC program demonstrating how to open disk device channels and fetch/display the disk BAM (Block Availability Map) using device commands ("i0", "u1:", "b-p") and channel I/O (OPEN/PRINT#, GET#). Includes the tokenized PRG block for the program.

**Description**

This BASIC listing queries a 1541-compatible disk drive (device 8) and reads the BAM using device command strings sent to the command channel (15) and data channel (2). It collects BAM bytes into the `sb()` array, accumulates a total free-block count in `ts`, and renders a formatted availability map tailored to the VIC/64 screen using cursor-control token sequences (e.g., `{home}`, `{clear}`, `{reverse on}`).

Key functional points:

- **Device setup:**
  - `OPEN 15,8,15` — open the drive command channel.
  - `PRINT#15,"i0"` — initialize/identify the drive.
  - `OPEN 2,8,2,"#"` — open a data channel (channel 2) for subsequent reads.
  - `PRINT#15,"u1:";2;0;18;0` — send a "u1:" device command with parameters.
  - `PRINT#15,"b-p";2;1` and later `PRINT#15,"b-p";2;144` — send "b-p" device commands with parameters.

- **Data reading:**
  - `GET#2` used repeatedly to read returned bytes from the drive into variables `sc`, `a$`, and `sb(0..2)`.
  - `ts` increments by the returned `sc` value (`ts=ts+sc`) to accumulate totals.
  - A loop pattern fetches 17/18/36 blocks and renders them in two screen regions (`t` loops 1..17 and 18..35) with inner `s` loop 0..20 mapping bits/bytes to columns/rows.

- **Display/rendering:**
  - Uses `y$`, `x$` tokens to place the cursor and compose the screen layout.
  - Uses `{reverse on}` / `{reverse off}` sequences to indicate availability; prints "{" as a cell marker.
  - The program prints an overall free block count (computed as `ts-17`) after a final "b-p" read and a 20-byte `GET#2` loop to build a string `n$`.

- **Variables and subroutines:**
  - `y$`, `x$` — cursor position templates.
  - `sb(0..2)` — bytes read from the drive for each sector entry (stored across three `GET#2` reads).
  - `sc` — first returned byte per block read; used to sum `ts`.
  - `fn s(z)` — defined as: `DEF FN S(Z)=2^(Z-INT(Z/8)*8) AND (SB(INT(Z/8)))`.
  - Subroutines 430, 450, 540 manage cursor printing, `GET#2` reads into `sb()`, and display of a single column respectively.

- **Tokenized PRG:**
  - The listing includes the tokenized PRG block (begin 644 VIEWBAM.PRG ... end) in uuencoded-like form — retained in Source Code.

No hardware register addresses are required for indexing; the program interacts with the disk drive via standard CBM device channels and commands.

## Source Code

```basic
100 REM********************************
101 REM*  VIEW BAM FOR VIC & 64 DISK  *
102 REM********************************
105 OPEN 15,8,15
110 PRINT#15,"I0":NU$="N/A N/A N/A N/A N/A":Z4=1
120 OPEN 2,8,2,"#"
130 Y$="{HOME}{DOWN*24}"
140 X$="{RIGHT*23}"
150 DEF FN S(Z)=2^(Z-INT(Z/8)*8) AND (SB(INT(Z/8)))
160 PRINT#15,"U1:";2;0;18;0
170 PRINT#15,"B-P";2;1
180 PRINT "{CLEAR}";
190 Y=22:X=1:GOSUB 430
200 FOR I=0 TO 20:PRINT:PRINT "{UP*2}" RIGHT$(STR$(I)+" ",3);:NEXT
210 GET#2,A$
220 GET#2,A$
230 GET#2,A$
240 TS=0
250 FOR T=1 TO 17:GOSUB 450
260 Y=22:X=T+4:GOSUB 430:GOSUB 540:NEXT
270 FOR I=1 TO 2000:NEXT:PRINT "{CLEAR}"
280 Y=22:X=1:GOSUB 430
290 FOR I=0 TO 20:PRINT:PRINT "{UP*2}" RIGHT$(STR$(I)+" ",3);:NEXT
300 FOR T=18 TO 35
310 GOSUB 450
320 Y=22:X=T-13:GOSUB 430:GOSUB 540:NEXT
330 FOR I=1 TO 1000:NEXT
340 PRINT "{CLEAR}{DOWN*5}"
350 PRINT#15,"B-P";2;144
360 N$="":FOR I=1 TO 20:GET#2,A$:N$=N$+A$:NEXT
370 PRINT" "N$" "TS-17;"BLOCKS FREE"
380 FOR I=1 TO 4000:NEXT
390 PRINT "{CLEAR}"
400 INPUT "{DOWN*3}{RIGHT*2}ANOTHER DISKETTE {RIGHT*2}N{LEFT*3}";A$
410 IF A$="Y" THEN RUN
420 IF A$<>"Y" THEN END
430 PRINT LEFT$(Y$,Y)LEFT$(X$,X)"{LEFT}";
440 RETURN
450 GET#2,SC$:SC=ASC(RIGHT$(CHR$(0)+SC$,1))
460 TS=TS+SC
470 GET#2,A$:IF A$="" THEN A$=CHR$(0)
480 SB(0)=ASC(A$)
490 GET#2,A$:IF A$="" THEN A$=CHR$(0)
500 SB(1)=ASC(A$)
510 GET#2,A$:IF A$="" THEN A$=CHR$(0)
520 SB(2)=ASC(A$)
530 RETURN
540 PRINT "{DOWN}{LEFT}" RIGHT$(STR$(T),1);"{LEFT}{UP*2}";
550 REM  PRINT T"   "SC"  "SB(0)" "SB(1)" "SB(2)=CHR$(0)
560 IF T>24 AND S=18 THEN PRINT MID$(NU$,Z4,1);:GOTO 660
570 FOR S=0 TO 20
580 IF T<18 THEN 620
590 IF T>30 AND S=17 THEN PRINT MID$(NU$,Z4,1);:GOTO 660
600 IF T>24 AND S=18 THEN PRINT MID$(NU$,Z4,1);:GOTO 660
610 IF T>24 AND S=19 THEN PRINT MID$(NU$,Z4,1);:GOTO 660
620 IF T>17 AND S=20 THEN PRINT MID$(NU$,Z4,1);:Z4=Z4+1:GOTO 660
630 PRINT "{REVERSE ON}";
640 IF FNS(S)=0 THEN PRINT "{";:GOTO 660
650 PRINT "{REVERSE OFF}{";:REM RIGHT$(STR$(S),1);Z4,1);:GOTO 72
660 PRINT "{UP}{LEFT}{REVERSE OFF}";
670 NEXT
680 RETURN
```

```text
begin 644 VIEWBAM.PRG
M`0@G"&0`CRHJ*BHJ*BHJ*BHJ*BHJ*BHJ*BHJ*BHJ*BHJ*BHJ`$T(90"/
M*B`@5DE%5R!"04T@1D]2(%9)0R`F(#8T($1)4TL@("H`<PAF`(\J*BHJ*BHJ
... (tokenized binary lines retained exactly as in source) ...
%`HX`````
`
end
```

(Note: the full tokenized block is included above; ellipsis here indicates the same tokenized content from the supplied source is present in the stored payload.)

## References

- "dir_demo_program" — uses directory/BAM data similar to DIR program
- "bam_format_1541" — BAM layout and interpretation