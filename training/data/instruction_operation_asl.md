# 6502 ASL (Arithmetic Shift Left)

**Summary:** ASL (Arithmetic Shift Left) — 6502 instruction that shifts an 8-bit operand left one bit, moves bit7 into the Carry flag, clears bit0, updates Negative (Sign) and Zero flags, and writes the result back to memory or the accumulator depending on addressing mode.

## Operation
ASL performs a logical left shift on an 8-bit operand and updates processor flags:

- Capture the pre-shift bit 7 into Carry (C = old bit7).
- Shift the operand left one bit; bit0 is filled with 0.
- Mask result to 8 bits (result & 0xFF).
- Set Negative/Sign flag from the new bit7 of the result.
- Set Zero flag if result == 0.
- Store the result back to the location implied by the addressing mode (accumulator or memory).

Flags affected:
- Carry: set to the original bit7 of the source.
- Negative (Sign): set from bit7 of the result.
- Zero: set if the result is zero.

(Note: the source pseudocode describes the exact steps; no other flags or side effects are described here.)

## Source Code
```text
/* ASL */
    SET_CARRY(src & 0x80);
    src <<= 1;
    src &= 0xff;
    SET_SIGN(src);
    SET_ZERO(src);
    STORE src in memory or accumulator depending on addressing mode.
```

## References
- "instruction_tables_asl" — expands on ASL opcodes and addressing modes

## Mnemonics
- ASL
