# Register storage area ($030C-$030F / 780-783) — BASIC SYS 6510 register save/restore

**Summary:** Describes BASIC's register storage area at $030C-$030F (locations 780–783) used by the BASIC SYS command to preload and preserve 6510 registers A, X, Y and the status register P; includes mapping, behavior (load before SYS, save after RTS), example BASIC calls (POKE/SYS), and warnings about modifying the status flags (Interrupt Disable, Carry).

## Description
BASIC reserves four zero-page locations (decimal 780–783, hex $030C–$030F) as a register-storage area used only by the BASIC SYS command. Before each SYS call, BASIC loads the 6510 registers from these 4 bytes; when the machine-language program returns to BASIC with an RTS, BASIC writes back the 6510 registers into the same 4 bytes.

This mechanism allows:
- Preloading register values from BASIC (via POKE) so a Kernal or custom ML routine sees desired A, X, Y, P on entry.
- Reading results returned in registers after the ML routine returns (via PEEK).
- Preserving register state across multiple SYS calls.

This behavior applies only to SYS, not to USR.

Mapping (storage address -> 6510 register):
- 780 ($030C) = Accumulator A
- 781 ($030D) = X index register
- 782 ($030E) = Y index register
- 783 ($030F) = Processor status P

Important semantics:
- Values in 780–783 are copied into the CPU registers immediately before jumping to the ML entry point.
- When the ML code executes RTS and returns to BASIC, BASIC copies the current A, X, Y, P back into these addresses.
- Because P is the processor status byte, writing arbitrary values to 783 can change interrupt handling and other status flags. Modify P carefully.

**Status-flag safety**
- The 6510/6502 status bits (bit7..0): N V - B D I Z C (I = Interrupt Disable, C = Carry).
- To avoid disabling interrupts unintentionally, do not blindly POKE 783 with a literal unless you intend to modify all flags.
- To modify only specific bits from BASIC, use PEEK/POKE with bitwise operations (examples in Source Code).
- For example: clear Carry (C, bit0) safely: POKE 783, PEEK(783) AND 254. Set Interrupt Disable (I, bit2) safely: POKE 783, PEEK(783) OR 4.

**Kernal routine examples**
- PLOT (Kernal) positions the cursor by X/Y registers. To use it from BASIC you can preload X and Y and the flags via 780–783 and SYS into the Kernal PLOT entry.
- SCREEN (Kernal) returns display dimensions in X and Y; after SYS to the SCREEN routine you can PEEK the appropriate storage bytes to read returned register values.

**[Note: Source may contain an error — the original decimal SYS addresses shown in the source text appear incorrect; corrected Kernal decimal addresses are used in examples below.]**

## Source Code
```basic
REM Example: Position cursor and PRINT "HELLO" using Kernal PLOT ($E50A = 58634)
POKE 781,10 : REM X = row 10 (vertical)
POKE 782,5  : REM Y = column 5 (horizontal)
POKE 783,0  : REM P = 0 (clear status flags; blunt — clears I, D, etc.)
SYS 58634   : REM SYS to $E50A (Kernal PLOT)
PRINT "HELLO"

REM Safer flag manipulation examples (do not overwrite other bits):
REM Clear Carry (C = bit0)
POKE 783, PEEK(783) AND 254

REM Set Interrupt Disable (I = bit2)
POKE 783, PEEK(783) OR 4

REM Example: Call SCREEN ($E505 = 58629) and read columns (returned in X)
SYS 58629
PRINT "Columns: "; PEEK(781)  : REM PEEK(781) == X after return
PRINT "Rows: ";    PEEK(782)  : REM PEEK(782) == Y after return
```

## Key Registers
- $030C-$030F - 6510 (CPU) - BASIC SYS register save area: A, X, Y, P (Accumulator, X index, Y index, Processor status)

## References
- "usrpoke_usradd_and_usr_usage" — related: passing parameters to/from ML routines, USR differences and POKE/PEEK usage