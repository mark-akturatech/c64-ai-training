# 6502 CMP — pseudocode and flag behavior

**Summary:** CMP (6502) computes AC - src (accumulator minus operand) and sets processor flags: Carry (no borrow), Sign/Negative (N), and Zero (Z) based on the low byte of the result; result is not written back to AC.

## Description
Performs an unsigned compare by subtracting the operand (src) from the accumulator (AC) using a wider-than-8-bit intermediate to detect borrow. Flags are set as follows:

- Compute a full subtraction (allowing a 9th bit to detect borrow): src = AC - src
- Carry (C) is set if there was no borrow (i.e., AC >= operand). In the pseudocode this is expressed as SET_CARRY(src < 0x100).
- Sign / Negative (N) is set from the result’s high bit (bit 7) of the low byte of the subtraction result (i.e., the 8-bit result’s bit 7).
- Zero (Z) is set if the low byte of the result is zero (mask result to 8 bits first).

Note: the subtraction result is used only to set flags — the accumulator is not modified by CMP.

## Source Code
```asm
/* CMP */
    src = AC - src;
    SET_CARRY(src < 0x100);
    SET_SIGN(src);
    SET_ZERO(src &= 0xff);
```

## References
- "instruction_tables_cmp" — expands on CMP opcodes & addressing modes

## Mnemonics
- CMP
