# PLOT (KERNAL) - $FFF0

**Summary:** KERNAL PLOT routine at $FFF0 ($65520) reads or sets the text cursor location using the carry flag; communicates via A, X, Y registers; stack requirement 2.

## Description
PLOT ($FFF0) is a KERNAL entry that either reads the current cursor position or moves the cursor, depending on the CPU carry flag:

- With carry set (SEC) — read cursor position:
  - Returns X = row (0–24)
  - Returns Y = column (6–39)

- With carry clear (CLC) — set cursor position:
  - Input X = row (0–24)
  - Input Y = column (6–39)
  - Call moves cursor to (row X, column Y)

Other details:
- Call address: $FFF0 (65520)
- Communication registers: A, X, Y
- Preparatory routines: none required
- Error returns: none specified
- Stack requirements: 2 bytes
- Registers affected/returned: A, X, Y

## How to use
Reading cursor location:
1. SEC
2. JSR $FFF0
3. After return: X contains row (0–24), Y contains column (6–39)

Setting cursor location:
1. CLC
2. Set X = desired row (0–24), Y = desired column (6–39)
3. JSR $FFF0

## Source Code
```asm
; MOVE THE CURSOR TO ROW 10, COLUMN 5 (row=10, column=5)
    LDX #10
    LDY #5
    CLC
    JSR $FFF0    ; JSR PLOT

; READ CURSOR LOCATION INTO X,Y
    SEC
    JSR $FFF0    ; returns X=row (0-24), Y=column (6-39)
```

## Key Registers
- $FFF0 - KERNAL - PLOT: read/set cursor location (uses A,X,Y); SEC = read, CLC = set

## References
- "screen_kernal_routine" — expands on screen dimensions returned by SCREEN routine

## Labels
- PLOT
