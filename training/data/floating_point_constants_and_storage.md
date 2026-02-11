# Commodore 64 — Floating-point constant format and display rules

**Summary:** Rules for entering and displaying Commodore 64 BASIC floating-point constants: two forms (simple number and scientific notation), no commas allowed in numeric literals, sign/decimal defaults, display limited to nine digits with rounding at the tenth digit, values stored in five bytes and calculated with ten places of accuracy.

**Floating-point constants and input rules**
- Do NOT include commas inside numbers (e.g., type 32000, not 32,000). Commas inside a numeric literal produce ?SYNTAX ERROR.
- Floating-point constants may be positive or negative and may include fractional parts using a decimal point.
- If the leading plus sign (+) is omitted, the number is assumed positive.
- If the decimal point is omitted, it is assumed to follow the last digit (i.e., an integer).
- Leading zeros before a constant are ignored.
- Floating-point constants can be entered in two forms:
  1. **Simple number:** An ordinary decimal fraction or integer.
  2. **Scientific notation:** A floating-point constant in scientific notation consists of three parts:
     - **Mantissa:** A simple floating-point number.
     - **The letter E:** Indicates exponential form, representing multiplication by 10 (e.g., 3E3 = 3 × 10³ = 3000).
     - **Exponent:** A signed integer indicating the power of 10 by which the mantissa is multiplied. The exponent's range is from -39 to +38, indicating the number of places the decimal point in the mantissa would be moved to the left (-) or right (+) if the value were represented as a simple number. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_1/page_006.html?utm_source=openai))

**Display, rounding, storage, and accuracy**
- The screen displays up to nine significant digits for floating-point results.
- Display range (as shown simply) is from -999999999. to +999999999.
- Numbers smaller than 0.01 or larger than 999,999,999 are printed using scientific notation. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_1/page_006.html?utm_source=openai))
- If more than nine digits are entered or generated, the value is rounded using the tenth digit: if the tenth digit is ≥ 5, the displayed nine-digit value is rounded upward; if < 5, it is rounded downward.
- Floating-point values are stored internally using five bytes of memory.
- Calculations are performed with ten places of accuracy internally, but printed/displayed values are rounded to nine digits for output.

**Behavior when values exceed displayable range**
- The largest number that BASIC can handle is ±1.70141183E+38. Calculations resulting in a larger number will display the BASIC error message ?OVERFLOW ERROR. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_1/page_006.html?utm_source=openai))
- The smallest positive floating-point number is ±2.93873588E-39. Calculations resulting in a smaller value give zero as an answer without an error message. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_1/page_006.html?utm_source=openai))

## References
- "scientific_notation_and_limits" — expands on scientific notation form and exponent limits