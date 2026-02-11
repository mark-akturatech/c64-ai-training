# .MAX (ca65 builtin)

**Summary:** .MAX (also shown as .max) is a ca65 builtin function that returns the larger of two numeric values; commonly used with assembler expressions such as .res and .sizeof to allocate space. Syntax appears as .MAX (<value #1>, <value #2>).

## Description
.MAX evaluates two numeric expressions and yields the greater value. It is a compile-time builtin suitable for assembler expressions and data-size calculations. Typical use is to choose the larger of two sizes (for example, between two data blocks) when reserving storage.

## Source Code
```asm
; Syntax
.MAX (<value #1>, <value #2>)

; Example: Reserve space for the larger of two data blocks
savearea:       .res .max (.sizeof (foo), .sizeof (bar))
```

## References
- "min_value" — .MIN: related function that returns the smaller of two values