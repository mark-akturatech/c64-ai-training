# Read/Set Top of Memory Wrapper (JMP $FF99 -> $FE25)

**Summary:** ROM wrapper at $FF99 (bytes 4C 25 FE) that JMPs to $FE25; the routine at $FE25 reads or sets the top-of-RAM pointer using the carry flag and the X/Y registers (carry=1 read into X/Y; carry=0 store X/Y as new top).

## Description
This entry at $FF99 is a single-instruction ROM wrapper that forwards execution to the real implementation at $FE25. The behavior implemented at $FE25 (not shown here) uses the processor carry flag to choose between two operations:

- Carry = 1: load the pointer to the top of RAM into X and Y (pointer returned in X/Y).
- Carry = 0: save X/Y as the new top-of-memory pointer (change top of RAM).

The wrapper itself does no processing — it simply transfers control to $FE25. Callers use this vector to access the read/set top-of-memory functionality; the implementation and calling conventions (beyond the carry/X/Y convention) are at $FE25.

## Source Code
```asm
; *** read/set the top of memory
; this routine is used to read and set the top of RAM. When this routine is called
; with the carry bit set the pointer to the top of RAM will be loaded into XY. When
; this routine is called with the carry bit clear XY will be saved as the top of
; memory pointer changing the top of memory.
.,FF99 4C 25 FE JMP $FE25       read/set the top of memory
```

## References
- "read_set_top_of_memory" — expands on the implementation at $FE25 (handles carry/X/Y behavior)

## Labels
- READ_SET_TOP_OF_MEMORY
