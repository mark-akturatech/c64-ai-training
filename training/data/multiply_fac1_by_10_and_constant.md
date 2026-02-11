# Multiply FAC1 by 10 (ROM $BAE2-$BAF9)

**Summary:** Multiply FAC1 by 10 using FAC2 as a temporary: rounds and copies FAC1 to FAC2, checks and adjusts exponent (ADC #$02 then INC), adds FAC2 to FAC1 (FAC1 = (FAC1 + FAC2)*2), and uses a 5‑byte floating constant for 10 at $BAF9. Branches to $BADF on exponent overflow.

## Description
This ROM routine multiplies the floating-point accumulator FAC1 by 10 using FAC2 and small integer exponent arithmetic. High-level flow:

- JSR $BC0C: round and copy FAC1 into FAC2 (prepares FAC2 = rounded FAC1).
- TAX / BEQ $BAF8: copy FAC1 exponent into X to test for zero (early exit if FAC1 is zero).
- CLC / ADC #$02 / BCS $BADF: add 2 to the exponent (equivalent to multiply by 4) and test for overflow; if ADC wraps past $FF, branch to overflow handler at $BADF.
- LDX #$00 / STX $6F: clear a zero-page location ($6F) used for sign compare (FAC1 EOR FAC2).
- JSR $B877: add FAC2 to FAC1 (this implements FAC1 + FAC2 — part of the sequence to compute *5 before doubling).
- INC $61: increment FAC1 exponent (completes multiply by 10 via earlier *4 step then *2 by adding FAC2 result).
- BEQ $BADF: if INC wraps exponent to zero, branch to overflow handler.
- RTS: return.

Notes:
- The routine uses FAC2 as a temporary to implement the multiply-by-10 using shifts and additions rather than general floating multiply.
- $6F is cleared to set up sign comparison state (FAC1 EOR FAC2) used by the add routine at $B877.
- Overflow detection occurs both after ADC #$02 and after INC $61; both branch to $BADF (overflow/error handling).
- The 5-byte floating constant representing 10 is stored at $BAF9.

## Source Code
```asm
                                *** multiply FAC1 by 10
.,BAE2 20 0C BC JSR $BC0C       round and copy FAC1 to FAC2
.,BAE5 AA       TAX             copy exponent (set the flags)
.,BAE6 F0 10    BEQ $BAF8       exit if zero
.,BAE8 18       CLC             clear carry for add
.,BAE9 69 02    ADC #$02        add two to exponent (*4)
.,BAEB B0 F2    BCS $BADF       do overflow error if > $FF
                                FAC1 = (FAC1 + FAC2) * 2
.,BAED A2 00    LDX #$00        clear byte
.,BAEF 86 6F    STX $6F         clear sign compare (FAC1 EOR FAC2)
.,BAF1 20 77 B8 JSR $B877       add FAC2 to FAC1 (*5)
.,BAF4 E6 61    INC $61         increment FAC1 exponent (*10)
.,BAF6 F0 E7    BEQ $BADF       if exponent now zero go do overflow error
.,BAF8 60       RTS             

                                *** 10 as a floating value
.:BAF9 84 20 00 00 00           10
```

## References
- "test_and_adjust_accumulators" — checks exponent range before/after scaling