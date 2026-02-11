# IOBASE ($FFF3) - Return CIA #1 Base Address

**Summary:** KERNAL vector $FFF3 (IOBASE) returns the CIA #1 I/O base address ($DC00) in the X/Y registers. The vector entry at $FFF3 points to ROM routine at $E500.

## Description
IOBASE is the KERNAL entry (vector) at $FFF3. When invoked, it returns the CIA #1 base address ($DC00) in the X and Y registers (the routine uses X and Y to return the 16-bit address). The vector table entry $FFF3 contains the real ROM address $E500 where the IOBASE routine resides.

## Key Registers
- $DC00-$DC0F - CIA 1 - CIA #1 I/O registers base (timers, TOD clock, port I/O, interrupt control)

## References
- "ioinit" — expands on CIA initialization performed by IOINIT ($FF84)

## Labels
- IOBASE
