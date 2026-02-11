# 6502 TYA — Transfer Y to A (pseudocode)

**Summary:** TYA copies the Y register (YR) into the accumulator (AC) and updates the Sign (Negative) and Zero flags based on Y; other processor flags remain unchanged.

**Operation**
TYA reads the current Y register value, sets the processor's Negative (Sign) and Zero flags according to that value, and places the value into the accumulator.

- Source value: YR
- Destination: AC
- Flags affected: Sign (Negative, N) and Zero (Z)
  - SET_SIGN(src) — sets N from bit 7 of src (highest bit).
  - SET_ZERO(src) — sets Z if src == 0.
- Flags not affected: Carry (C), Overflow (V), Decimal (D), Interrupt Disable (I).

**Opcode and Timing**
- Opcode: $98
- Addressing Mode: Implied
- Bytes: 1
- Cycles: 2

## Source Code
```text
/* TYA */
    unsigned src = YR;
    SET_SIGN(src);
    SET_ZERO(src);
    AC = (src);
```

## References
- "instruction_tables_tya" — expands on TYA opcode

## Mnemonics
- TYA
