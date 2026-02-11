# STOP - KERNAL $FFE1 (65505)

**Summary:** KERNAL routine STOP at $FFE1 checks whether the <STOP> key was pressed during the most recent UDTIM call; it returns status in the Z flag and restores channels to default values. Call sequence: JSR UDTIM ; JSR STOP — result examined via Z (BNE/BEQ); affected registers A, X.

## Description
Purpose: Check if the <STOP> key was pressed during a prior UDTIM keyboard scan.

Call address: $FFE1 (hex) / 65505 (decimal). Communicates via accumulator (A). No preparatory routines required beyond calling UDTIM first.

Behavior:
- If UDTIM detected a <STOP> keypress, calling STOP sets the Z flag (zero flag) and resets the channels to their default values. All other processor flags remain unchanged.
- If <STOP> was not detected, A returns a byte representing the "lost row" of the keyboard scan (a code indicating which keyboard row was lost); the Z flag is clear.
- The routine affects registers A and X. There are no special stack requirements.

Usage notes:
- Always call JSR UDTIM before JSR STOP to capture keyboard state for STOP to inspect.
- Test the Z flag after JSR STOP; BNE (branch if not zero) indicates the <STOP> key was not pressed; BEQ indicates it was pressed.

## Source Code
```asm
; Example usage
    JSR UDTIM   ; SCAN FOR STOP (UDTIM must be called first)
    JSR STOP
    BNE *+5     ; KEY NOT DOWN (branch if Z=0)
    JMP READY   ; STOP pressed: jump to READY or handle stop
```

## Key Registers
- $FFE1 - KERNAL ROM - STOP routine entry point (check <STOP> key, sets Z flag, resets channels) 

## References
- "udtim_kernal_routine" — covers calling UDTIM before STOP to scan for <STOP> key and keyboard scan details

## Labels
- STOP
