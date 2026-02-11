# Decimal to Hexadecimal (repeated-division-by-16)

**Summary:** Repeated-division-by-16 algorithm (remainders give hex digits right-to-left), fraction-to-hex lookup table for calculator work, and a worked example converting decimal 4780 to $12AC.

## Method
Divide the decimal value by 16 repeatedly; each division's remainder is the next hexadecimal digit, produced from least-significant (rightmost) to most-significant (leftmost). For calculators that do not report integer remainders, use the fractional portion of the quotient and a fraction-to-hex lookup to determine the corresponding hex digit. Continue dividing the integer quotient by 16 until the quotient is zero; the collected remainders (or mapped fractional digits) form the hexadecimal number when read in reverse order.

## Notes
- Fraction lookup (fractions expressed in binary/decimal of 1/16) maps fractional parts of the quotient to hex digits; useful when a calculator shows decimal fractions but not remainders.
- Other methods (binary grouping, table lookups, specialized algorithms or calculators) exist and may be more convenient for large numbers.
- Numeric interpretation depends on context: memory locations or values may represent characters, instructions, or packed fields — conversion is a numeric representation only.

## Source Code
```text
Fraction-to-hex table (fractions of 1, i.e. multiples of 1/16)
.0000 - 0    .2500 - 4    .5000 - 8    .7500 - C
.0625 - 1    .3125 - 5    .5625 - 9    .8125 - D
.1250 - 2    .3750 - 6    .6250 - A    .8750 - E
.1875 - 3    .4375 - 7    .6875 - B    .9375 - F

Worked example: convert decimal 4780 to hexadecimal
1) 4780 ÷ 16 = 298.75     -> fractional .75  => hex digit C
   Last digit: C
2) 298 ÷ 16 = 18.625      -> fractional .625 => hex digit A
   Last two digits: AC
3) 18 ÷ 16 = 1.125        -> fractional .125 => hex digit 2
   Last three digits: 2AC
4) Quotient 1 is < 16; place it as most-significant digit:
   Result: $12AC
```

## References
- "hexadecimal_notation" — explains why hex is used to represent binary values
- "number_ranges" — applies conversions when interpreting addresses or values