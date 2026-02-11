# LISTEN (KERNAL)

**Summary:** KERNAL routine LISTEN at $FFB1 (decimal 65457) — command a device on the C64 serial bus to enter listen mode. Uses accumulator (A) containing device number 0–31; called with JSR $FFB1.

## Description
LISTEN is a KERNAL service that commands a peripheral on the serial bus to receive data. Before calling:

- Load A with the device number (0–31).
- Call the routine with JSR $FFB1.

Operation details (as documented): the accumulator contents (device number) are ORed bit by bit to form a listen address, which is then transmitted on the serial bus as the LISTEN command. The addressed device will enter listen mode and be ready to accept data.

Parameters and effects:
- Communication register: A — contains device number (0–31).
- Registers affected: A (per source).
- Preparatory routines: None required.
- Stack requirements: None.
- Error returns: See READST (READST is the KERNAL routine that returns status/error codes for serial operations).

How to use:
1. LDA #device_number (0–31)
2. JSR $FFB1

Example: command device #8 to listen (short form)
- LDA #8
- JSR LISTEN ($FFB1)

## Source Code
```asm
; COMMAND DEVICE #8 TO LISTEN
    LDA #8
    JSR $FFB1    ; LISTEN
```

## Key Registers
- $FFB1 - KERNAL - LISTEN call address (JSR) — command device on serial bus to listen

## References
- "ioinit_kernal_routine" — I/O initialization and related KERNAL routines
- "load_kernal_routine" — other serial/file-access KERNAL routines

## Labels
- LISTEN
