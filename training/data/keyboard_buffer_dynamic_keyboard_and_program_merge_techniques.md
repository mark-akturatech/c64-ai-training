# Keyboard buffer (KEYD) — $277-$280 (631-640) FIFO, dynamic keyboard injection

**Summary:** Describes the C64 keyboard buffer (KEYD at $0277-$0280 / 631–640), FIFO behavior, interaction with GET/INPUT, the count byte at $00C6 (198) used to clear or set the buffer, the buffer size limit controlled by XMAX at $0289 ($289 / 649), and the dynamic keyboard technique (POKEing PETSCII into the buffer to simulate typing).

## Behavior and usage
The keyboard buffer (KEYD) at $0277-$0280 holds ASCII/PETSCII codes deposited by the keyboard-scanning interrupt. It behaves as a FIFO queue: characters are removed in the order entered. The OS/ BASIC will fetch and print waiting characters one by one.

- Capacity: Up to 10 characters by default — the maximum is determined by XMAX at $0289 ($289 decimal). Characters typed when the buffer is full are ignored.
- Deposit: The interrupt routine deposits one character per keypress; programs can also deposit characters by POKEing PETSCII codes into the queue.
- Count byte: Location 198 ($00C6) holds the current number of characters waiting in the buffer. POKE 198,0 clears the buffer (sets waiting count to zero).
- GET/INPUT interaction: GET and INPUT read characters from this buffer. If characters are already present when GET/INPUT runs, those characters are returned as if typed by the user. To avoid accidental consumption of queued characters, clear the buffer first (POKE 198,0).
- Related flag: PEEK(197) ($00C5) is sometimes polled by programs to detect keyboard status (used in the merge example).

Dynamic keyboard injection technique (program-driven typing):
- Write PETSCII codes (cursor moves, characters, carriage returns) into KEYD entries and set location 198 to the number of queued characters.
- The program can then cause BASIC to read and execute those queued characters (for example by clearing the screen and executing END so the buffer's carriage returns are processed as immediate-mode entries).
- Uses include: adding/modifying/deleting program lines at runtime, auto-entering numbered DATA lines, merging ASCII program files from tape/disk/modem into the current program, and automating multi-line input.

Caveats:
- The buffer size limit (XMAX) restricts injection size; ensure injections are within the current XMAX limit.
- Because this technique simulates real typing, timing and cursor positioning (PETSCII cursor codes) matter for correct placement.
- Save programs before running merge/injection routines that erase or overwrite program lines.

## Source Code
```basic
10 REM THIS LINE WILL BE DELETED
20 REM A NEW LINE 30 WILL BE CREATED
40 PRINT CHR$(147):PRINT:PRINT
50 PRINT "80 LIST":PRINT"30 REM THIS LINE WASN'T HERE BEFORE"
60 PRINT "10":PRINT "GOTO 80"CHR$(19)
70 FOR I=631 TO 634:POKE I,13:NEXT:POKE 198,4:END
80 REM THIS LINE WILL BE REPLACED
```

Commands to create ASCII program files from a LIST (to tape or disk):
```basic
' To tape:
OPEN 1,1,1,"ASCII":CMD 1:LIST
' After listing ends:
PRINT #1:CLOSE 1

' To disk:
OPEN 8,8,8,"ASCII,S,W":CMD 8:LIST
' After listing ends:
PRINT #8:CLOSE 8
```

Full example merge program (reads ASCII file from device and injects lines into the keyboard buffer):
```basic
60000 OPEN 1,8,8,"ASCII"
60010 POKE 152,1:B=0:GOSUB 60170
60020 GET #1,A$:IF A$=""THEN60020
60030 IF ST AND 64 THEN 60120
60040 IF A$=CHR$(13)AND B=0THEN60020
60050 PRINT A$;:B=1:IF A$=CHR$(34)THEN POKE 212,0
60060 IF A$<>CHR$(13) THEN 60020
60070 PRINT CHR$(5);"GOTO 60010";CHR$(5):PRINT:PRINT:POKE 198,0
60080 PRINT "RETURN=KEEP LINE    S=SKIP LINE":B=0
60090 GET A$:IF A$=""THEN 60090
60100 IF A$="S" THEN 60010
60110 GOTO 60180
60120 PRINT "END OF FILE--HIT RETURN TO FINISH MERGE"
60130 IF PEEK(197)<>1THEN60130
60140 A=60000
60150 GOSUB 60170:FOR I=A TO A+60 STEP10:PRINTI:NEXT
60160 PRINT "A="I":GOTO 60150":GOTO 60180
60170 PRINT CHR$(147):PRINT:PRINT:RETURN
60180 FOR I=631TO640:POKEI,13:NEXT:POKE198,10:PRINTCHR$(19);:END
```

Notes in-source: If you want to merge additional files at EOF, press STOP instead of RETURN, change the filename in line 60000, and RUN 60000. Save this merge program before running because it will erase itself when finished.

## Key Registers
- $0277-$0280 (631-640) - KEYD - Keyboard buffer (FIFO) entries holding PETSCII/ASCII bytes
- $00C6 (198) - Keyboard count - number of characters currently in the keyboard buffer (POKE 198,0 clears)
- $0289 (649 / $289) - XMAX - maximum keyboard buffer capacity (default 10)
- $00C5 (197) - Keyboard/status flag (polled in merge example with PEEK(197))

## References
- "i_o_tables_lat_fat_sat_and_clall" — expands on device open/command parameters used when creating ASCII files
- "memory_pointers_memstr_memsiz_color_and_screen_base_hibase" — covers OS memory pointers and screen/HIBASE values that affect display and buffer locations

## Labels
- KEYD
- XMAX
