# 6502 ORA pseudocode

**Summary:** 6502 ORA instruction pseudocode: performs a bitwise OR between memory (src) and the accumulator (AC). It updates the Sign (Negative) and Zero flags and stores the result back into AC.

## Operation
ORA performs a logical inclusive OR of the accumulator with a memory operand and writes the result to the accumulator. The pseudocode shows the exact update sequence: combine src and AC, update the sign/zero status flags, then write the result into AC.

- src |= AC — bitwise OR of memory operand (src) with accumulator (AC).
- SET_SIGN(src) — set Negative flag from bit 7 of result (highest bit).
- SET_ZERO(src) — set Zero flag if result equals zero.
- AC = src — store result back into accumulator.

## Source Code
```asm
/* ORA */
    src |= AC;
    SET_SIGN(src);
    SET_ZERO(src);
    AC = src;
```

## References
- "instruction_tables_ora" — expands on ORA opcodes and addressing modes

## Mnemonics
- ORA
