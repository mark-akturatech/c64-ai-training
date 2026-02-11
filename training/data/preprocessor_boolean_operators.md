# Kick Assembler — Preprocessor Boolean Operators (Section 8.5)

**Summary:** Description of preprocessor boolean operators used with #if, #elif, and #importif in Kick Assembler: symbols act as booleans (defined/undefined) and may be combined with !, &&, ||, ==, !=, and parentheses; includes example usages and a reference pointer.

**Operators and Semantics**

A symbol in the Kick Assembler preprocessor is treated as a boolean: it is either defined (true) or not defined (false). The #if, #elif, and #importif directives evaluate an expression containing symbols, operators, and parentheses and yield true or false.

Supported operators:

- `!` — Negation (logical NOT)
- `&&` — Logical AND
- `||` — Logical OR
- `==` — Equality operator
- `!=` — Inequality operator
- Parentheses — Grouping to control evaluation order

**Operator Precedence and Associativity:**

- `!` (logical NOT) has the highest precedence.
- `&&` (logical AND) has higher precedence than `||` (logical OR).
- `==` (equality) and `!=` (inequality) have lower precedence than `&&` and `||`.

Operators are evaluated in the following order:

1. `!` (logical NOT)
2. `&&` (logical AND)
3. `||` (logical OR)
4. `==` (equality) and `!=` (inequality)

Parentheses can be used to explicitly define the evaluation order.

**Equality (`==`) and Inequality (`!=`) Operators:**

- `==` returns true if both operands are defined or both are undefined; otherwise, it returns false.
- `!=` returns true if one operand is defined and the other is undefined; otherwise, it returns false.

## Source Code

```asm
; Examples from the source

#if !DEBUG && !COMPLICATED
    ; some stuff
#endif

#if DEBUG || (X && Y && Z) || X==DEBUG
    ; Note that you can also use parenthesis
#endif

#importif DEBUG&&STANDALONE "UpstartWithDebug.asm"
```

```text
Table 8.2. Preprocessor operators
Operator    Description
!           Negates the expression
&&          Logical and.
||          Logical or.
==          Returns true if both operands are defined or both are undefined; otherwise, false.
!=          Returns true if one operand is defined and the other is undefined; otherwise, false.
()          Parentheses can be used to control the order of evaluation.
```

## References

- "preprocessor_directives_reference_table" — expands on the list of preprocessor directives where these operators appear.