# Logical operators (AND, OR, NOT) in Commodore 64 BASIC

**Summary:** Describes Commodore 64 BASIC logical operators AND, OR and NOT, their evaluation order (after arithmetic and relational ops), that NOT only considers the right-hand operand, examples showing bitwise behavior (e.g. A = 96 AND 32 → 32) and NOT producing two's-complement results (e.g. NOT 96 → -97).

## Behavior and evaluation
- AND, OR and NOT perform Boolean (bitwise) arithmetic on numeric expressions.
- Logical operations are evaluated only after all arithmetic and relational operations in an expression have been completed.
- For NOT, only the operand on the right is considered (NOT applies to one operand).
- Examples below illustrate that AND/OR operate bitwise on whole numeric operands and NOT produces a two's-complement result for the numeric bitwise inversion.

## Examples and notes
- IF A=100 AND B=100 THEN 10
  - True if both A and B equal 100 (relational comparisons complete first, then the logical operation yields a true/false result).
- A=96 AND 32 : PRINT A
  - Result shown: A = 32 (bitwise AND of 96 and 32 yields 32).
- IF A=100 OR B=100 THEN 20
  - True if either A or B equals 100.
- A=64 OR 32 : PRINT A
  - Result shown: A = 96 (bitwise OR of 64 and 32 yields 96).
- IF NOT X<Y THEN 30
  - True when X >= Y (NOT reverses the result of the relational test).
- X = NOT 96
  - Result shown: X = -97 (NOT produces the two's-complement negative of the bitwise inversion).

## Source Code
```basic
10 REM Logical operator examples (Commodore 64 BASIC)
20 A=100 : B=100
30 IF A=100 AND B=100 THEN 100
40 IF A=100 OR B=100 THEN 110
50 A=96 AND 32 : PRINT "A =";A       : REM prints: A = 32
60 A=64 OR 32  : PRINT "A =";A       : REM prints: A = 96
70 X=10 : Y=20
80 IF NOT X<Y THEN 120               : REM false because X<Y is true, NOT makes it false
90 X = NOT 96                         : REM results in -97
100 END
```

## References
- "logical_operators_overview" — expands on bitwise and logical operator examples