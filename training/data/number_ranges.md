# MACHINE — Address/Data Bus Numeric Ranges and Bit Weights

**Summary:** 16-bit address bus → 65,536 addresses; 8-bit data bus → 256 distinct values. Explains bit weighting for converting binary addresses to decimal (weights 1..32768) and shows the eight- and sixteen-bit weight diagrams; mentions control-bus signals and PEEK/POKE usage.

## Number Ranges
The address bus on a 16-bit system has 16 lines (bits). Each bit can be 0 or 1, so the total number of distinct address combinations is 2^16 = 65,536. That yields 65,536 unique memory addresses.

The data bus has 8 lines (bits). 2^8 = 256 possible values can be placed on the data bus, so each memory location can store one of 256 distinct values (0–255).

The address bus is accompanied by control wires (often called the control bus) used for data timing and for selecting the transfer direction (read or write). Non-selected devices on the data bus ignore the information.

## Bit Weighting and Address Conversion
To express a binary address as a decimal number (useful for BASIC PEEK/POKE), assign each bit a weight: bit 0 (least significant bit) = 1, and each bit to the left doubles the previous weight. Bit 15 (most significant bit for a 16-bit address) has weight 32,768.

Example:
Binary address: 0001001010101100

Breakdown by weights present:
- 4096 (bit 12)
- 512  (bit 9)
- 128  (bit 7)
- 32   (bit 5)
- 8    (bit 3)
- 4    (bit 2)

Sum: 4096 + 512 + 128 + 32 + 8 + 4 = 4780

A BASIC POKE to decimal 4780 will access the memory location with that binary address.

## Source Code
```text
+-----+-----+-----+-----+-----+-----+-----+-----+
| 128 |  64 |  32 |  16 |  8  |  4  |  2  |  1  |
+-----+-----+-----+-----+-----+-----+-----+-----+

                             EIGHT BITS

+------+-------+------+------+------+------+------+-----+-----+-----+-----+-----+----+----+----+----+
|32768 |16384  |8192  |4096  |2048  |1024  |512   |256  |128  |64   |32   |16   | 8  | 4  | 2  | 1  |
+------+-------+------+------+------+------+------+-----+-----+-----+-----+-----+----+----+----+----+

                            SIXTEEN BITS

Figure 1.3
```

## References
- "inner_workings_binary" — expands on uses bit concepts to compute numeric weights
- "hexadecimal_notation" — introduces hex as a convenient human representation of these binary values
