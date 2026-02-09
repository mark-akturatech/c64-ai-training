# CHRIN ($FFCF)

**Summary:** KERNAL routine CHRIN at $FFCF (vectorized via $0324, real ROM entry $F157) reads a single byte from the default input device or a line from the screen. On return A contains the byte read; the routine uses the A and Y registers.

## Description
CHRIN is the KERNAL entry for character input. Behavior:
- Reads one byte from the default input device (e.g., keyboard or currently-selected device) or from an input line taken from the screen buffer.
- Return value: A = byte read.
- Registers: A and Y are used by the routine (caller should save them if their values must be preserved).
- Invocation: typically called with JSR $FFCF; the result is in A on return.
- Implementation: the vector at $FFCF is indirect at runtime — CHRIN dispatches via the word stored at $0324 and ultimately executes the ROM handler at $F157.

No other calling parameters or status flags are returned in processor status; higher-level input parsing (line editing, CR/NL handling) may be handled by the device-specific handler reached through the vector.

## Source Code
(omitted — no assembly or register-map listings in source)

## Key Registers
- $FFCF - KERNAL - CHRIN entry vector (JSR entry for character input)
- $0324 - KERNAL - indirect pointer/address used by CHRIN to locate the input handler
- $F157 - KERNAL ROM - actual ROM routine entry used by CHRIN

## References
- "chrout" — CHROUT $FFD2, default output (writing characters)
- "getin" — GETIN $FFE4, lower-level input routine