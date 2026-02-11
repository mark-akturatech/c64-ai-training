# ROM: JMP wrapper at $FFB7 → $FE07 (read I/O status word)

**Summary:** Wrapper routine at $FFB7 (JMP $FE07) used to read the device I/O status word; returns the I/O device status in the accumulator. Searchable terms: $FFB7, $FE07, JMP, I/O status, RS232, read_io_status_word.

## Description
This ROM entry is a simple wrapper that transfers execution to the actual I/O status read routine at $FE07. The callee at $FE07 reads and returns the current status of the I/O device in the accumulator (A). Call this wrapper immediately after serial/parallel communication to obtain device status, including errors or timeouts.

- Purpose: provide a fixed entry point ($FFB7) to the I/O status routine.
- Behavior: immediate JMP — no stack change, no flags altered by this instruction itself.
- Typical use: invoked by higher-level I/O routines after completing communication to check device status.

## Source Code
```asm
.,FFB7 4C 07 FE    JMP $FE07       ; read I/O status word (returns status in A)
```

## References
- "read_io_status_word" — expands on implementation; reads RS232 status for device 2
