# BLOCK-READ (PRINT# file, "B-R:")

**Summary:** BLOCK-READ (abbrev. "B-R:") is a Commodore disk command sent via PRINT# to move one 256-byte disk block into a previously opened data channel so that INPUT# or GET# can read it; syntax uses channel; drive; track; block and is shown in BASIC examples.

## BLOCK-READ command
Format (full and abbreviated):
PRINT#file#,"BLOCK-READ:" channel; drive; track; block
or
PRINT#file#,"B-R:" channel; drive; track; block

Behavior:
- Transfers one 256-byte block from the specified drive/track/block into the selected data channel (the random-access buffer for that channel).
- After a successful BLOCK-READ, the program can read bytes from the buffer using INPUT# or GET# on the data channel.
- Common usage pattern: open channel 15 to the device for command I/O, open a separate channel (e.g., 5) for data transfer, send the B-R: command to channel 15 targeting the data channel number.
- The sample program reads block 2 from track 18 into string B$ by repeatedly GET#-ing bytes from the data channel and concatenating them when ST indicates success.

## Source Code
```basic
	  +---------+ +-------+  +-------+
	  | CHANNEL | | DRIVE |  | TRACK |
	  +---------+ +-------+  +-------+
		    | |          |
		    | |  +-------+
 10 OPEN 15,8,15    | |  |           +-------+
 20 OPEN 5,8,5,"#"  | |  |           | BLOCK |
 30 PRINT#15,"B-R:" 5;0;18;2 <-------+-------+
 40 B$=""
 50 FOR L=0 TO 255                  +----------------+
 60 GET#5,A$                        | COLLECT ENTIRE |
 70 IF ST = 0 THEN B$=B$+A$:NEXT L  | BLOCK: BYTE    |
 80 PRINT "FINISHED"     |          | BY BYTE        |
 90 CLOSE 5:CLOSE 15     +----------+----------------+
```

## References
- "get_statement_and_file_examination_example" — expands on using GET# to extract bytes from the random-access buffer after BLOCK-READ