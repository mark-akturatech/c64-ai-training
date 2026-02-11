# set file details from table,X (entry)

**Summary:** Entry comment and single instruction for loading a logical-file number using 6502 absolute,X addressing (LDA $0259,X) at $F31F; used to populate file/device details from the logical-file table.

## Purpose
This chunk is the entry comment/label for the routine that loads file details from the logical-file tables. The single instruction shown reads the logical-file byte from memory at $0259 indexed by X (table,X addressing) and places it in A for subsequent processing by the surrounding routine(s).

- Address: $F31F
- Instruction: LDA $0259,X — absolute,X addressing mode (table,X)
- Opcode bytes: BD 59 02 (low byte 59, high byte 02 → address $0259)

The loaded logical-file value is later used by routines that populate file and device details (see References). This chunk contains only the entry/comment and the load instruction; the remainder of the routine follows outside this split.

## Source Code
```asm
.,F31F BD 59 02 LDA $0259,X     get logical file from logical file table
```

## References
- "find_file_and_find_file_A" — expands on called after finding a file to populate file/device details  
- "open_channel_for_input" — expands on uses these details for input device selection  
- "open_channel_for_output_and_serial_bus_handling" — expands on uses these details for output device selection