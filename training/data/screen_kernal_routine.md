# SCREEN (KERNAL)

**Summary:** Kernal routine SCREEN at $FFED (65517) returns the screen format: columns in X and rows in Y. Use the JSR $FFED / JSR SCREEN call; outputs are in X and Y registers for compatibility detection.

## Description
Purpose: Return screen format (number of columns and lines).

Call address: $FFED (hex) / 65517 (decimal)

Communication registers:
- X — returned: number of columns (e.g. 40)
- Y — returned: number of rows (e.g. 25)

Preparatory routines: None  
Stack requirements: 2  
Registers affected: X, Y

Notes:
- The routine is implemented on the Commodore 64 Kernal to help determine the current machine/screen configuration for compatibility.
- Use immediately after JSR; X and Y contain results on return (no inputs required).

## Source Code
```asm
; Example usage
        JSR SCREEN      ; call Kernal routine at $FFED
        STX MAXCOL      ; save returned columns
        STY MAXROW      ; save returned rows
```

## Key Registers
- $FFED - KERNAL - SCREEN call address (returns columns in X, rows in Y)

## References
- "plot_kernal_routine" — expands on PLOT and uses screen dimensions

## Labels
- SCREEN
