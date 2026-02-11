# 6502 INX (Increment X Register)

**Summary:** INX — 6502 instruction that increments the X index register (XR) mod 256, updates the Sign (Negative) and Zero flags. Searchable terms: INX, XR, X register, Zero flag, Sign flag, 6502.

**Operation**
Increments the processor X register (XR) by 1 with 8-bit wraparound, then updates the processor status Zero (Z) and Sign/Negative (N) flags based on the new 8-bit result. The operation is equivalent to XR := (XR + 1) & $FF; then set Z if result == 0, set N if bit 7 of result is 1.

## Source Code
```text
/* INX */
    unsigned src = XR;
    src = (src + 1) & 0xff;
    SET_SIGN(src);
    SET_ZERO(src); 
    XR = (src);
```

## References
- "instruction_tables_inx" — expands on INX opcode and related opcode table entries.

## Mnemonics
- INX
