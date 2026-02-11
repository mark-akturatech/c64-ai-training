# DEY (Decrement Y Register)

**Summary:** DEY is the 6502 implied-mode instruction that decrements the Y index register (8-bit wraparound) and updates the Sign (negative) and Zero processor flags.

## Operation
DEY performs an 8-bit decrement on the processor Y register with wraparound (0x00 -> 0xFF). After computing the new Y value, it updates:
- Sign (negative) flag from bit 7 of the result (SET_SIGN).
- Zero flag if the result equals zero (SET_ZERO).

Exact step sequence (as pseudocode):
1. Read current Y register (YR).
2. Subtract 1 and mask to 8 bits: result = (YR - 1) & $FF.
3. Set Sign flag from result bit 7.
4. Set Zero flag if result == 0.
5. Write result back to Y register.

No other flags (Carry, Overflow) are affected by DEY.

## Source Code
```asm
/* DEY */
    unsigned src = YR;
    src = (src - 1) & 0xff;
    SET_SIGN(src);
    SET_ZERO(src);
    YR = (src);

/* Assembly mnemonic */
    DEY    ; decrement Y register, set N and Z
```

## References
- "instruction_tables_dey" — expands on DEY opcode

## Mnemonics
- DEY
