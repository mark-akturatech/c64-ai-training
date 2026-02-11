# PEEK

**Summary:** PEEK is a Commodore BASIC integer function that reads a byte (0–255) from a memory location (0–65535). Use PEEK(<numeric>); out-of-range addresses produce ?ILLEGAL QUANTITY. Common addresses: 53280 ($D020) border color, zero-page pointers at 45/46 ($002D/$002E).

## Description
PEEK(<numeric>) returns the unsigned 8-bit value stored at the specified memory address. The argument must be a numeric expression in the inclusive range 0–65535; otherwise BASIC signals the error ?ILLEGAL QUANTITY. The function result is an integer 0–255.

Typical uses:
- Read VIC-II border color at decimal 53280 (hex $D020).
- Read a two-byte pointer stored low/high in consecutive addresses, e.g. PEEK(45)+PEEK(46)*256 to assemble a 16-bit address (45 = low byte, 46 = high byte; decimal 45 = $002D, 46 = $002E).

Syntax summary:
- Type: Integer function
- Format: PEEK(<numeric>)
- Return: 0–255 (byte read from memory)

Behavior notes:
- Reads from RAM or I/O space depending on the address supplied.
- When assembling a 16-bit address from two bytes, use low + high*256 (little-endian).

## Source Code
```basic
10 PRINT PEEK(53280) AND 15    REM Returns value of screen border color
5 A%=PEEK(45)+PEEK(46)*256     REM Returns address of BASIC variable table
```

## Key Registers
- $D020 - VIC-II - Border color register (decimal 53280)
- $002D-$002E - RAM - BASIC variable table pointer (low/high bytes; decimal 45/46)

## References
- "poke_statement" — POKE writes to memory addresses read by PEEK