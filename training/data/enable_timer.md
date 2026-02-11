# ENABLE TIMER (KERNAL)

**Summary:** Initializes and starts CIA#1 timer A based on the PAL/NTSC system flag at $02A6; writes timer low/high bytes to CIA#1 timer A registers $DC04/$DC05 and then jumps to the start-timer entry ($FF6E). Searchable terms: $02A6, $DC04, $DC05, CIA-1, PAL ($4025), NTSC ($4295).

## Description
This KERNAL routine selects PAL or NTSC timer values and starts CIA#1 Timer A. It tests the system flag at $02A6 (PAL/NTSC), branches to the NTSC path if the flag is zero, otherwise uses the PAL values. The routine stores the low byte to $DC04 and the high byte to $DC05 (CIA#1 Timer A low/high), then jumps to $FF6E to start the timer.

Behavior summary:
- If $02A6 == 0 -> NTSC setup: Timer = $4295 (low = $95 -> $DC04, high = $42 -> $DC05).
- If $02A6 != 0 -> PAL setup: Timer = $4025 (low = $25 -> $DC04, high = $40 -> $DC05).
- After both bytes are written, JMP $FF6E to start the timer.

## Source Code
```asm
.,FDDD AD A6 02    LDA $02A6       ; PAL/NTSC flag
.,FDE0 F0 0A       BEQ $FDEC       ; branch if zero -> NTSC setup
.,FDE2 A9 25       LDA #$25
.,FDE4 8D 04 DC    STA $DC04       ; CIA#1 timer A - low byte (PAL: $25)
.,FDE7 A9 40       LDA #$40        ; PAL high byte ($40) for $4025
.,FDE9 4C F3 FD    JMP $FDF3
.,FDEC A9 95       LDA #$95
.,FDEE 8D 04 DC    STA $DC04       ; CIA#1 timer A - low byte (NTSC: $95)
.,FDF1 A9 42       LDA #$42        ; NTSC high byte ($42) for $4295
.,FDF3 8D 05 DC    STA $DC05       ; CIA#1 timer A - high byte
.,FDF6 4C 6E FF    JMP $FF6E       ; start timer (entry that continues serial/clock handling)
```

## Key Registers
- $02A6 - RAM - PAL/NTSC system flag (BEQ taken when zero => NTSC; non-zero => PAL)
- $DC04 - CIA-1 - Timer A low byte (write)
- $DC05 - CIA-1 - Timer A high byte (write)

## References
- "power_reset_entry_point" — covers how ENABLE TIMER is used during the reset sequence
- "start_timer" — expands on the routine at $FF6E that actually starts CIA#1 timer and continues into the serial clock handler