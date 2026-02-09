# Boolean Truth Table — AND, OR, NOT, XOR (bit-level examples)

**Summary:** Boolean bitwise operations AND, OR, NOT, and XOR truth tables with per-bit examples (applies per bit to integer operands). Corrected truth tables and clarification regarding the use of XOR in the WAIT statement.

**Truth tables and behavior**

- **AND:** Result bit is 1 only when both input bits are 1.
  - 1 AND 1 = 1
  - 1 AND 0 = 0
  - 0 AND 1 = 0
  - 0 AND 0 = 0

- **OR:** Result bit is 1 when either input bit is 1.
  - 1 OR 1 = 1
  - 1 OR 0 = 1
  - 0 OR 1 = 1
  - 0 OR 0 = 0

- **NOT:** Bitwise logical complement (unary).
  - NOT 1 = 0
  - NOT 0 = 1

- **XOR (exclusive OR):** Result bit is 1 when bits differ.
  - 1 XOR 1 = 0
  - 1 XOR 0 = 1
  - 0 XOR 1 = 1
  - 0 XOR 0 = 0

**Note:** The exclusive OR (XOR) operation is utilized within the `WAIT` statement in Commodore 64 BASIC. The `WAIT` command suspends program execution until a specified memory location matches a given bit pattern. The syntax is `WAIT <address>,<mask-1>[,<mask-2>]`. In this context, the contents of the memory location are first exclusive-ORed with `mask-2` (if provided) and then ANDed with `mask-1`. This allows the program to wait for specific bit conditions to be met. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_2/page_092.html?utm_source=openai))

## References

- "logical_operators_overview" — expands definitions and integer operand requirements