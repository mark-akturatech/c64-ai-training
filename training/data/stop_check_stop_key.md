# STOP: Check <STOP> key (vectored at $FFE1)

**Summary:** KERNAL entry at $FFE1 checks zero-page STKEY ($0091) for #$7F (STOP pressed during jiffy update); if set it calls CLRCHN ($FFCC) to close all I/O channels, stores the keyboard count into $00C6, and returns. Processor flags are preserved across the CLRCHN call (PHP/PLP).

## STOP: Check <STOP> key
This routine is the STOP handler vectored at $FFE1. Behavior:

- Reads STKEY (zero page $0091) and compares with #$7F. This value indicates a STOP key event that occurred while the jiffy clock was being updated.
- If STKEY ≠ #$7F the routine returns immediately (RTS).
- If STKEY = #$7F:
  - PHP pushes the processor status to preserve flags across the CLRCHN call.
  - JSR $FFCC calls CLRCHN to close/restore I/O channels.
  - STA $00C6 stores the accumulator into zero-page $C6 (keyboard buffer count).
  - PLP restores the previously saved processor status.
  - RTS returns to the caller.

Notes:
- The STA $00C6 occurs after the JSR, so this code relies on CLRCHN either preserving the accumulator or leaving it in a value intended to be stored into $00C6.
- This routine is intended to close all I/O channels and reset keyboard buffering state when a STOP event is detected during the jiffy update.

## Source Code
```asm
.,F6ED A5 91    LDA $91         STKEY
.,F6EF C9 7F    CMP #$7F        <STOP> ?
.,F6F1 D0 07    BNE $F6FA       nope
.,F6F3 08       PHP
.,F6F4 20 CC FF JSR $FFCC       CLRCHN, close all I/O channels
.,F6F7 85 C6    STA $C6         NDX, number of characters in keyboard buffer
.,F6F9 28       PLP
.,F6FA 60       RTS
```

## Key Registers
- $FFE1 - KERNAL vector entry - STOP key handler entry point
- $FFCC - KERNAL routine - CLRCHN (close/restore I/O channels)
- $0091 - Zero Page - STKEY (stop-key flag / jiffy-update marker)
- $00C6 - Zero Page - keyboard buffer count (number of characters in keyboard buffer)

## References
- "clrchn_restore_default_io" — expands on CLRCHN behavior and restoring default I/O

## Labels
- STOP
- CLRCHN
- STKEY
