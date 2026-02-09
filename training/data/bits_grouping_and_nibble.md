# Bits and Bytes (basic definitions)

**Summary:** Defines a bit and common synonyms (1/0, ON/OFF, SET/CLEAR, HIGH/LOW), explains grouping bits to represent 2^N values, shows the 4-bit (nibble) example with 2^4 = 16, introduces positional bit weights (LSB/MSB), and extends the discussion to 8-bit bytes and their implications for an 8-bit machine.

**Definition**

A bit is the smallest meaningful piece of information that can be stored; it has only two possible values: 1 or 0. Common synonyms for those two states:

- 1 — ON, SET, HIGH
- 0 — OFF, CLEAR, LOW

All digital signals inside the computer exist in one of these two states.

**Grouping bits and value capacity**

Grouping N bits together yields 2^N distinct possible values. The formula:

- Number of possible values = 2^N

Example for N = 4:

- 2^4 = 2 * 2 * 2 * 2 = 16

A group of 4 bits is called a nibble.

**Positional values (weights) within a group**

Each bit in a group has a positional weight; the group’s numeric value is the sum of the weights of bits set to 1. For a 4-bit nibble (bit indices 0–3), the weights are:

- bit 0 (LSB) = 1
- bit 1 = 2
- bit 2 = 4
- bit 3 (MSB) = 8

(LSB = least significant bit; MSB = most significant bit.)

Example: nibble 1011 = bit3(1)*8 + bit2(0)*4 + bit1(1)*2 + bit0(1)*1 = 8 + 0 + 2 + 1 = 11.

**Extension to 8-bit bytes and implications for an 8-bit machine**

An 8-bit byte consists of 8 bits, allowing for 2^8 = 256 distinct values, ranging from 0 to 255. The positional weights for an 8-bit byte (bit indices 0–7) are:

- bit 0 (LSB) = 1
- bit 1 = 2
- bit 2 = 4
- bit 3 = 8
- bit 4 = 16
- bit 5 = 32
- bit 6 = 64
- bit 7 (MSB) = 128

In an 8-bit system like the Commodore 64, the processor can handle data in 8-bit chunks, meaning each register and memory location can store a single byte. This 8-bit architecture influences the range of values that can be directly manipulated and the design of instructions and data structures.

**Definitions of LSB and MSB**

- **LSB (Least Significant Bit):** The bit in a binary number with the smallest positional weight, located at the rightmost position. It represents the value 2^0 (1).

- **MSB (Most Significant Bit):** The bit in a binary number with the largest positional weight, located at the leftmost position. In an 8-bit byte, it represents the value 2^7 (128).

Understanding LSB and MSB is crucial for tasks such as bit manipulation, data storage, and interpreting multi-byte values in computing systems.

## References

- "bit_position_value_and_significance" — expands on LSB/MSB, positional values, and computing group values
- "bytes_and_8-bit_machine" — extends grouping concept to 8-bit bytes and C-64 implications