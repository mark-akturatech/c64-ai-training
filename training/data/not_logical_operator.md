# NOT (logical operator)

**Summary:** NOT is the bitwise complement operator in Commodore 64 BASIC; it complements each bit of its operand producing a two's-complement integer result. Operands are converted to 16-bit signed integers (fractional parts are discarded). NOT can also be applied to a relational expression to invert its true/false value.

## Description
- Action: NOT complements every bit of its single operand and returns the result as a two's-complement integer (16-bit signed). Any fractional part of a numeric operand is discarded during conversion to integer.
- Two uses:
  - Numeric (bitwise) NOT: applied to a numeric value, it returns the bitwise complement. Relation to two's-complement arithmetic: NOT X equals -(X+1).
  - Logical inversion of a comparison: when applied to a relational expression (typically written with parentheses), NOT inverts the Boolean result of that comparison (true ↔ false).
- Example interpretation: in the expression IF NOT AA = BB AND NOT(BB = CC) THEN..., the first NOT complements AA and compares that integer to BB; the second NOT negates the truth of (BB = CC).

## Source Code
```basic
10 IF NOT AA = BB AND NOT(BB = CC) THEN...
NN% = NOT 96: PRINT NN%
```
Output from the second line:
```text
-97
```

```text
NOTE: To find the value of NOT use the expression X = (-(X+1)). (The two's complement of any integer is the bit complement plus one.)
```

## References
- "or_logical_operator" — expands on OR and other logical operators operating on the same integer domain
