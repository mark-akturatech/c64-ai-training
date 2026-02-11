# .MIN (ca65 builtin function)

**Summary:** .MIN is a ca65 assembler builtin that returns the smaller of two numeric values. Commonly used in assembly-time expressions (examples: sizing with .res, .sizeof).

## Description
Syntax:
.M I N (<value #1>, <value #2>)

(.MIN evaluates at assemble time and yields the lesser of the two supplied values.)

Typical usage is to clamp or limit sizes and constants. Example use-case: reserve a block whose size is the smaller of a computed size and a maximum (so you never allocate more than a fixed limit).

Short clarifications:
- .res (reserve) — assembles uninitialized space of the given size.
- .sizeof (symbol size) — returns the size (in bytes) of the given symbol/definition.

## Source Code
```asm
; Syntax example
.MIN (<value #1>, <value #2>)

; Reserve space for some data, but 256 bytes maximum
savearea:       .res .min (.sizeof (foo), 256)
```

## References
- "max_value" — expands on related function that returns the larger of two values (.MAX)
- ".MAX" — related builtin returning the larger of two values
