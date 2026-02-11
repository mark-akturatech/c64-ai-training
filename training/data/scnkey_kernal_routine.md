# SCNKEY ($FF9F) — KERNAL: Scan keyboard and queue ASCII

**Summary:** SCNKEY (KERNAL call $FF9F / 65439) scans the C64 keyboard, used by the IRQ handler, and places the ASCII code of a pressed key into the keyboard queue. Requires IOINIT as preparatory routine.

## Description
Purpose: Scan the keyboard and queue ASCII of pressed key(s).

Call address
- $FF9F (hex) — 65439 (decimal)

Communication registers
- None

Preparatory routines
- IOINIT (must be run before using SCNKEY)

Error returns
- None

Stack requirements
- 5 bytes

Registers affected
- A, X, Y

Behaviour
- SCNKEY performs a keyboard scan identical to the one invoked by the interrupt handler. When a key is detected as pressed, its ASCII value is placed into the KERNAL keyboard queue. This routine is intended for use when the normal IRQ handler is bypassed and must be called explicitly to update the keyboard queue.

How to use
- Simply JSR to SCNKEY (or JSR $FF9F) after IOINIT has been performed. Typical use is in a polling loop that calls SCNKEY, then retrieves characters from the keyboard queue (for example GETIN), and processes or outputs them.

Example usage (assembly-style label/JSR sequence shown in source)

## Source Code
```asm
; SCNKEY example polling loop
; Requires IOINIT to have been run prior to using SCNKEY

        GET     JSR SCNKEY      ; SCAN KEYBOARD
                JSR GETIN       ; GET CHARACTER FROM KBD QUEUE
                CMP #0          ; IS IT NULL?
                BEQ GET         ; YES... SCAN AGAIN
                JSR CHROUT      ; PRINT IT

; Alternatively call by address:
;        JSR $FF9F            ; SCNKEY entry point
```

## References
- "ioinit_kernal_routine" — IOINIT preparatory routine (covers initialization required before calling SCNKEY)

## Labels
- SCNKEY
