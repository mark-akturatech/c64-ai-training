# UNTLK (KERNAL $FFAB)

**Summary:** KERNAL call UNTLK at $FFAB (65451) transmits an UNTALK command on the C64 serial bus to stop devices previously set to TALK from sending data; call with JSR UNTLK (JSR $FFAB). Error status returned via READST.

## Description
Purpose: Transmit an UNTALK command on the serial bus. All devices previously set to TALK will stop sending data when this command is received.

Call address: $FFAB (hex) / 65451 (decimal)

Communication registers: None

Preparatory routines: None

Error returns: See READST (use READST to obtain error/status codes)

Stack requirements: 8 bytes

Registers affected: A

How to use: Call the routine once (e.g., JSR UNTLK). No parameters or device number in registers are required by this routine.

## Source Code
```asm
; Call by symbolic name or absolute address
        JSR $FFAB    ; JSR UNTLK - transmit UNTALK on serial bus
```

## References
- "talk_kernal_routine" — complements TALK; expands on UNTALK and stopping devices talking

## Labels
- UNTLK
