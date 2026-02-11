# BASIC USR(X) — Indirect vector at $0311-$0312, parameter via FPA1 ($0061)

**Summary:** USR(X) calls a machine-language routine whose address is stored at $0311-$0312 (low/high). The numeric parameter X is passed in floating point accumulator #1 beginning at $0061, and the routine returns a value by placing it into that same accumulator; the routine must end with RTS.

**Behavior**
USR(X) evaluates the numeric expression X in BASIC and passes the value to a machine-language subroutine by loading it into floating point accumulator #1 (FPA1) at $0061. The target routine's entry address is taken indirectly from the two-byte vector stored at locations 785 and 786 (decimal) — $0311 (low byte) and $0312 (high byte). The machine-language routine should place any return value into FPA1 and terminate with an RTS so control returns to BASIC. If multiple different machine routines are required, the two-byte indirect vector at $0311-$0312 must be updated to point to the desired routine before calling USR.

**Floating Point Accumulator #1 (FPA1) Layout**
FPA1, located at zero-page address $0061, is structured as follows:

- **$0061 (97):** Exponent byte
- **$0062-$0065 (98-101):** Mantissa (4 bytes)
- **$0066 (102):** Sign byte

**Exponent Byte ($0061):**
- Represents the power of two by which the mantissa is multiplied.
- Stored with a bias of 129; to obtain the actual exponent, subtract 129 from this value.
- An exponent of $00 indicates the value is zero.

**Mantissa ($0062-$0065):**
- A 32-bit (4-byte) value representing the significant digits of the number.
- Stored in big-endian order: the most significant byte at $0062, the least significant at $0065.
- The most significant bit of the first byte is always set to 1 and is implied, thus not stored.

**Sign Byte ($0066):**
- The most significant bit indicates the sign: 0 for positive, 1 for negative.
- The remaining bits are unused.

This layout allows for the representation of floating-point numbers in the range of approximately ±1.70141183 × 10^38 to ±2.93873588 × 10^-39.

## Key Registers
- **$0311-$0312:** BASIC USR vector (low byte/high byte) — address loaded by USR(X)
- **$0061:** Floating point accumulator #1 (FPA1) start — parameter in / return via FPA1

## References
- "memory_map_zero_page_part1" — expands on floating point accumulator and USR vector addresses in zero page
- [Floating Point Arithmetic - C64-Wiki](https://www.c64-wiki.com/wiki/Floating_point_arithmetic)
- [Floating Point Math from BASIC - C64OS](https://c64os.com/post/floatingpointmath)

## Labels
- FPA1
- USR
