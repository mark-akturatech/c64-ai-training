# COMMODORE 64 — SPC(numeric)

**Summary:** SPC(numeric) is a Commodore 64 BASIC string function used with PRINT to insert a run of spaces for output formatting. Argument ranges: screen/tape 0–255, disk up to 254; for printer output printing a space in the last character position causes the printer to perform an automatic CR+LF (no spaces printed on the following line).

## Description
Syntax: SPC(<numeric>)

- SPC returns a string consisting of <numeric> space characters and is typically used directly in PRINT statements to control horizontal spacing.
- Spaces are printed starting at the first available output position.
- Allowed numeric ranges: screen and tape files accept 0–255; disk files accept up to 254.
- Printer behavior: if a space from SPC is printed in the last character position of a printed line, the printer performs an automatic carriage-return and line-feed; any SPC spaces do not continue onto the next line.
- SPC is commonly used alongside TAB (see "tab_function") for column positioning; SPC inserts an explicit count of spaces rather than moving to a specific column.

## Source Code
```basic
10 PRINT"RIGHT "; "HERE &";
20 PRINT SPC(5)"OVER" SPC(14)"THERE"
RUN
```

Output produced:
```text
RIGHT HERE &     OVER              THERE
```

## References
- "tab_function" — expands on TAB (column positioning) used for formatting output