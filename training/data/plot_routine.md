# KERNAL PLOT / PLOT10 — Read/Plot Cursor Position ($E50A / $E513)

**Summary:** KERNAL entry that reads/plots the cursor position and branches between PLOT and PLOT10 ($E50A / $E513). Stores X/Y into TBLX/$D6 and PNTR/$D3, calls STUPT ($E56C) when appropriate, and returns via RTS.

## Description
This routine implements the KERNAL PLOT entry and the alternate PLOT10 entry:

- At $E50A (PLOT): if Carry is set (BCS) control jumps to PLOT10 at $E513. If not, the routine stores the CPU X register into TBLX ($D6) and the Y register into PNTR ($D3), then JSRs STUPT ($E56C) before returning.
- At $E513 (PLOT10): it restores X and Y from TBLX/$D6 and PNTR/$D3 respectively, then RTS returns to the caller.

Operational notes:
- The BCS at entry selects between updating the stored cursor coordinates + calling STUPT, or simply loading previously-saved coordinates (PLOT10 path).
- STUPT is invoked at $E56C (see source code) to perform further setup/plot actions.
- TBLX ($D6) and PNTR ($D3) are used as zero-page KERNAL variables for X/Y cursor storage.

## Source Code
```asm
.; READ/PLOT CURSOR POSITION
.; PLOT routine entry at $E50A/$E513: reads/plots cursor position.
.; Handles branching between PLOT and PLOT10 (BCS) and stores X/Y into TBLX/PNTR then calls STUPT when appropriate, returning via RTS.

.,E50A B0 07    BCS $E513       PLOT   BCS PLOT10
.,E50C 86 D6    STX $D6         STX    TBLX
.,E50E 84 D3    STY $D3         STY    PNTR
.,E510 20 6C E5 JSR $E56C       JSR    STUPT
.,E513 A6 D6    LDX $D6         PLOT10 LDX TBLX
.,E515 A4 D3    LDY $D3         LDY    PNTR
.,E517 60       RTS             RTS
```

## Key Registers
- $D6 - Zero page - TBLX (stores X cursor coordinate)
- $D3 - Zero page - PNTR (stores Y cursor coordinate)

## References
- "screen_dimensions_routine" — expands on uses of LLEN/NLINES for cursor position logic

## Labels
- PLOT
- PLOT10
- TBLX
- PNTR
