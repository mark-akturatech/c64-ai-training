# AND, OR, EOR — Boolean bit operations for single-bit manipulation

**Summary:** Describes logical bit operations AND, OR and EOR (XOR) for manipulating individual bits in a byte on the C64/6502. Includes reliable formulas: BYTEVALUE AND (255-BITVALUE) to clear a bit, BYTEVALUE OR BITVALUE to set a bit, and EOR with a mask (or 255 for full complement) to toggle bits; AND/OR are available in BASIC, EOR is the 6502 EOR instruction.

## Bit operations
Adding or subtracting a bit value (e.g., +16 to set Bit 4) is unsafe unless you already know the bit's current state — adding may carry into other bits. Use logical operations instead:

- Clear (turn bit to 0): BYTEVALUE AND (255 - BITVALUE). AND masks bits; only bits set in both operands remain 1.
- Set (turn bit to 1): BYTEVALUE OR BITVALUE. OR sets a bit if it is 1 in either operand.
- Toggle (flip 0↔1): BYTEvalue EOR BITMASK. EOR (exclusive OR, XOR) reverses bits where the mask has 1s; use mask = BITVALUE to flip a single bit or mask = 255 to invert all 8 bits.

Notes:
- AND and OR are provided by Commodore BASIC. EOR is the 6502 EOR machine instruction (XOR) and is used in machine code.
- Use bit masks (BITVALUE) equal to the bit weight: Bit0=1, Bit1=2, Bit2=4, ..., Bit7=128 (see referenced "bits_bytes_and_binary_numbering" chunk for bit weights).
**[Note: Source may contain an error — the text states "256 minus the number" for the 8‑bit complement; the correct 8‑bit bitwise complement is 255 - N (i.e., EOR 255 yields 255 - N).]**

## Source Code
```text
Examples (binary and decimal):

Clear Bit 4 (value 16) from 154:
  10011010 = 154
AND
  11101111 = 239   (255 - 16)
  --------
  10001010 = 138

Formula: BYTEVALUE AND (255 - BITVALUE)

Set Bit 4 (value 16) in 138:
  10001010 = 138
OR
  00010000 =  16
  --------
  10011010 = 154

Formula: BYTEVALUE OR BITVALUE

Toggle (invert) all bits of 154 using EOR with 255:
  10011010 = 154
EOR
  11111111 = 255
  --------
  01100101 = 101

Note: EOR with 255 produces the bitwise complement: result = 255 - original
Formula: BYTEVALUE EOR MASK   (MASK = BITVALUE to flip one bit; MASK = 255 to invert all bits)
```

## Key Registers
- (none) — this chunk documents bitwise operations in general; no specific C64 register addresses.

## References
- "bits_bytes_and_binary_numbering" — expands on bit weights (Bit0..Bit7) used in masks and operations  
- "hexadecimal_and_nybbles" — expands on representing masks/values in hexadecimal  
- "format_of_memory_map_entries" — shows flags in memory maps that are commonly manipulated with these operations