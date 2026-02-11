# Kick Assembler — Script Language: Expressions (Chapter 4.1)

**Summary:** Describes Kick Assembler's integrated expression evaluation mechanism and supported value types (Numbers, Booleans, Strings, Lists, Vectors, Matrixes). Shows how expressions are used in assembler directives and how object-oriented value methods (e.g. get, getX) can be called inside expressions.

## Expressions
Kick Assembler evaluates expressions in many assembler contexts (variables, directive operands, byte/data definitions). Expressions may combine arithmetic, comparison and method calls and are evaluated against value types beyond plain numbers: Numbers, Booleans, Strings, Lists, Vectors, and Matrixes.

Expressions can appear wherever a numeric or computed assembler value is allowed (for example to compute a variable or to define a byte). The assembler treats operators (+, -, *, /, ==, !=, etc.) as functions that are specially defined for each value type. The language has an object-oriented style: functions (methods) can be called on values/objects and dispatch behaviour appropriate to the value type.

Examples of evaluation contexts (descriptive only — code examples are in the Source Code section):
- Arithmetic expressions combined with variables or labels to produce immediate operands or data bytes.
- Method calls on Lists and Vectors to extract elements or coordinates; method chaining is supported (e.g. access a vector from a list, then call a vector method).
- Operators are resolved per-type, so + between different types behaves according to their defined methods.

A small clarifying note retained from the source: Kick Assembler uses zero-based indexing for lists (so get(1) returns the second element).

In later chapters the individual value types and their available functions/methods are described in detail.

## Source Code
```asm
; Example: arithmetic expression used in immediate and data directives
lda #25+2*3/x
.byte 25+2*3/x

; Examples using Lists and Vectors (script-language expressions embedded in assembler)
; 1 because first element is number 0
lda #35+myList.get(1)

; get X coordinate from a vector
lda #35+myVector.getX()

; get X coordinate from the third vector in a list
lda #35+myVectorList.get(2).getX()
```

## References
- "variables_constants_and_labels" — expands on variables, constants and user-defined labels in script language (Section 4.2)
- "functions_define" — expands on defining and calling script functions