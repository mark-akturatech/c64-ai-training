# Read/Set Cursor X,Y (wrapper at $FFF0 → $E50A)

**Summary:** ROM wrapper at $FFF0 that JMPs to $E50A; call with carry set to read the current screen cursor into X (column) and Y (row), or with carry clear to move the cursor using X and Y. Addresses: $FFF0, $E50A.

**Description**
This small KERNAL wrapper provides a single-entry interface to a cursor read/set routine located at $E50A. Behavior is selected by the CPU carry flag:

- Carry = 1: read current cursor position; X ← column (cursor X), Y ← row (cursor Y).
- Carry = 0: set cursor position from X (column) and Y (row).

The wrapper at $FFF0 is a JMP to $E50A; the full implementation and edge cases live at $E50A.

The routine uses the X and Y index registers for input/output as described. The accumulator (A) is preserved during the operation. No other register preservation or side effects are specified.

## Source Code
```asm
.; wrapper and documentation
.; read/set X,Y cursor position
.; this routine, when called with the carry flag set, loads the current position of
.; the cursor on the screen into the X and Y registers. X is the column number of
.; the cursor location and Y is the row number of the cursor. A call with the carry
.; bit clear moves the cursor to the position determined by the X and Y registers.
.,FFF0 4C 0A E5 JMP $E50A       read/set X,Y cursor position
```

## Key Registers
- $FFF0 - KERNAL ROM - JMP wrapper entry to cursor read/set routine ($E50A)
- $E50A - KERNAL ROM - cursor read/set implementation

## References
- Commodore 64 Programmer's Reference Guide
- C64-Wiki: PLOT (KERNAL)