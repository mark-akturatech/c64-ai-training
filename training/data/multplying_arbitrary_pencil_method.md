# 6502: Schoolbook (Pencil-and-Paper) Multiplication — Decimal Example

**Summary:** Schoolbook (pencil-and-paper) multiplication algorithm for arbitrary integers: operate by extracting digits from the multiplier, multiply the multiplicand by each digit, and add shifted partial products. Mentions binary adaptation (binary_multiplication_algorithm) where digits are bits and shifts are one-bit.

## Algorithm
Multiply two arbitrary multi-digit numbers by repeating the single-digit multiply-and-shift steps used in manual decimal multiplication.

Steps (decimal schoolbook):
- Set the answer to 0.
- Repeat once for each digit of the multiplier (rightmost to leftmost):
  - Remove the rightmost digit of the multiplier.
  - Multiply the multiplicand by that digit.
  - Add the result to the answer, shifted one more place to the left each repetition (i.e., add partial products with increasing place-value shift).

Concise pseudocode (base = decimal radix 10):
```
answer = 0
shift = 0
while multiplier > 0:
    digit = multiplier % base
    multiplier = floor(multiplier / base)
    partial = multiplicand * digit
    answer = answer + (partial * base^shift)
    shift = shift + 1
```

Notes:
- The same algorithm maps directly to binary: base = 2, digits are 0/1, shifts are one bit left per position. (binary adaptation referenced below)

## Source Code
```text
654
 x 321
 -----
654
 1308
1962
------
209934
```

## References
- "binary_multiplication_algorithm" — binary adaptation of the pencil-and-paper multiplication method
- "llx.com" — original source of this description