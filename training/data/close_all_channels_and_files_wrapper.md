# KERNAL wrapper at $FFE7 — JMP ($032C) to close all channels/files

**Summary:** Wrapper at ROM address $FFE7 contains a JMP ($032C) indirect to the CLRCHNALL KERNAL vector ($032C), which invokes the close-all-files / reset I/O channels routine that resets open-file table pointers and I/O channel state.

## Description
$FFE7 is a KERNAL ROM entry containing a single JMP indirect instruction that reads a two-byte pointer from $032C (little-endian) and transfers control to the routine pointed to. The target routine (CLRCHNALL vector) performs cleanup of open file structures: it resets the pointers into the open-file table and resets I/O channels, effectively closing all files and returning the I/O subsystem to its default state. The $032C word is part of the KERNAL vector table and can be patched to redirect CLRCHNALL to a custom handler if needed.

## Source Code
```asm
.,FFE7 6C 2C 03 JMP ($032C)     ; do close all channels and files
```

## Key Registers
- $FFE7 - KERNAL ROM - JMP indirect wrapper to CLRCHNALL vector (JMP ($032C))
- $032C - KERNAL vector table - CLRCHNALL two-byte pointer (address read little-endian)

## References
- "kernal_vectors_list" — expansion and listing of KERNAL vectors, including CLRCHNALL at $032C