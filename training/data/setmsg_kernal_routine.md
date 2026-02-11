# SETMSG ($FF90) — Control KERNAL message output

**Summary:** KERNAL call SETMSG at $FF90 (65424) — control printing of error and control messages using accumulator A (bit7 = error, bit6 = control). Call with JSR $FF90 after loading A.

## Description
Purpose: enable/disable KERNAL-printed messages (error and control messages).

Call: JSR $FF90 (SETMSG) — decimal 65424.  
Communication register: A.  
Stack requirements: 2 bytes (JSR).  
Registers affected: A (destroyed).  
Preparatory routines: none.  
Error returns: none.

Behavior:
- Bit 7 (mask $80): when set, KERNAL error messages (e.g., "FILE NOT FOUND") will be printed.
- Bit 6 (mask $40): when set, KERNAL control messages (e.g., "PRESS PLAY ON CASSETTE") will be printed.
- Bits 6 and 7 may be set independently or together to enable both categories. Clearing both bits disables KERNAL message printing.

How to use:
1) Load A with the desired bit mask(s) (bit7 and/or bit6).  
2) JSR to $FF90.

Example usage in prose: set A = $40 to enable control messages; set A = $80 to enable error messages; set A = $00 to disable both.

## Source Code
```asm
; SETMSG — control KERNAL message printing
; Call with JSR $FF90 (65424). A: bit7 = error, bit6 = control.

        LDA #$40
        JSR $FF90        ; TURN ON CONTROL MESSAGES

        LDA #$80
        JSR $FF90        ; TURN ON ERROR MESSAGES

        LDA #$00
        JSR $FF90        ; TURN OFF ALL KERNAL MESSAGES

; Masks:
;   $80 = %10000000  ; bit 7 = error messages
;   $40 = %01000000  ; bit 6 = control messages
```

## Key Registers
- $FF90 - KERNAL - SETMSG entry (JSR $FF90 / 65424) — A: bit7=$80 (error messages), bit6=$40 (control messages)

## References
- "readst_kernal_routine" — use READST to interpret device status rather than relying on printed messages

## Labels
- SETMSG
