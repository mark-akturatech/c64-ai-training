# COMMODORE 64 — Logical operators AND, OR, NOT (BASIC)

**Summary:** Logical operators AND, OR, NOT (and the exclusive OR used by WAIT) are bitwise integer operations in Commodore 64 BASIC; operands must be integers in the range -32768 to +32767. Floating-point values are converted to integers by truncation toward zero before the logical operation, and results are integers. NOT is a unary operator applied only to its right operand; nonzero results are treated as true.

**Description**
- **Operands:** Logical operators operate on integers in the range -32768 to +32767. Floating-point numbers are converted to integers before the logical operation by truncation toward zero, meaning any fractional part is discarded. For example, 3.9 becomes 3, and -3.9 becomes -3. ([cs.cmu.edu](https://www.cs.cmu.edu/~rbd/papers/cmj-float-to-int.html?utm_source=openai))
- **Result type:** Logical operations produce an integer result.
- **Bitwise operation:** Logical operations are performed bit-by-corresponding-bit on the operand(s).
  - **AND:** Each result bit is 1 only if both corresponding operand bits are 1.
  - **OR:** Each result bit is 1 if either corresponding operand bit is 1.
  - **NOT:** A unary operator that inverts each bit of the single operand to its right (applies only to the right operand).
  - **XOR (exclusive OR):** Not provided as an explicit general operator in BASIC but is performed by the WAIT statement; result bit is 1 if the operand bits differ, 0 if they are equal.
- **Boolean interpretation:** Nonzero integer results are considered true (zero is false).
- **Truth table:** The following table defines the Boolean operations AND, OR, NOT, and XOR:

  | A | B | A AND B | A OR B | A XOR B | NOT A |
  |---|---|---------|--------|---------|-------|
  | 0 | 0 |    0    |   0    |    0    |   1   |
  | 0 | 1 |    0    |   1    |    1    |   1   |
  | 1 | 0 |    0    |   1    |    1    |   0   |
  | 1 | 1 |    1    |   1    |    0    |   0   |

  In this table, 0 represents false, and 1 represents true. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Truth_table?utm_source=openai))

## References
- "boolean_truth_table" — expands on truth table for AND/OR/NOT/XOR
