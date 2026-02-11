# BASIC SYS X — call machine-language subroutine

**Summary:** SYS X in Commodore 64 BASIC transfers execution to a machine-language routine at address X; the routine must end with RTS to return to BASIC. Parameters are typically exchanged via PEEK/POKE (memory locations) or equivalent memory accesses from machine code.

## Description
The BASIC statement SYS X causes BASIC to jump to a machine-language subroutine beginning at absolute memory address X. The machine-language routine must conclude with an RTS (ReTurn from Subroutine) instruction so control returns to the BASIC interpreter.

Parameter passing and data exchange between the BASIC program and the machine-language routine are normally performed by reading and writing memory locations from BASIC using PEEK and POKE, and by having the machine code read/write those same memory addresses (the "machine-language equivalents" are ordinary loads/stores to those addresses). Multiple SYS calls may be used in a program; each SYS can target the same or different machine-language routines.

## References
- "where_to_put_ml_routines" — recommended addresses for placing SYS-callable machine-language routines
