# QINT / INT — Convert FAC1 to 4‑byte signed integer; remove fractional part

**Summary:** Routines at $BC9B (QINT) and $BCCC (INT) convert the floating-point FAC1 value to a four‑byte signed integer stored in memory locations 98–101 (decimal) / $62–$65 (hex), MSB first; INT removes the fractional part by calling QINT and then converting that integer back to floating‑point format.

**Description**
- **QINT ($BC9B)**
  - Converts the floating-point accumulator FAC1 into a four‑byte signed integer.
  - The integer is written to memory locations 98–101 (decimal), i.e., $62–$65 (hex), with the most significant byte first (big‑endian order).
  - Negative integers are stored in two's complement representation.
  - The floating-point number in FAC1 must be within the interval [−2³¹−1, 2³¹−1]. ([c64-wiki.com](https://www.c64-wiki.com/wiki/QINT?utm_source=openai))
  - If FAC1 is zero, QINT returns the integer 0 after 32 system cycles. For other values, the conversion time varies based on the magnitude of FAC1, ranging from 93 cycles for positive numbers in the interval [2³⁰, 2³¹−1] to 7361 cycles for very small numbers like 2⁻¹²⁸. ([c64-wiki.com](https://www.c64-wiki.com/wiki/QINT?utm_source=openai))

- **INT ($BCCC)**
  - Removes the fractional part of the floating‑point number in FAC1.
  - Implementation: Calls QINT to produce the four‑byte integer, then converts that integer back into FAC1 in floating‑point format (effectively truncating the original fractional portion).
  - INT also copies the least significant byte of the integer result into memory location 7 ($07). ([c64-wiki.de](https://www.c64-wiki.de/wiki/INT_%28ROM-Routine%29?utm_source=openai))
  - The runtime behavior of INT is similar to QINT, with execution times ranging from 204 to 7579 cycles for positive values and 389 to 8726 cycles for negative values. ([c64-wiki.de](https://www.c64-wiki.de/wiki/INT_%28ROM-Routine%29?utm_source=openai))

- **FAC1 Memory Layout:**
  - FAC1 is a 6-byte floating-point accumulator located at memory addresses $61–$66.
    - **$61**: Sign byte (0 for positive, $FF for negative)
    - **$62**: Exponent byte
    - **$63–$66**: 4-byte mantissa in big-endian order
  - This layout allows for efficient floating-point arithmetic operations. ([files.commodore.software](https://files.commodore.software/reference-material/books/c64-books/c64-programming-books/basic-programming/advanced-commodore-64-basic-revealed.pdf?utm_source=openai))

- **Rounding Mode:**
  - The conversion truncates the fractional part, effectively rounding towards negative infinity. For positive numbers, this is equivalent to rounding toward zero; for negative numbers, it rounds away from zero. ([c64-wiki.com](https://www.c64-wiki.com/wiki/INT?utm_source=openai))

- **Overflow/Underflow Handling:**
  - QINT does not explicitly handle overflow or underflow conditions. If the floating-point value in FAC1 exceeds the representable range of a 32-bit signed integer, the behavior is undefined, and the result may be incorrect. ([c64-wiki.com](https://www.c64-wiki.com/wiki/QINT?utm_source=openai))

- **Test Vectors:**
  - Example inputs and expected outputs:
    - Input: 3.14 → QINT Output: $00000003 → INT Output: 3.0
    - Input: −3.14 → QINT Output: $FFFFFFFD → INT Output: −4.0
    - Input: 2⁻¹²⁸ → QINT Output: $00000000 → INT Output: 0.0
    - Input: −2⁻¹²⁸ → QINT Output: $FFFFFFFF → INT Output: −1.0
  - These examples demonstrate the truncation behavior and handling of small magnitude numbers. ([c64-wiki.com](https://www.c64-wiki.com/wiki/QINT?utm_source=openai))

## Source Code

## Labels
- QINT
- INT
- FAC1
