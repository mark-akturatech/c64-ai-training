# Kick Assembler — Boolean-generating operators (Table 5.1)

**Summary:** List of Kick Assembler boolean-generating operators (==, !=, >, <, >=, <=), their tokens, example expressions, and precise truth conditions; defined for numeric values, with equality/inequality valid for booleans.

## Operator reference
The standard operators that produce Boolean values in Kick Assembler:

| Name | Operator | Example expression | Description |
|---|---:|---|---|
| Equal | == | a==b | True if a equals b, otherwise false. |
| Not Equal | != | a!=b | True if a does not equal b, otherwise false. |
| Greater | > | a>b | True if a is greater than b, otherwise false. |
| Less | < | a<b | True if a is less than b, otherwise false. |
| Greater than or equal | >= | a>=b | True if a is greater than or equal to b, otherwise false. |
| Less than or equal | <= | a<=b | True if a is less than or equal to b, otherwise false. |

Notes:
- All operators are defined for numeric values. For non-numeric types only a subset may be defined.
- Boolean values can be compared for equality/inequality only (==, !=); ordering comparisons (>, <, >=, <=) are not defined for booleans.
- Parentheses may be used to group subexpressions (e.g. true != (10 < 20)).

## Source Code
```text
; Kick Assembler examples demonstrating boolean comparisons
.var b1 = true==true
; Sets b1 to true

.var b2 = true!=(10<20)
; (10<20) evaluates to true, so true != true -> false; b2 set to false

; Generic expression examples (not Kick-specific declarations)
; a==b
; a!=b
; a>b
; a<b
; a>=b
; a<=b
```

## Key Registers
(omitted — this chunk does not document hardware registers)

## References
- "branching_and_looping_intro_and_boolean_examples" — Introduction and boolean variable assignment examples
- "boolean_logical_operators" — Boolean logical operators (!, &&, ||) and combining/negating boolean values