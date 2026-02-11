# 6502 INY — Increment Y register

**Summary:** INY increments the Y register (YR) modulo 256 and updates the Sign (negative) and Zero flags. Searchable terms: INY, YR, Sign, Zero, 8-bit wraparound.

## Operation
INY performs an 8-bit increment of the processor Y index register and updates the processor status flags that reflect the result:
- The Y register is incremented and wrapped to 8 bits: YR = (YR + 1) & $FF.
- The Sign (negative) flag is set according to bit 7 of the result. (SET_SIGN checks bit 7.)
- The Zero flag is set if the result equals zero. (SET_ZERO tests for zero.)

## Source Code
```text
/* INY */
    unsigned src = YR;
    src = (src + 1) & 0xff;
    SET_SIGN(src);
    SET_ZERO(src);
    YR = (src);
```

## References
- "instruction_tables_iny" — expands on INY opcode

## Mnemonics
- INY
