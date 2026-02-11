# IOINIT (KERNAL)

**Summary:** IOINIT initializes Commodore 64 I/O devices and KERNAL I/O routines; call address $FF84 (65412 decimal). Typical usage: JSR IOINIT — affects registers A, X, Y and is normally invoked during cartridge initialization.

## Description
IOINIT is a KERNAL entry point that initializes all input/output devices and associated KERNAL I/O routines. It prepares the system I/O state for use by programs (commonly used by cartridge init code). The documented effects list registers A, X, and Y as being modified by the routine. No communication registers or preparatory routines are specified in the source notes.

Documented metadata:
- Purpose: Initialize I/O devices and KERNAL I/O routines
- Call address: $FF84 (hex) / 65412 (decimal)
- Communication registers: None
- Preparatory routines: None
- Stack requirements: None documented
- Error returns: None documented
- Registers affected: A, X, Y

## Source Code
```asm
; Example usage
    JSR IOINIT        ; call KERNAL routine at $FF84 to initialize I/O

; Equivalent explicit call
    JSR $FF84
```

## Key Registers
- $FF84 - KERNAL - IOINIT call address (initialize I/O devices)

## References
- "user_port_ddr_example_and_page_heading" — expands on preceding assembly example and section heading
- "listen" — expands on other serial/I/O KERNAL routines

## Labels
- IOINIT
