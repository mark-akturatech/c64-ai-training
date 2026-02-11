# MACHINE - PENTOMINOS program map: addresses and corresponding BASIC line equivalences

**Summary:** Machine-code entry points and routine map for the PENTOMINOS program with absolute addresses ($156D, $15A4, $15CC, $1600, $1609, $1686, $16E0, $1701-$17C1) and their corresponding BASIC line numbers (1070–2300). Includes routines: startup, screen clear, variable setup, find space, piece management (get/try/put/undraw/rotate/give up), and solution printing.

## Program map
- $156D — Start (machine-code entry), BASIC line 1070
- $15A4 — Clear screen routine, BASIC line 1120
- $15A9 — Clear variables and setup (variable initialization)
- $15CC — Find space routine, BASIC line 2010
- $1600 — Get new piece routine, BASIC line 2030
- $1609 — Try piece routine (attempt placement), BASIC line 2060
- $1686 — Put piece in (place piece into board data structures), BASIC line 2120
- $16E0 — Print "Solution" (output routine), BASIC line 2170
- $1701-$17C1 — Piece manipulation group:
  - $1701 — Undraw piece entry, BASIC line 2190
  - $17AB — Rotate piece, BASIC line 2260
  - $17BC — Give up on piece, BASIC line 2280
  - $17C1 — Look for new piece, BASIC line 2300

Notes:
- Addresses are absolute machine-code offsets (hex).
- BASIC line numbers shown are the program’s BASIC listings that call or correspond to these machine routines.
- The range $1701-$17C1 groups related undraw/rotate/give-up/look-for-new-piece handlers.

## References
- "pentominos_variables" — expands on data structures and tables used by these routines