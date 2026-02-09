# CINT — Initialize 6567 video chip and KERNAL screen editor

**Summary:** CINT ($FF81 / 65409) initializes the 6567 VIC-II video controller and the KERNAL screen editor for normal C64 operation (intended for cartridges). Call with JSR $FF81; affects registers A, X, Y and requires 4 bytes of stack space.

## Description
Purpose: set up the 6567 video controller (VIC-II) for normal operation and initialize the KERNAL screen editor. Intended to be called by a Commodore 64 program cartridge to prepare the display and console editing environment.

Call address: $FF81 (hex) / 65409 (dec)

Communication registers: None (no parameters expected)

Preparatory routines: None required

Error returns: None

Stack requirements: 4 (routine uses 4 bytes of stack)

Registers affected: A, X, Y

Usage: Call the routine with JSR CINT (or JSR $FF81). Typical flow shown in source example — after CINT returns, the cartridge may jump to its RUN entry point.

Notes:
- This routine is part of the KERNAL ROM and intended to initialize video and screen-editor state for cartridges.
- No explicit return values or error codes are provided.
- After initialization, use IOBASE (if applicable) to locate VIC/SID/CIA I/O pages for further hardware access (see referenced chunks).

## Source Code
```asm
; CINT - Initialize screen editor & 6567 video chip
; Call address: $FF81 (65409)
; Communication registers: None
; Preparatory routines: None
; Stack requirements: 4
; Registers affected: A, X, Y

        JSR CINT
        JMP RUN       ; BEGIN EXECUTION

; or explicitly:
;   JSR $FF81
;   JMP RUN
```

## Key Registers
- $FF81 - KERNAL ROM - CINT: Initialize 6567 (VIC-II) and KERNAL screen editor (cartridge init)

## References
- "iobase_define_io_memory_page" — locating memory-mapped I/O (VIC registers) after video init
- "chrout_output_a_character" — console output and interaction with KERNAL screen editor (CHROUT)