# LINNUM ($0014-$0015)

**Summary:** LINNUM at zero-page $0014-$0015 is a two-byte low/high integer holding a target BASIC line number for GOTO, LIST, ON, and GOSUB (and the line number to add/replace); LIST may store $FFFF to mean "to end". GOTO’s search-start test compares the most significant byte only (INT(TARGET/256) vs INT(CURRENT/256)). PEEK, POKE, WAIT, and SYS use LINNUM as a pointer-to-address parameter.

## Description
LINNUM is a zero-page two-byte integer (low byte at $0014, high byte at $0015) used by several BASIC interpreter operations:

- Holds the target line number for GOTO, LIST, ON, and GOSUB in low/high format.
- Holds the line number to be added or replaced when editing the program.
- LIST stores the highest line number to list here; if listing until the end, it stores $FFFF.
- GOTO decides where to begin searching for the target line by comparing only the most significant byte of the target and current line numbers. Concretely, the interpreter compares INT(TARGET/256) and INT(CURRENT/256): if INT(TARGET/256) > INT(CURRENT/256), GOTO starts its search at the current line; otherwise it starts at the first line of the program. (This means lines are effectively grouped by 256-line pages for the search-start heuristic.)
- PEEK, POKE, WAIT, and SYS treat the two-byte value at $0014-$0015 as a pointer to an address parameter used by those commands.

## Key Registers
- $0014-$0015 - Zero Page - LINNUM: two-byte low/high integer target line number for GOTO, LIST, ON, GOSUB; LIST stores highest line (or $FFFF to mean to end); used as pointer by PEEK/POKE/WAIT/SYS.

## References
- "channl_current_io_channel" — expands on previous I/O-related flags and behavior  
- "temporary_string_stack_temppt_lastpt_tempst" — expands on next zero-page area used for temporary string handling

## Labels
- LINNUM
