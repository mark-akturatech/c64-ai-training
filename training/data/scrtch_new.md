# SCRTCH ($A642) — NEW command (BASIC end-of-program pointer $002D-$002E)

**Summary:** Implements the NEW command by writing two zero bytes into the link field of the first BASIC program line and setting the end-of-program pointer at $002D-$002E to the byte immediately after those zeros; execution then falls through into CLR to finish clearing program state. Searchable terms: SCRTCH, NEW, CLR, $002D-$002E, BASIC link field.

## Operation
SCRTCH is the ROM routine that implements the BASIC NEW command. Its actions are:

- Overwrite the two-byte link address at the start of the first BASIC program line with $00 $00. This marks the first line as the end-of-program (no following line).
- Set the BASIC end-of-program pointer (two-byte system variable at $002D-$002E) to point to the byte immediately after those two zeros — i.e., the first free byte after the now-terminated program.
- Continue execution into the CLR routine to complete clearing program state (CLR handles clearing interpreter state and related bookkeeping).

Notes:
- The BASIC line link is a two-byte little-endian pointer stored at the start of each program line; SCRTCH clears that link for the first line.
- The end-of-program pointer at $002D-$002E is used by the BASIC interpreter to locate the end of the stored program memory.

## Key Registers
- $002D-$002E - BASIC - two-byte end-of-program pointer (points to first free byte after BASIC program)

## References
- "clear_clr" — expands on how NEW continues into CLR to finish clearing program state

## Labels
- SCRTCH
