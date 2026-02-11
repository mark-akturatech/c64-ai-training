# Fully Commented Commodore 64 ROM Disassembly — Wrapper at $FFBD

**Summary:** ROM wrapper at $FFBD that JMPs to the KERNAL set-filename routine at $FDF9; expects A = filename length, X/Y = pointer to filename (X = low byte). Used by OPEN, SAVE, LOAD.

## Description
This chunk documents the small KERNAL wrapper located at $FFBD which performs an unconditional jump to the full "set filename" implementation at $FDF9.

Behavior and calling convention (as documented in the ROM comments):
- Purpose: set up the file name for OPEN, SAVE, or LOAD KERNAL routines.
- Inputs:
  - A = length of the file name (0 means "no file name").
  - X/Y = 16-bit pointer to the filename string in memory, with X holding the low byte of the address.
- If A = 0, no filename is used; X/Y may contain any address in that case.
- The wrapper at $FFBD simply JMPs to the real routine at $FDF9 which performs the filename setup.

This wrapper provides a standard entry point for other KERNAL calls that need the filename preloaded.

## Source Code
```asm
.; ROM wrapper at $FFBD
.,FFBD  4C F9 FD    JMP $FDF9       ; set the filename
```

## Key Registers
- $FFBD - KERNAL ROM - JMP wrapper to $FDF9 (entry that forwards to set-filename)
- $FDF9 - KERNAL ROM - set_filename implementation (full routine)

## References
- "set_filename" — implementation and expanded comments at $FDF9