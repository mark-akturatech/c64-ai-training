# CLOSE — close a single logical file

**Summary:** CLOSE is the KERNAL ROM subroutine to close a logical file on the C64; call at $FFC3 (65475) with the file number in A. Error status is returned via READST (possible values 0 or 240). Registers A, X, Y are affected.

## Description
Purpose: Close a logical file previously opened with OPEN.  
Call address: $FFC3 (hex) / 65475 (decimal).  
Communication register: A — contains the logical file number to close.  
Preparatory routines: None.  
Error returns: 0, 240 (see READST for status semantics).  
Stack requirements: 2+ bytes (JSR pushes return address).  
Registers affected: A, X, Y.

Behavior: When called, the routine closes the logical file identified by the file number in A and updates the system I/O state. Use the same logical file number used when the file was opened.

How to use:
1. Load A with the logical file number to be closed.
2. JSR $FFC3 (or JSR CLOSE if your assembler provides the KERNAL label).

Example:
- LDA #15
- JSR CLOSE

## Source Code
```asm
; CLOSE — close logical file
; Call: A = logical file number
; Return: status via READST (e.g. 0, 240). A, X, Y may be altered.

    ; Example: close logical file 15
    LDA #15
    JSR $FFC3        ; CLOSE
```

## References
- "clall_close_all_files" — covers CLALL, which closes all files at once
- "clrchn_clear_io_channels" — covers CLRCHN, which restores default I/O channels after closing files

## Labels
- CLOSE
