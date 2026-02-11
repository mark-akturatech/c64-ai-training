# $FFF0 — KERNAL: Read/Set X,Y cursor position

**Summary:** KERNAL vector $FFF0 reads or sets the screen cursor position using the CPU carry flag and the X/Y registers. With carry=1 it loads the current cursor column into X and row into Y; with carry=0 it moves the cursor to the column in X and row in Y.

## Description
JSR $FFF0 implements a two-mode cursor service:
- Carry = 1 (set): the routine returns the current cursor location by loading the column number into X and the row number into Y.
- Carry = 0 (clear): the routine places the cursor at the location specified by the X register (column) and the Y register (row).

Call convention:
- Execute JSR $FFF0.
- Set or clear the CPU carry flag before the call to select read or write mode.
- Provide column in X and row in Y when moving the cursor (carry clear).
- After a read (carry set) retrieve column from X and row from Y.

## Key Registers
- $FFF0 - KERNAL - Read/Set cursor X (column) and Y (row) using carry flag (carry=1 read into X/Y; carry=0 write X/Y)

## References
- "ffed_return_xy_organization_of_screen" — expands on screen X,Y extents and organization
