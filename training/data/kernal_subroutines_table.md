# KERNAL I/O: Six Major Subroutines

**Summary:** List of six major KERNAL subroutines and their entry addresses ($FFC6, $FFC9, $FFCC, $FFD2, $FFE1, $FFE4), with each routine's action and which CPU registers it may modify (A, X, Y). Includes I/O-switching (CHKIN/CHKOUT), defaults (CLRCHN), character I/O (CHROUT/GETIN), and STOP key check.

## KERNAL I/O subroutines
The six commonly used KERNAL entry points for console and logical-file I/O are given with their primary action and the CPU registers they may change. Call these routines by JSR to the listed address; each routine's side-effects on A, X, Y are shown (registers listed are potentially altered by the routine).

Use the table in the Source Code section for the canonical reference of addresses, names, actions, and registers changed.

## Source Code
```text
Address  Name    Action                              Registers Changed
----------------------------------------------------------------------
$FFC6    CHKIN   Switch input to logical file X      A,X
$FFC9    CHKOUT  Switch output to logical file X     A,X
$FFCC    CLRCHN  Restore input/output defaults       A,X
$FFD2    CHROUT  Output ASCII character in A         none
$FFE1    STOP    Check RUN/STOP key                  A
$FFE4    GETIN   Get ASCII character into A          A,X,Y
```

## Key Registers
- $FFC6 - KERNAL - CHKIN: switch input to logical file X (affects A,X)
- $FFC9 - KERNAL - CHKOUT: switch output to logical file X (affects A,X)
- $FFCC - KERNAL - CLRCHN: restore input/output defaults (affects A,X)
- $FFD2 - KERNAL - CHROUT: output ASCII character in A (no registers affected)
- $FFE1 - KERNAL - STOP: check RUN/STOP key (affects A)
- $FFE4 - KERNAL - GETIN: get ASCII character into A (affects A,X,Y)

## References
- "glossary" — expands on KERNAL and KERNAL subroutine terminology
- "copy_all_description" — expands on programs that call KERNAL I/O routines

## Labels
- CHKIN
- CHKOUT
- CLRCHN
- CHROUT
- STOP
- GETIN
