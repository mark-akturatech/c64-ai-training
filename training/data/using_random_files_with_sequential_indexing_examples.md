# Tracking Disk Blocks for Random Files — Sequential‑index Strategy

**Summary:** Use a companion sequential file (index) to record track/block locations for random-access blocks; techniques reference CBM DOS command strings (B-A:, B-W:, B-R:, B-F:), channel usage (OPEN 15 command channel, data channels like 5 and 4), and the need for two disk buffers.

**Problem**
Random files store data in disk blocks, but the BAM does not distinguish which used blocks belong to your random file. Without external bookkeeping, you cannot tell whether a block contains your random file, other data, or parts of sequential/relative files.

**Technique: Companion Sequential Index**
- Keep a sequential file that contains the list of record numbers and their track/block locations (track, block tuples).
- Open three channels for each random file:
  - Channel 15 — command channel to send CBM DOS block commands (allocate, read, write, free).
  - One channel for the random-access block reads/writes (example uses channel 5).
  - One channel for the sequential index file (example uses channel 4).
- Two disk buffers are in use simultaneously (one for the random block, one for the sequential file buffer).
- Use CBM DOS block commands written to channel 15 to:
  - B-A: query/find the next available track & block (allocate).
  - B-W: write a 256-byte block to a specified track/block.
  - B-R: read a 256-byte block from a specified track/block.
  - B-F: free a track/block when the block is no longer needed.
- Store the allocated track/block values (T, B) in the sequential index so you can later read or free the blocks in order.

## Source Code
```basic
10 OPEN 15,8,15
20 OPEN 5,8,5,"#"
30 OPEN 4,8,4,"@0:KEYS,S,W"
40 A$="RECORD CONTENTS #"
50 FOR R=1 TO 10
70 PRINT#5,A$","R
90 T=1:B=1
100 PRINT#15,"B-A:"0;T;B
110 INPUT#15,A,B$,C,D
120 IF A=65 THEN T=C:B=D:GOTO 100
130 PRINT#15,"B-W:"5;0;T;B
140 PRINT#4,T","B
150 NEXT R
160 CLOSE 4:CLOSE 5:CLOSE 15
```

(Write program notes: channel 15 accepts DOS block commands; channel 5 is the random-data channel; channel 4 is the sequential index file opened for write)

```basic
10 OPEN 15,8,15
20 OPEN 5,8,5,"#"
30 OPEN 4,8,4,"KEYS,S,R"
40 FOR R=1 TO 10
50 INPUT#4,T,B
60 PRINT#15,"B-R:"5;0;T;B
80 INPUT#5,A$,X
90 IF A$<>"RECORD CONTENTS #" OR X<>R THEN STOP
100 PRINT A$;R
110 PRINT#15,"B-F:"0;T;B
120 NEXT R
130 CLOSE 4:CLOSE 5
140 PRINT#15,"S0:KEYS"
150 CLOSE 15
```

(Read program notes: reads T, B from the sequential index file, uses B-R to fetch the block, checks contents, then B-F to free the block; S0:KEYS issued on the command channel as shown in the example)

**CBM DOS Return Codes and Response Fields**
When interacting with the disk drive via the command channel (device 15), the drive returns status messages that can be read using the `INPUT#` statement. These messages typically consist of four fields:

1. **Error Code (A):** A numeric code indicating the result of the last operation.
2. **Error Message (B$):** A brief description corresponding to the error code.
3. **Track (C):** The track number associated with the error or operation.
4. **Sector (D):** The sector number associated with the error or operation.

In the provided example, after issuing the `B-A:` command to allocate a block, the program reads the status message:


The program then checks if `A=65`. According to the Commodore 1541 User's Guide, error code 65 corresponds to "NO BLOCK," indicating that the requested block is already allocated. The drive responds with the next available track and sector in `C` and `D`. If no blocks are available, `C` and `D` will be zero.

For a comprehensive list of error codes and their meanings, refer to the Commodore 1541 User's Guide, Appendix B.

**"S0:KEYS" Command Semantics**
The `S0:KEYS` command is used to scratch (delete) the file named "KEYS" from the disk. In the context of the example, after processing the random-access data and closing the associated files, the program issues:


This command instructs the disk drive to delete the file "KEYS" from the disk. The `S` command is the scratch command, and `0:` specifies the drive number (drive 0). "KEYS" is the name of the file to be deleted.

For more details on disk commands, refer to the Commodore 1541 User's Guide.

## Source Code

```basic
110 INPUT#15,A,B$,C,D
```

```basic
140 PRINT#15,"S0:KEYS"
```


## References
- "buffer_pointer_and_record_subdivision_examples" — expands on using BUFFER-POINTER to create records inside blocks and access them
- Commodore 1541 User's Guide, Appendix B — Summary of CBM Floppy Error Messages