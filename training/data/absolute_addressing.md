# Absolute addressing

**Summary:** Absolute addressing is a 6510/6502 addressing mode where the instruction operand contains a two‑byte (16‑bit) address allowing access to any location $0000–$FFFF; assemblers normally choose zero page encodings when possible for efficiency.

## Description
Absolute addressing encodes a full 16‑bit memory address in the instruction operand (two bytes). The processor uses that 16‑bit value directly as the effective address, allowing access to any byte in the $0000–$FFFF address space. Because zero page instructions use a single‑byte operand and are faster/smaller, assemblers will typically emit zero page forms when the target address lies in $0000–$00FF and the instruction supports a zero page variant.

## References
- "absolute_indexed_addressing" — expands on absolute addressing combined with index registers X or Y
