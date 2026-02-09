# AND (BASIC operator)

**Summary:** AND is the Commodore 64 BASIC bitwise/logical operator (format: <expression> AND <expression>). Operates on 16-bit integer range -32768..+32767 (fractional parts ignored); comparison results convert to -1/0 (all 1s/all 0s in two's-complement).

## Description
AND performs a bitwise AND on the 16-bit binary representations of two integer operands. Each corresponding bit is ANDed to produce a 16-bit result in the same numeric range. Fractional parts of numeric operands are discarded; values outside -32768..+32767 produce a ?ILLEGAL QUANTITY error.

AND is also used in logical expressions: any nonzero numeric value is considered true; a comparison that is true yields -1 and false yields 0. Because -1 is represented as all 1 bits (two's-complement), combining comparison results or nonzero values with AND yields a nonzero (true) result if any bit in the ANDed result is 1.

The following examples and short tables illustrate 1-bit and 16-bit AND behavior and show BASIC IF usage. (Reference data and complete examples are in the Source Code section.)

## Source Code
```text
1-bit AND truth table:

    0 AND 0 -> 0
    0 AND 1 -> 0
    1 AND 0 -> 0
    1 AND 1 -> 1
```

```text
16-bit AND examples:

Example 1:
   17  (decimal) -> 0000000000010001 (binary)
  194  (decimal) -> 0000000011000010 (binary)
  -------------------------------------------
  AND result      0000000000000000 (binary) -> 0 (decimal)

Example 2:
 32007 -> 0111110100000111 (binary)
 28761 -> 0111000001011001 (binary)
 ----------------------------------
 AND    0111000000000001 (binary) -> 28673 (decimal)

Example 3:
  -241 -> 1111111100001111 (binary)  (two's-complement)
 15359 -> 0011101111111111 (binary)
 ----------------------------------
 AND    0011101100001111 (binary) -> 15119 (decimal)
```

```basic
BASIC examples (usage with truth tests):

50 IF X=7 AND W=3 THEN GOTO 10     : REM only true if both X=7 and W=3 are true
60 IF A AND Q=7 THEN GOTO 10       : REM true if A is non-zero and Q=7 is true
```

```text
Notes:
- Numeric range: -32768 .. +32767 (fractional values ignored).
- Out-of-range values cause ?ILLEGAL QUANTITY.
- Comparison true -> -1 (all 1 bits); false -> 0 (all 0 bits).
```

## References
- "boolean_truth_table" — expands on AND truth behaviors