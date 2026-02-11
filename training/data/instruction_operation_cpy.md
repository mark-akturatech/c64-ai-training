# 6502 CPY (Compare Y)

**Summary:** CPY compares the Y register to a memory operand (YR - operand), setting the Carry if there is no borrow (Y >= operand), the Zero if equal, and the Sign/Negative flag from the result's bit 7. Searchable terms: CPY, 6502, Y register, Carry (no borrow), Zero, Negative/Sign.

## Operation
CPY performs an unsigned comparison by subtracting the memory operand from the Y register (YR - M) using an intermediate wider result to detect borrow. Flags affected:
- Carry: set if no borrow occurred (equivalent to Y >= M).
- Zero: set if the low 8 bits of the subtraction result are zero (Y == M).
- Negative (Sign): set from bit 7 of the low 8-bit result ((Y - M) & 0x80).

Implementation notes:
- Use a 9-bit (or larger) intermediate result to detect borrow; the final reported result for Zero/Negative is the low 8 bits.
- CPY does not modify any registers other than the processor status flags.

## Source Code
```asm
/* CPY */
    src = YR - src;
    SET_CARRY(src < 0x100);
    SET_SIGN(src);
    SET_ZERO(src &= 0xff);
```

## References
- "instruction_tables_cpy" — expands on CPY opcodes and addressing modes.

## Mnemonics
- CPY
