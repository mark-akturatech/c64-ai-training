# BLOCK-ALLOCATE command (PRINT#file#,"B-A:" drive; track; block)

**Summary:** Describes the DOS BLOCK-ALLOCATE command (PRINT#file#,"B-A:" drive;track;block) used with the C64 disk command channel (secondary 15) and how to detect and handle the NO BLOCK error (error 65) by reading the suggested next-free track/block from the error channel (INPUT#file#, A, B$, C, D). Includes a sample BASIC allocation loop and the later block-write (B-W:) step.

## Description
BLOCK-ALLOCATE is used to mark a specific disk block as used in the BAM so that random-access files and manual block writes do not overwrite free-block bookkeeping. The command is sent to the drive command channel with secondary address 15 using the PRINT# statement:

- Format: PRINT#file#,"BLOCK-ALLOCATE:" drive;track;block

If the requested block is not available, the drive DOS returns error number 65 (NO BLOCK) and supplies the next available track and block numbers on the error channel. To handle allocation failures reliably, your program must:

1. Send a BLOCK-ALLOCATE for the desired track/block.
2. Read the drive error channel (INPUT# on the command channel) to get the error number and suggested next-free track/block (A, B$, C, D).
3. If A = 65 (NO BLOCK), use the returned C and D as the next candidate track/block and retry the BLOCK-ALLOCATE.
4. When BLOCK-ALLOCATE succeeds (no error 65), proceed to perform the block write (B-W:) or other operation.

The error-channel INPUT format used in the example is INPUT#cmdch, A, B$, C, D where:
- A = error number (numeric)
- B$ = error string (text)
- C = suggested track (numeric)
- D = suggested block (numeric)

Note: The sample also shows using a separate data channel (non-15 secondary) for the actual block data transfer; the BLOCK-ALLOCATE and error reporting are handled via the command channel (secondary 15).

## Source Code
```basic
10 OPEN 15,8,15
20 OPEN 5,8,5,"#"
30 PRINT#5,"DATA"
40 T=1:B=1
50 PRINT#15,"B-A:"0;T;B
60 INPUT#15,A,B$,C,D
70 IF A=65 THEN T=C:B=D:GOTO 50
80 PRINT#15,"B-W:"5;0;1;1
90 CLOSE 5:CLOSE 15
```

## References
- "block_free_command" — expands on freeing blocks no longer needed
- "using_random_files_with_sequential_indexing_examples" — example programs showing allocation and use of sequential index files
