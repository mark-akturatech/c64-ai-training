# Multiplication by shifts and adds (ASL / ROL)

**Summary:** Use 6502 ASL and ROL to multiply integers by powers of two and by composite constants (example: multiply-by-10 via shifts and add). Technique covers multi-byte linking via the processor carry flag (ASL: MSB -> C; ROL: rotate through C) and the digit-accumulation use-case for building decimal input.

## Technique: multiply by two (multi-byte)
To multiply a multi-byte integer by two, shift the low-order byte with ASL (arithmetic/logic left): the high bit shifted out becomes the processor C flag. Then use ROL (rotate left through carry) on the next byte so the carry from the lower byte becomes its low bit; repeat ROL up through the higher bytes. Sequence for a 3-byte value (low → mid → high):

- ASL low   (MSB -> C)
- ROL mid   (C -> mid bit0; mid MSB -> C)
- ROL high  (C -> high bit0; high MSB -> C)

(ASL shifts left, MSB -> C) (ROL rotates left through C)

This links bytes by the carry so the entire multi-byte value is shifted left as a single large integer. Repeat the same pattern to multiply by 4 (two shifts) or 8 (three shifts).

## Multiply by ten (decimal-digit accumulation)
To form N * 10 using shifts and adds (useful for accumulating typed decimal digits):

- Multiply N by 2 (ASL/ROL sequence).
- Multiply the result by 2 again → N * 4.
- Add the original N → N * 5.
- Multiply that sum by 2 → N * 10.

This is typically applied when reading decimal digits one at a time: before adding the new digit, multiply the running total by ten using the above sequence, then add the new digit.

## Source Code
```text
            ASL         0
           +---------+  |
           |         |  |
        ,---- <- <- <---'
        |  |         |
ROL     |  +---------+
+---------+    |   LOW ORDER BYTE
|         |    v
,---- <- <- <---CARRY
|  |         |
|  +---------+
|   MID ORDER BYTE
v

TO MULTIPLY A THREE-BYTE NUMBER BY TWO, SHIFT THE LOW ORDER
BYTE WITH ASL; THEN USE ROL TO ALLOW THE C FLAG TO "LINK" FROM
ONE BYTE TO THE NEXT.

Figure (multi-byte ASL/ROL diagram)
```

## References
- "left_shift_and_rol" — expands on using ASL and ROL for multi-byte multiplication

## Mnemonics
- ASL
- ROL
