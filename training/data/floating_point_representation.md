# Floating-point representation (Commodore BASIC — Appendix F)

**Summary:** Describes Commodore floating-point formats used by BASIC/FORTH: Packed (5-byte) and Unpacked (6-byte) layouts, exponent rules (exponent = 0 → zero; exponent > $80 moves decimal point right), mantissa/sign encoding, and a worked example for +27 (exponent $85, mantissa $D8 / packed as $58).

## Packed format
Packed format is the 5-byte form used in variables and arrays.

- Layout: 1 exponent byte followed by 4 mantissa bytes.
- The mantissa is stored as a 32-bit value; the high bit of the first mantissa byte is repurposed as the sign bit (0 = positive, 1 = negative).
- There is no separate sign byte; the sign overwrites the mantissa's top bit.

Conceptually:
- Exponent byte = zero flag / exponent (if zero → entire value = 0).
- Mantissa = 4 bytes, with top bit as sign.

## Unpacked format
Unpacked format is the 6-byte form used in floating-point accumulators.

- Layout: 1 exponent byte, 4-byte mantissa with an explicit leading-1 bit (normalised: 1mmmmmmm ...), and a separate sign byte.
- The sign byte contains only the sign in its high-order bit (other bits ignored).
- Exponent = 0 → value is zero.

## Rules / interpretation
- If exponent = $00, the entire number is zero.
- Exponent relative position rule:
  - If exponent > $80, the binary point is shifted to the right by (exponent - $80) positions — the value has an integer part.
  - If exponent <= $80, the value is a fraction less than 1.
- Example given by source: exponent $83 and a mantissa with bits 11000000... → shift point 3 places right → value 110.000... = 6.
- Pack/unpack behavior:
  - Packed: sign replaces mantissa high bit.
  - Unpacked: mantissa contains a leading 1 bit (1mmmmmmm) and sign is in a separate sign byte's high bit.

**[Note: Source may contain an error — the example packed bytes are inconsistent within the source; see Source Code for both variants and the explanation below.]**

## Example: represent +27
Steps shown in the source:

- 27 decimal = 11011 (binary).
- Make mantissa bits: 11011 000... (binary), i.e. mantissa starts 11011000 00000000 00000000 00000000.
- Exponent must encode the binary point shifted so the integer part appears: exponent = $85 (since $80 + 5 = $85, shifting point 5 positions).
- Mantissa (unpacked normalized form) = %11011000 00000000 00000000 00000000 → hex $D8 00 00 00.

Packing for storage:
- For a positive number, sign bit = 0; store sign in high bit of first mantissa byte.
- Replace mantissa high bit with sign: original first mantissa byte $D8 = 11011000b; replacing the top bit with 0 yields 01011000b = $58.
- Therefore the correct packed 5-byte representation is: $85 $58 $00 $00 $00.

(The source text contains both "$85 $D8 $00 $00 $00" and "$85 $58 $00 $00 $00"; the latter is the correct packed form after placing the sign bit in the mantissa high bit.)

## Source Code
```text
Packed:  5 bytes (as found in variable or array)

+--------+   +--------+--------+--------+--------+
|eeeeeeee|   |smmmmmmm|mmmmmmmm|mmmmmmmm|mmmmmmmm|
+--------+   +--------+--------+--------+--------+

Zero Flag/           Mantissa (value)
Exponent                  4 bytes
             High bit represents sign of mantissa

Unpacked:  6 bytes (as found in floating point accumulators)

+--------+   +--------+--------+--------+--------+   +--------+
|eeeeeeee|   |1mmmmmmm|mmmmmmmm|mmmmmmmm|mmmmmmmm|   |sxxxxxxx|
+--------+   +--------+--------+--------+--------+   +--------+

Zero Flag/           Mantissa (value)                Sign (High
Exponent                  4 bytes                    Order Bit
             High bit represents sign of mantissa      Only)

- If exponent = 0, the whole number = 0
- If exponent > $80, the decimal point is to be set as many places to the
  right as the exponent exceeds $80.
- Example:  Exponent:  $83, mantissa:  11000000... binary.  Set the point
  three positions over:  110.000... to give a value of 6.
- If exponent <= $80, the number is a fraction less than 1.

Exercise:  Represent +27 in Floating Point

27 decimal = 11011 binary; mantissa = 11011000... the point is to be
positioned 5 places in (11011.000...) so we get:

  Exponent:  $85
  Mantissa:  %11011000 00000000 00000000 00000000
             $D8 00 00 00

To pack, we replace the first bit of the mantissa with a sign bit (0 for
positive) and arrive at:

  85 58 00 00 00

Note: earlier in the source the bytes were also shown as "85 D8 00 00 00" — that is inconsistent with the described packing rule above. The correct packed form after inserting the sign bit (0) into the mantissa's high bit is "85 58 00 00 00".
```

## References
- "MACHINE - Appendix F" — Floating Point Representation (original source)
