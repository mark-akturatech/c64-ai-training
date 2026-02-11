# .REF / .REFERENCED (ca65)

**Summary:** ca65 builtin function .ref / .referenced evaluates a symbol identifier in parentheses and yields true if that symbol has already been referenced earlier in the source up to the current assembly position; otherwise yields false. Commonly used in conditional assembly (example: .if .referenced(a)). See .DEFINED for related checks.

## Description
.ref (alias .referenced) is a ca65 builtin function that takes an identifier in parentheses. The identifier argument is evaluated, and the function returns true if that identifier corresponds to a symbol that has been referenced anywhere in the source file prior to the current assembly position. If the symbol has not yet been referenced (even if it is defined later), the function yields false.

Key semantic points:
- The check is position-sensitive: only references that occur earlier in the source (up to the current point) count.
- The function tests whether the symbol has been referenced, not whether it has been defined. Use .DEFINED to test definition status.
- It can replace legacy or alternative constructs such as .IFREF when used in conditional assembly expressions.

## Source Code
```asm
; Example: replace .IFREF with .if .referenced(a)
.if     .referenced(a)
    ; conditional assembly when symbol 'a' was referenced earlier
.endif
```

## References
- "defined_symbol_query" — expands on related concept/function .DEFINED (checks whether a symbol is defined)