# POKE

**Summary:** POKE — BASIC statement to write a one-byte (0–255) value to a memory location or I/O register (location 0–65535); related to PEEK, VIC-II sprite pointers, and loading/running assembly.

## Description
POKE is a BASIC statement that stores a single byte (8 bits) into a specified memory address or I/O register.

- Syntax: POKE <location>,<value>
- <location> is an arithmetic expression that must evaluate to an integer in the range 0–65535.
- <value> is an expression that must evaluate to an integer in the range 0–255.
- If either operand is out of range, BASIC produces the error ?ILLEGAL QUANTITY.

Uses:
- Data storage and simple memory manipulation.
- Controlling graphics (e.g., updating screen memory or VIC-II registers such as sprite pointers).
- Sound generation by writing to SID or other I/O registers.
- Loading or patching machine code (writing bytes of an assembly routine into memory).
- Examining or changing Operating System parameters.

Relationship to PEEK:
- PEEK is a built-in function that returns the byte value at a memory location; use PEEK to read memory, POKE to write memory.

Notes:
- A complete memory map of useful locations is referenced in the original manual (Appendix G).
- Examples in the manual show decimal addresses; conversions to hexadecimal ($XXXX) are not supplied here.

## Source Code
```basic
POKE

TYPE: Statement
FORMAT: POKE <location>,<value>

Action: The POKE statement is used to write a one-byte (8-bits) binary
value into a given memory location or input/output register. The
<location> is an arithmetic expression which must equal a value in the
range of 0 to 65535. The <value> is an expression which can be reduced to
an integer value of 0 to 255. If either value is out of its respective
range, the BASIC error message ?ILLEGAL QUANTITY occurs.
  The POKE statement and PEEK statement (which is a built-in function
that looks at a memory location) are useful for data storage, controlling
graphics displays or sound generation, loading assembly language sub-
routines, and passing arguments and results to and from assembly language
subroutines. In addition, Operating System parameters can be examined
using PEEK statements or changed and manipulated using POKE statements.
A complete memory map of useful locations is given in Appendix G.

EXAMPLES of POKE Statement:

  POKE 1024, 1         (Puts an "A" at position 1 on the screen)
  POKE 2040, PTR       (Updates Sprite #0 data pointer)
  10 POKE RED,32
  20 POKE 36879,8
  2050 POKE A,B
```

## References
- "peek_function" — expands on reading memory locations with PEEK
- "sprites_registers_and_pointers" — expands on POKEs used to update sprite pointers and VIC-II registers
- Appendix G (manual) — full memory map of useful locations
