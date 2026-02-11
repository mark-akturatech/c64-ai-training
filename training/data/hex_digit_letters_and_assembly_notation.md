# Hexadecimal notation and $ prefix

**Summary:** Hexadecimal (base-16) digits 0–9 and A–F (10–15) are used to represent values 0–15; on the 6500/6502 platform hex literals are normally written with a leading dollar sign ($) so they are not confused with decimal values. Numbers without $ are assumed decimal; a bare number containing A–F indicates a notation error.

## Hex digits and mapping
Hexadecimal uses sixteen symbols:
- 0–9 represent values 0–9.
- A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.

A single hex digit (0–F) corresponds to a nibble (4 bits). Multi-digit hex numbers are positional base-16 values (e.g. $10 = 16 decimal).

## Notation convention for 6502/6500 assemblers
- The standard assembler convention for the 6500 series is to prefix hex constants with a dollar sign: $FF, $20, $0A.
- If a numeric literal is written without a leading $, it should be treated as decimal unless it contains A–F — in which case the literal is invalid or a mistake (hex letters require the $ prefix in this convention).
- This convention is followed by virtually all assemblers targeting the 6502 family.

## References
- "hexadecimal_notation_and_nibble_to_hex_mapping" — introductory explanation of hex digits and the need for a standard notation
- "table_3-1_binary_hex_decimal_mapping" — shows A–F mappings and example conversions between binary, hex, and decimal