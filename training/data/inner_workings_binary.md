# MACHINE — Basic binary concepts (bits, bytes, bit numbering)

**Summary:** Basic binary representation used in microcomputers: digital circuits are two-state (on/off), represented as bits (1/0); eight bits form a byte; conventional bit numbering uses bit 0 at the right (LSB) and bit 7 at the left (MSB).

## The Inner Workings of Microcomputers
Digital circuits in binary computers have only two stable states: on or off (electrically: full voltage or no voltage). The system is therefore binary — all values and internal signals are expressed using two symbols, commonly written as 1 (on) and 0 (off). Other equivalent labels are TRUE/FALSE or YES/NO.

A string of binary digits (bits) encodes the state of multiple circuits. Example (eight bits, one byte):
%11000111
This shows the leftmost two wires on, the next three off, and the rightmost three on. Binary is positional (not decimal); to avoid confusion with decimal notation the percent sign (%) is often used as a prefix for binary literals.

Definitions:
- Bit: a single binary digit (0 or 1).
- Byte: a group of eight bits.

Bit numbering convention:
- Bits in a byte are commonly numbered from the right, starting at zero. The rightmost bit is bit 0 (least significant bit, LSB) and the leftmost is bit 7 (most significant bit, MSB) (weights 2^0..2^7 right-to-left).

## References
- "hexadecimal_notation" — shows how humans use hex to represent binary groups
- "number_ranges" — applies bit weights to compute numeric ranges for addresses and data
