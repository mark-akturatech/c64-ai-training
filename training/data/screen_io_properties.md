# KERNAL: IOBASE ($FFF3), SCREEN ($FFED), PLOT ($FFF0) — Routines at $E500–$E517

**Summary:** KERNAL routines: IOBASE ($FFF3) returns the I/O base $DC00 in X/Y (VIC/CIA I/O base); SCREEN ($FFED) returns screen dimensions 40x25 in X/Y; PLOT ($FFF0) is a get/put cursor routine that reads/writes zero-page TBLX/PNTR ($D6/$D3) and calls $E56C to set screen pointers.

## IOBASE (GET I/O ADDRESS)
Returns the I/O base address $DC00 in the X and Y registers. This routine is reached via the KERNAL vector IOBASE ($FFF3) and simply loads #$00 into X and #$DC into Y so the caller receives $DC00 as (Y<<8)|X.

## SCREEN (GET SCREEN SIZE)
Returns the default text screen size: columns = 40, rows = 25. Reached via the KERNAL vector SCREEN ($FFED). Values returned in X (columns = $28) and Y (rows = $19).

## PLOT (PUT/GET ROW AND COLUMN)
Entry via KERNAL vector PLOT ($FFF0). Behavior depends on the incoming Carry flag:
- Carry clear (PUT): Caller supplies column in Y and row in X. The routine stores X→$D6 (TBLX) and Y→$D3 (PNTR), then JSR $E56C to set screen pointers; it then reloads X/Y from those zero-page bytes and returns.
- Carry set (GET): The routine skips the store and pointer setup, loads X←$D6 and Y←$D3 (returning stored row/column) and returns.

Notes:
- $D6 and $D3 here are zero-page storage locations used by the KERNAL for TBLX/PNTR (current row/column pointers), not VIC/CIA I/O registers.
- PLOT calls $E56C to (re)compute / set screen pointer state after stores; callers relying on pointer side-effects must expect that JSR.

## Source Code
```asm
.,E500 A2 00    LDX #$00        set (X/Y) to $dc00
.,E502 A0 DC    LDY #$DC
.,E504 60       RTS

.,E505 A2 28    LDX #$28        40 columns
.,E507 A0 19    LDY #$19        25 rows
.,E509 60       RTS

.,E50A B0 07    BCS $E513       if carry set, jump
.,E50C 86 D6    STX $D6         store TBLX, current row
.,E50E 84 D3    STY $D3         store PNTR, current column
.,E510 20 6C E5 JSR $E56C       set screen pointers
.,E513 A6 D6    LDX $D6         read TBLX
.,E515 A4 D3    LDY $D3         read PNTR
.,E517 60       RTS
```

## Key Registers
- $FFF0 - KERNAL vector - PLOT entry (routes to $E50A)
- $FFED - KERNAL vector - SCREEN entry (routes to $E505)
- $FFF3 - KERNAL vector - IOBASE entry (routes to $E500)
- $DC00-$DC0F - CIA 1 - I/O chip base (value returned by IOBASE)
- $E56C - KERNAL (internal) - set screen pointers (called by PLOT)

## References
- "screen_initialization_and_io_defaults" — expands on initial VIC register setup and I/O defaults at startup
- "synchronise_colour_pointer" — expands on screen pointers and color RAM mapping used later

## Labels
- IOBASE
- SCREEN
- PLOT
- TBLX
- PNTR
