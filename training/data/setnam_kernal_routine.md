# KERNAL SETNAM ($FFBD) — Set file name for OPEN/SAVE/LOAD

**Summary:** KERNAL routine SETNAM at $FFBD (decimal 65469) sets the file name used by OPEN, SAVE, and LOAD. Call parameters: A = filename length (0 = no name), X/Y = pointer to filename (low/high byte, 6502 format).

**Description**
Purpose: Set the file name for subsequent OPEN, SAVE, or LOAD KERNAL calls.

Call address: $FFBD (hex) / 65469 (dec).  
Communication registers: A (length), X (pointer low), Y (pointer high).  
Stack requirements: 2.

Behavior: The accumulator must contain the byte length of the filename (0 for no name). X and Y must contain the low and high bytes of the address where the filename string resides (standard 6502 little-endian pointer). If A = 0 (no filename), X and Y may contain any address. The filename may be located anywhere in memory.

Registers affected: None.

How to use (call sequence):
1. Load A with filename length (0 if none).  
2. Load X with low byte of filename address.  
3. Load Y with high byte of filename address.  
4. JSR $FFBD (JSR SETNAM).

## Source Code
```asm
; Example call (from original source)
        LDA #NAME2-NAME     ; LOAD LENGTH OF FILE NAME
        LDX #<NAME          ; LOAD ADDRESS OF FILE NAME (low byte)
        LDY #>NAME          ; LOAD ADDRESS OF FILE NAME (high byte)
        JSR $FFBD           ; JSR SETNAM
```

## Key Registers
- $FFBD - KERNAL - SETNAM call address (set file name for OPEN/SAVE/LOAD)

## References
- "setlfs_kernal_routine" — expands on SETLFS (used with SETNAM to open files)

## Labels
- SETNAM
