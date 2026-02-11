# C64 BASIC — Expression operator precedence (Hierarchy of Operations)

**Summary:** Lists operator precedence for Commodore 64 BASIC: ^ (exponentiation), unary - (negation), * and /, + and -, relational operators (> = <) evaluated left-to-right, then logical NOT, AND, OR; parentheses override order and may nest up to ten levels.

## Hierarchy of operations
- Parentheses:
  - Parentheses create subexpressions evaluated before outside parts.
  - They must be paired; an unequal number yields ?SYNTAX ERROR.
  - Parentheses may be nested to a maximum depth of ten matching sets. The innermost expression is evaluated first.
- General evaluation rules:
  - Arithmetic and logical operators have internal precedence (see list below).
  - Relational operators (>, <, =) have no internal precedence relative to one another and are evaluated left-to-right as the expression is processed.
  - When remaining operators have the same precedence level, evaluation proceeds left-to-right.
  - The NOT operator operates as logical NOT using integer two's complement semantics (per source).
- Precedence from highest to lowest:
  1. ^ (exponentiation)
  2. unary - (negation)
  3. * and / (multiplication and division)
  4. + and - (addition and subtraction)
  5. Relational operators: >  =  <  (evaluated left-to-right)
  6. NOT (logical NOT; integer two's complement)
  7. AND (logical AND)
  8. OR (logical OR)
- Examples (literal from source):
  - A+B
  - C^(D+E)/2
  - ((X-C^(D+E)/2)*10)+1
  - GG$>HH$
  - JJ$+"MORE"
  - K%=1 AND M<>X
  - K%=2 OR (A=B AND M<X)
  - NOT (D=E)

## Source Code
```text
Table 1-3. Hierarchy of Operations Performed on Expressions

+---------------+---------------------------------+---------------------+
|   OPERATOR    |           DESCRIPTION           |       EXAMPLE       |
+---------------+---------------------------------+---------------------+
|       ^       |    Exponentiation               |      BASE ^ EXP     |
|       -       |    Negation (Unary Minus)       |         -A          |
|      * /      |    Multiplication / Division    |   AB * CD   EF / GH |
|      + -      |    Addition / Subtraction       |   CNT + 2   JK - PQ |
|     > = <     |    Relational Operations        |       A <= B        |
|      NOT      |    Logical NOT                  |        NOT K%       |
|               |    (Integer Two's Complement)   |                     |
|      AND      |    Logical AND                  |      JK AND 128     |
|      OR       |    Logical OR                   |       PQ OR 15      |
+---------------+---------------------------------+---------------------+
```

```text
Example expressions (from source):
A+B
C^(D+E)/2
((X-C^(D+E)/2)*10)+1
GG$>HH$
JJ$+"MORE"
K%=1 AND M<>X
K%=2 OR (A=B AND M<X)
NOT (D=E)
```

## References
- "arithmetic_operations" — expands on arithmetic operator precedence examples
- "string_operations_and_concatenation" — expands on how concatenation interacts with expression evaluation