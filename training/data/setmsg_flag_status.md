# SETMSG: FLAG STATUS (KERNAL)

**Summary:** SETMSG (vectored from $FF90) stores A into MSGFLG ($009D) and merges the I/O STATUS byte at $0090 into STATUS by ORA/STA; an alternate entry at $FE1C treats A as the new STATUS (merged with existing $0090). Keywords: $009D, $0090, SETMSG, $FF90, $FE1C, MSGFLG, STATUS, ORA, STA.

## Description
This small KERNAL helper updates two zero-page KERNAL variables used to control message printing and I/O status:

- When entered at $FE18 (the normal path reached from the $FF90 vector), A is stored to MSGFLG ($009D). The routine then reloads the current STATUS from $0090, ORs it with itself (no change), and writes it back — leaving STATUS effectively unchanged.
- When entered at $FE1C (alternate entry), A contains bits to be merged into STATUS: the code ORs A with the current STATUS at $0090 and stores the result back to $0090. MSGFLG is not modified in this path.

The OR operation performs a bitwise logical-OR (i.e., resulting STATUS = A_in OR STATUS_old when entering at $FE1C). The routine always ends with RTS.

## Source Code
```asm
                                *** SETMSG: FLAG STATUS
                                The KERNAL routine SETMSG ($ff90) jumps to this routine.
                                On entry, the value in (A) is stored in MSGFLG, then the
                                I/O status is placed in (A). If routine is entered at
                                $fe1c the contents in (A) will be stored in STATUS.
.,FE18 85 9D    STA $9D         store MSGFLG
.,FE1A A5 90    LDA $90         read STATUS
.,FE1C 05 90    ORA $90
.,FE1E 85 90    STA $90
.,FE20 60       RTS
```

## Key Registers
- $009D - KERNAL (zero page) - MSGFLG (controls whether KERNAL prints messages)
- $0090 - KERNAL (zero page) - STATUS (I/O/status byte merged by SETMSG)

## References
- "output_kernal_error_messages" — expands on MSGFLG controls whether error messages are printed

## Labels
- SETMSG
- MSGFLG
- STATUS
