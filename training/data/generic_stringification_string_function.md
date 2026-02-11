# Kick Assembler: .string() — convert any value to a string

**Summary:** Kick Assembler's general .string() function returns the string representation of any value for use in assembler expressions and directives (e.g. .print). Works with chaining of string methods such as .charAt() and .size().

## Usage
.string() is called on an arbitrary value to obtain its textual representation. The returned string can be chained to Kick Assembler's string methods (for example .charAt(index) to extract a character, or .size() to get length).

Example behavior (from source):
- .print 1234.string().charAt(2) — evaluates .string() on the number 1234, then .charAt(2) to select the third character (0-based), resulting in '3'.

(If you need a full list of available string methods and additional formatting helpers for numbers, see the References below.)

## Source Code
```asm
; Example from documentation:
.print 1234.string().charAt(2)   ; Prints 3
```

## References
- "string_methods_overview" — expands on Once you have a string (via .string()), you can use methods like charAt and size
- "numeric_to_string_functions" — expands on Alternate formatting helpers when converting numbers to strings