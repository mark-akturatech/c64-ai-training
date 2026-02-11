# MACHINE - FACTORS: Program map ($1300-$1565)

**Summary:** Program map for a 6502/C64 "FACTORS" assembly program listing routine entry points and short descriptions for addresses $1300 through $1565, including main/startup ($1300), input handling ($131D-$133A), factoring loops ($1350, $1365), arithmetic helpers ($140B multiply-by-two, $1415 division), and printing/formatting routines up to $1565.

## Program map
- $1300 - Main routine, including start and clear work area
- $131D - Get number digits from user
- $1331 - Handle bad input
- $133A - Begin factoring; check non-zero
- $1350 - Try divisors 2, 3, and 5
- $1365 - Try higher divisors
- $13A2 - Print remaining value
- $13BA - Prompt subroutine
- $13C4 - Input and analyze digit
- $140B - Multiply-by-two subroutine
- $1415 - Division subroutine
- $147A - Try a divisor (short)
- $147D - Try a divisor (long)
- $1485 - Check if remainder is zero
- $1492 - Log factor if found
- $14A2 - Check if more to do
- $14B9 - Print value subroutine
- $14D0 - Print factor subroutine
- $1504 - Clear output area
- $1535 - Print a digit with zero suppression
- $1565 - 30-count values table (values: 1, 7, 11, etc.)

## References
- "factors_variables" — expands on memory locations used by routines listed here
