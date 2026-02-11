# C64 RAM Map: $030C-$030F — Register Storage Area (BASIC SYS)

**Summary:** $030C-$030F (decimal 780–783) is the BASIC SYS register storage area where the 6510 registers (Accumulator .A, index .X, index .Y, status .P) are loaded from before a SYS call and saved back after the machine-language routine returns; useful with Kernal routines (PLOT $E50A, SCREEN $E505), POKE/PEEK, and parameter passing. Applies to SYS only (not USR).

## Description
The four bytes at $030C–$030F are used by Commodore BASIC's SYS command to pass and preserve the 6510 CPU registers across calls to machine-language routines:

- Before BASIC executes a SYS nnnnn, BASIC loads each 6510 register with the value found in its corresponding storage byte.
- After the ML routine finishes and returns to BASIC with an RTS, BASIC stores the current register values back into these four bytes.
- This behavior is specific to SYS; the USR function does not perform this load/store of register storage.

Typical usage:
- Place pre-entry values into these bytes (via POKE) to set up registers for a Kernal routine that expects inputs in A/X/Y/P.
- After SYS returns, PEEK these bytes to inspect results returned by a routine (e.g., Kernal routines that return results in X or Y).
- This lets BASIC programs adapt to different hardware/format (for example using SCREEN to detect screen dimensions) and preserve register state across multiple SYS calls.

Register byte mapping (sequential in the four-byte area):
- $030C ($030C decimal 780) — Accumulator (.A)
- $030D ($030D decimal 781) — Index register .X
- $030E ($030E decimal 782) — Index register .Y
- $030F ($030F decimal 783) — Status register .P

Kernal examples referenced in the original text:
- PLOT — 58634 ($E50A): Positions the cursor; expects carry clear (P bit) and X/Y set to row/column as documented by the Kernal (example usage below).
- SCREEN — 58629 ($E505): Returns number of screen rows in .Y and number of columns in .X; useful to write format-independent BASIC.

Example uses shown in source:
- Position cursor and print "HELLO" by POKEing the register storage area then SYS to the PLOT routine (SYS 65520).
- Use SCREEN (SYS 65517) then PEEK the storage bytes to obtain columns/rows for adaptable screen-handling.

## Source Code
```basic
10 REM Position cursor at row 10, column 5 and print HELLO
20 POKE 781,10:POKE 782,5:POKE 783,0:SYS 65520:PRINT "HELLO"

30 REM Call SCREEN to get dimensions (SCREEN returns rows in .Y and cols in .X)
40 SYS 65517
50 ? PEEK(781)  : REM PEEK(781) returns number of columns (X)
60 ? PEEK(782)  : REM PEEK(782) returns number of rows    (Y)
```

## Key Registers
- $030C-$030F - 6510 - BASIC SYS register storage area: sequentially stores Accumulator (.A), .X, .Y, .P

## References
- "register_storage_addresses" — expands on specific storage addresses for .A, .X, .Y, .P
- "usradd_and_parameter_passing" — expands on passing parameters to/from USR and interaction with register storage