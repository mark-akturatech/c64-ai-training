# Zero Page $002A-$0036 — BASIC pointers and string/array area

**Summary:** Zero page addresses $002A-$0036 hold BASIC program and variable-area pointers on the C64: BASIC start pointer ($002B-$002C), variable/array/string area start/end pointers, and string allocation size. Searchable terms: $002B-$002C, BASIC start, variable area, array start/end, string start, string alloc, zero page.

## Zero Page Layout ($002A-$0036)
This block of zero-page locations is used by the BASIC interpreter to track the program and dynamic variable storage areas:

- $002A — Unused (no interpreter purpose documented here)
- $002B-$002C — BASIC Start pointer: pointer to program beginning (default $0801)
- $002D-$002E — Variable Area start: start of variables (immediately after program; end-of-program + 1)
- $002F-$0030 — Array Start: beginning of array variable storage
- $0031-$0032 — Array End: end of array variable storage
- $0033-$0034 — String Start: beginning of string variable storage
- $0035-$0036 — String Alloc: allocated memory for the current string area

These pointers are updated by the BASIC interpreter as programs are loaded, edited, and as variables/strings/arrays are allocated or freed.

## Source Code
```text
$002A   Unused
$002B-$002C  BASIC Start        Pointer to program beginning (default: $0801)
$002D-$002E  Variable Area      Start of variables (end of program + 1)
$002F-$0030  Array Start        Beginning of array variables
$0031-$0032  Array End          End of array variables
$0033-$0034  String Start       Beginning of string variables
$0035-$0036  String Alloc       Allocated memory for current string
```

## Key Registers
- $002A - Zero Page - Unused
- $002B-$002C - Zero Page - BASIC start pointer (default $0801)
- $002D-$002E - Zero Page - Variable area start (end of program + 1)
- $002F-$0030 - Zero Page - Array start
- $0031-$0032 - Zero Page - Array end
- $0033-$0034 - Zero Page - String start
- $0035-$0036 - Zero Page - String allocation size

## References
- "basic_program_area" — expands on default BASIC program start at $0801 (search term)

## Labels
- BASIC_START
- VARIABLE_AREA_START
- ARRAY_START
- ARRAY_END
- STRING_START
- STRING_ALLOC
