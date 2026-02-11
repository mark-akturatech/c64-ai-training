# USER1 (U1/UA) and USER2 (U2/UB) commands

**Summary:** USER1 (U1/UA) and USER2 (U2/UB) are disk commands related to BLOCK-READ and BLOCK-WRITE that change how the buffer-pointer is handled: U1 forces the buffer-pointer to 255 to read a full 256-byte block, and U2 writes the buffer back without changing the buffer-pointer stored on the disk. Searchable terms: BLOCK-READ, BLOCK-WRITE, BUFFER-POINTER, PRINT#, U1, U2, UA, UB, channel; drive; track; block.

## USER1 and USER2 — behavior

- USER1 is a variant of BLOCK-READ. BLOCK-READ normally stops when the buffer-pointer stored with the block indicates the block is finished; USER1 first forces the block's stored buffer-pointer to 255 so the entire 256 bytes of the block are read.
- USER2 is a variant of BLOCK-WRITE. BLOCK-WRITE writes the buffer contents and updates the buffer-pointer stored on the disk; USER2 writes the buffer contents but preserves the buffer-pointer value already stored on that disk block (i.e., it does not change the stored pointer).
- These USER commands are intended primarily for machine-language use (see referenced material for disk-resident routines and jump table entries).

## Formats

- USER1 may be issued as either "U1:" or "UA:" — both forms are equivalent.
- USER2 may be issued as either "U2:" or "UB:" — both forms are equivalent.
- Each uses the same parameter ordering as BLOCK-READ / BLOCK-WRITE: channel; drive; track; block.

(Concrete BASIC invocation examples are in the Source Code section.)

## Source Code
```basic
PRINT#file#, "U1:" channel; drive; track; block
PRINT#file#, "UA:" channel; drive; track; block

PRINT#file#, "U2:" channel; drive; track; block
PRINT#file#, "UB:" channel; drive; track; block
```

## References
- "memory_execute_and_user_command_table" — expands on other USER commands and jump table entries for disk-resident routines
- "Appendix C" — more complex sample program demonstrating USER commands