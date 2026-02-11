# CLALL — Close all open files

**Summary:** KERNAL routine CLALL at $FFE7 (65511) closes all open files and resets I/O channels (automatically calls CLRCHN). Call with JSR CLALL (or JSR $FFE7); modifies A and X, stack requirement 11.

## Description
Purpose: Close all open files and restore default I/O channels.

Call address: $FFE7 (hex) / 65511 (decimal)

Behavior:
- Resets the pointers into the KERNAL open-file table, thereby closing all logical files (open file table: KERNAL internal table).
- Automatically calls CLRCHN (KERNAL routine to clear I/O channels) to restore default I/O channels.
- No error returns; the routine always completes without setting an error code.

Communication registers: None

Preparatory routines: None

Stack requirements: 11 (bytes pushed/preserved by the routine)

Registers affected: A, X

How to use:
- Simply JSR to the routine to close all files and reset channels, then continue execution (example below).

## Source Code
```asm
; Example: close all files and resume BASIC execution
    JSR CLALL      ; Close all files and select default I/O channels
    JMP RUN        ; Resume BASIC program execution

; Absolute form (same effect)
    JSR $FFE7      ; CLALL entry point (65511)
```

## Key Registers
- $FFE7 - KERNAL ROM - CLALL (Close all files) entry point

## References
- "clrchn_clear_io_channels" — CLRCHN: clears I/O channels and is called automatically by CLALL
- "close_close_a_logical_file" — CLOSE: closes a single logical file (CLALL is the bulk counterpart)

## Labels
- CLALL
