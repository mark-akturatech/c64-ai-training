# MACHINE - Multiple-byte (big) numbers and carry propagation

**Summary:** Use multiple bytes to hold large integers on the 6502/C64; the processor signals overflow from a lower byte to the next with the carry flag, and the programmer must explicitly propagate that carry when doing multi-byte arithmetic (e.g., ADC for addition, ROR for multi-byte shifts).

## Multi-byte numbers
You may allocate two or more consecutive bytes to represent a single integer (size determined by the largest value you expect). When arithmetic on the low-order byte overflows, the 6502 sets the processor carry flag (C). It does not automatically add that carry into the next higher byte — your code must do that.

- For multi-byte addition: use ADC (add with carry) for each byte and ensure the initial carry is correct (clear C before adding the least-significant byte). ADC will set or clear C for the next byte.
- For multi-byte bit shifts/rotations or divide-by-2 sequences: link bytes via the carry flag with ROR/ROL (rotate through carry) so bits moving out of one byte become the carry input for the next.

Do not assume any automatic multi-byte handling; implement explicit byte-by-byte sequencing that propagates and consumes the carry flag.

## References
- "addition_and_multi_byte_addition" — multi-byte addition example using ADC and carry propagation
- "right_shift_and_ror" — multi-byte division using ROR and carry linking

## Mnemonics
- ADC
- ROR
- ROL
