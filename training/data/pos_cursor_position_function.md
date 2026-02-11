# POS (BASIC) — implementation at $B39E

**Summary:** POS implementation at $B39E (BASIC ROM) calls the KERNAL PLOT routine ($E50A) to obtain the cursor position on the logical line (equivalent to PEEK(211) / memory $00D3). Logical-line positions can exceed 39 characters (e.g. returns 48 for a long logical sentence).

## Description
The POS statement/function in BASIC is implemented at $B39E in the BASIC ROM. When executed it invokes the KERNAL PLOT routine at $E50A to read the current cursor position on the logical line. This behavior is equivalent to reading PEEK(211) (RAM location $00D3), which holds the cursor column on the logical line; because it reports the logical (not physical/screen) column, the returned value can be greater than 39 for long logical lines. Example: the statement

THIS SENTENCE IS LONGER THAN ONE PHYSICAL LINE;POS(X)

will set X to 48.

POS is a statement-level function (subject to statement-execution mode checks handled elsewhere — see errdir_illegal_direct_check for related checks).

## Key Registers
- $B39E - BASIC ROM - POS implementation entrypoint
- $E50A - KERNAL ROM - PLOT routine used to obtain cursor position
- $00D3 - RAM - BASIC cursor position (PEEK(211))

## References
- "errdir_illegal_direct_check" — expands on POS as a statement-level function; ERRDIR handles other statement execution mode checks