# BUFFER-POINTER (B-P:) — subdividing a 256‑byte block into records

**Summary:** Describes the PRINT# "BUFFER-POINTER:" / "B-P:" command (sent to device command channel, typically #15) to set the buffer pointer inside a 256‑byte disk block so blocks can be subdivided into records; includes example BASIC write/read programs that create four 64‑byte records per block.

**Description**
The buffer pointer records where the last byte was written and determines where the next read will start within the current 256‑byte block. By changing the buffer pointer you obtain random access to individual bytes in the block and can subdivide a block into multiple fixed‑length records.

Typical usage: subdivide each 256‑byte block into N equal records (example uses 4 records × 64 bytes). Set the buffer pointer to the start offset of the desired record within the block (offsets shown in examples: 1, 65, 129, 193). The buffer pointer is specified as a location value (counting from 1).

FORMAT:
- PRINT#file#, "BUFFER-POINTER:" channel; location
- Abbreviation: PRINT#file#, "B-P:" channel; location

Example (set pointer to the 64th character of the buffer):
- PRINT#15, "B-P:" 5; 64

(The examples below use channel 15 for device command I/O and channel 5 for the open data file.)

## Source Code
```basic
' SAMPLE PROGRAM WRITING 10 RANDOM-ACCESS BLOCKS WITH 4 RECORDS EACH
10 OPEN 15,8,15
20 OPEN 5,8,5,"#"
30 OPEN 4,8,4,"@0:KEYS,S,W"
40 A$="RECORD CONTENTS #"             
50 FOR R=1 TO 10                      
60 FOR L=1 TO 4                       
70 PRINT#15,"B-P:"5;(L-1)*64+1  
80 PRINT#5,A$","L
90 NEXT L
100 T=1:B=1                           
110 PRINT#15,"B-A:"0;T;B  
120 INPUT#15,A,B$,C,D  
130 IF A=65 THEN T=C:B=D:GOTO 110  
140 PRINT#15,"B-W:"5;0;T;B
150 PRINT#4,T","B
160 NEXT R
170 CLOSE 4:CLOSE 5:CLOSE 15
```

```basic
' SAMPLE PROGRAM READING BACK 10 RANDOM-ACCESS BLOCKS WITH 4 RECORDS EACH
10 OPEN 15,8,15
20 OPEN 5,8,5,"#"
30 OPEN 4,8,4,"KEYS,S,R"
40 FOR R=1 TO 10
50 INPUT#4,T,B
60 PRINT#15,"B-R:"5;0;T;B
70 FOR L=1 TO 4
80 PRINT#15,"B-P:"5;(L-1)*64+1
85 INPUT#5,A$,X
90 IF A$<>"RECORD CONTENTS #" OR X<>L THEN STOP
95 PRINT R;A$;L
100 NEXT L
110 PRINT#15,"B-F:"0;T;B
120 NEXT R
130 CLOSE 4:CLOSE 5
140 PRINT#15,"S0:KEYS"
150 CLOSE 15
```

```text
Command formats referenced in text:
PRINT#file#, "BUFFER-POINTER:" channel; location
PRINT#file#, "B-P:" channel; location
```

## Key Registers
- (none) — This topic is about DOS device command strings and file channels, not hardware registers.

## References
- "user1_user2_behaviour_and_usage" — expands on how USER1/USER2 commands interact with buffer pointers