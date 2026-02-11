# Binary fractions, scaled integers, and multi‑byte signed number sign bit

**Summary:** Describes using scaled integers (e.g., dollars stored as integer cents), example ranges for 2- and 3-byte unsigned scaled values, and the convention that for multi‑byte signed numbers the sign is stored in the high bit of the highest byte only.

## Scaled integers (avoid binary fractions)
Binary fractions are possible but are not covered here. A common practical approach is to scale values so they are stored as integers. Example: monetary amounts in dollars-and-cents are stored as integer cents.

- Two bytes unsigned (integer cents) can represent 0..65,535 cents = $0.00..$655.35.
- Three bytes unsigned (integer cents) can represent 0..16,777,215 cents = $0.00..$167,772.15.

General formula:
- Maximum unsigned value in n bytes = 256^n − 1.
- Maximum scaled monetary value (dollars with cents) = (256^n − 1) / 100.

## Multi‑byte signed numbers — sign bit convention
When storing signed values across multiple bytes, the sign is stored as the highest (most significant) bit of the highest byte only. This reserves one bit for sign and leaves the remaining (8*n − 1) bits for magnitude.

Consequences:
- Effective magnitude bit width for an n‑byte signed value = 8*n − 1.
- Maximum magnitude representable = 2^(8*n − 1) − 1 (assuming sign‑magnitude convention as described).
- The sign is not repeated in lower bytes; only the MSB of the highest byte carries the sign.

**[Note: Source states the sign is stored as the high bit of the highest byte only; it does not specify whether the representation is sign‑magnitude or two's complement. The description implies a single sign bit reserved in the MSB.]**

## References
- "number_size_ranges" — expands on using extra bytes for larger ranges and scaled values