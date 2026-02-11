# 6502 LDY — pseudocode: set Sign and Zero and YR = src

**Summary:** LDY (Load Y register) loads an 8-bit operand into the Y register and updates the processor flags: Zero (Z) and Negative/Sign (N). Searchable terms: LDY, Y register, Zero flag, Negative flag, 6502, SET_SIGN, SET_ZERO.

## Description
LDY reads a source operand (src), writes the 8-bit value into the Y register (YR), and sets two processor flags based on the result:

- Zero (Z): set if the loaded value equals 0; cleared otherwise.
- Negative / Sign (N): set to the high bit (bit 7) of the loaded value; cleared otherwise.

Other status flags (Carry, Overflow, Decimal, Interrupt Disable, Break) are not affected by LDY. The result is an 8-bit value stored in YR; any higher bits are discarded.

The provided pseudocode shows the logical steps (flag updates and register write). The conventional 6502 semantics are that Z and N reflect the contents of Y after the load.

## Source Code
```asm
/* LDY */
    SET_SIGN(src);
    SET_ZERO(src);
    YR = (src);
```

## References
- "instruction_tables_ldy" — expands on LDY opcodes and addressing modes

## Mnemonics
- LDY
