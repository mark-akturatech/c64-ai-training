# OR operator (BASIC)

**Summary:** The OR operator in Commodore BASIC performs a bitwise OR on 16-bit signed two's-complement integers when used in calculations and acts as a logical OR in comparisons (compound Boolean expression true if either operand is true, represented as -1).

## Description
- Type/format: Logical operator — <operand> OR <operand>.
- Numeric behavior (calculations): Both operands are converted to 16-bit signed two's-complement integers (range -32768 to +32767). Each bit of the result is 1 if the corresponding bit of either or both operands is 1; the numeric result is the integer value of that bit pattern. If an operand is outside the 16-bit signed range, an error occurs.
- Boolean behavior (comparisons): OR links two expressions; if either expression is true the combined expression evaluates to true, represented by the value -1 (all bits set in two's-complement).
- Important: The operator is overloaded — use it for bitwise combination of integers, and for logical combination of comparison expressions (e.g., (A=B) OR (X=20)).

## Source Code
```basic
100 IF (AA=BB) OR (XX=20) THEN...

230 KK%=64 OR 32: PRINT KK%
```

Example output/comments (from source):
```text
(You typed this with a bit value of 1000000 for 64
 and 100000 for 32)

96  (The computer responded with bit value 1100000. 1100000 = 96.)
```

## References
- "not_logical_operator" — expands on NOT operator and two's-complement behavior
