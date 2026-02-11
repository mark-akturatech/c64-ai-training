# Relational and Logical Operators (BASIC)

**Summary:** Describes BASIC relational operators (<, =, >, <=, >=, <>) and logical operators (AND, OR, NOT); results are integer true/false values (-1 for true, 0 for false), strings compared character-by-character using PET/CBM character codes, mismatched operand types produce ?TYPE MISMATCH, numeric operands are converted to floating point for comparison.

**Relational operators — semantics**

The relational operators compare two operands and produce an arithmetic true/false value:
- Operators: < (LESS THAN), = (EQUAL TO), > (GREATER THAN), <= (LESS THAN OR EQUAL TO), >= (GREATER THAN OR EQUAL TO), <> (NOT EQUAL TO).
- Result: -1 when the relation is true, 0 when false. The result is always an integer (even when both operands are strings).
- The integer result may be used as an operand in expressions (e.g., added, subtracted, used in conditionals), but it must not be used as a divisor (division by zero is illegal).

Numeric comparison rules:
- Numeric operands are compared after converting either or both values from integer to floating-point as necessary; the floating-point values are then compared.

String comparison rules:
- Strings are compared lexicographically by evaluating corresponding characters from left to right.
- Character ordering follows the PET/CBM character codes (A < B < C < ...).
- Comparing strings of different types (numeric vs string) or otherwise incompatible types triggers ?TYPE MISMATCH.

Examples from source:
- 1 = 5-4         => result true (-1)
- 14 > 66         => result false (0)
- 15 >= 15        => result true (-1)
- "A" < "B"       => result true (-1)
- "X" = "YY"      => result false (0)
- BB$ <> CC$      => (example of string NOT EQUAL; result depends on contents of BB$, CC$)

**Logical operators — semantics**

- Logical operators (AND, OR, NOT) can modify relational expressions or produce arithmetic results.
- These operators are sometimes called Boolean operators.
- They can produce values other than -1 and 0; any nonzero result is treated as true in conditional tests.
- The logical operators can also operate on individual binary digits (bits) of two operands (bitwise operations).

**NOT Operator:**
- The NOT operator performs a bitwise logical inversion on its operand.
- Each bit of the operand is inverted: bits that are 0 become 1, and bits that are 1 become 0.
- The result is the two's complement of the operand minus one. In other words, `NOT x = -x - 1`.
- Example:
  - `NOT 5` (binary 00000101) results in -6 (binary 11111010).
- The operand must be an integer within the range -32768 to +32767; using a non-integer or out-of-range value triggers an error.

**AND and OR Operators:**
- When used in bitwise operations, AND and OR produce results based on corresponding bits of the operands:
  - **AND**: Each bit in the result is 1 if both corresponding bits of the operands are 1; otherwise, the result bit is 0.
    - Example:
      - `5 AND 3`:
        - 5 in binary: 00000101
        - 3 in binary: 00000011
        - Result: 00000001 (decimal 1)
  - **OR**: Each bit in the result is 1 if at least one of the corresponding bits of the operands is 1; otherwise, the result bit is 0.
    - Example:
      - `5 OR 3`:
        - 5 in binary: 00000101
        - 3 in binary: 00000011
        - Result: 00000111 (decimal 7)
- These operations can yield results other than -1 and 0. Any nonzero result is considered true in conditional tests.

## References
- "string_comparisons_and_results" — expands on detailed string comparison behavior
- Commodore 64 Programmer's Reference Guide: BASIC Programming Rules - Expressions and Operations (cont.)