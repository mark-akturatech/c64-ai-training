# Bits and Bytes

**Summary:** A byte is eight binary digits (bits); 8 bits produce 256 distinct combinations representing unsigned values 0–255. Binary (base 2) uses bit positions (Bit0–Bit7) with weights 1,2,4,...,128.

## Explanation
- Bit: the smallest unit of information; a binary digit that can be 0 or 1.
- Byte: a group of eight bits (commonly the addressable unit of memory on the C64/6502).
- Combinations:
  - 1 bit: 0, 1 (2 combinations)
  - 2 bits: 00, 01, 10, 11 (4 combinations)
  - 3 bits: 000, 001, 010, 011, 100, 101, 110, 111 (8 combinations)
  - n bits: the number of combinations doubles with each bit (2^n combinations).
- A full byte (8 bits) yields 256 combinations and is commonly used to represent unsigned integer values 0 through 255.

## Bit weights
Bits are counted from the right, starting at Bit 0 (least significant bit).
- Bit 0 = 1
- Bit 1 = 2
- Bit 2 = 4
- Bit 3 = 8
- Bit 4 = 16
- Bit 5 = 32
- Bit 6 = 64
- Bit 7 = 128

## References
- "memory_size_and_addressing" — expands on the memory model that uses bytes as addressable units  
- "multi_byte_addresses_pages_and_byte_order" — expands on using multiple bytes to represent larger addresses  
- "bitwise_logical_operations_and_examples" — expands on bit-level operations that act on these bit positions  
- "hexadecimal_and_nybbles" — expands on relationship between 4-bit nybbles and hexadecimal digits