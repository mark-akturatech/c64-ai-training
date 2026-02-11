# FAC1/FAC2 Exponent Test and Adjust (C64 ROM disassembly $BAB7-$BADF)

**Summary:** This ROM routine tests and adjusts the exponents of the floating-point accumulators FAC1 and FAC2, located at zero-page addresses $61 and $69, respectively. It handles cases of zero, underflow, and exponent overflow by performing arithmetic adjustments and branching to appropriate error handlers.

**Description**

This routine validates and aligns the 8-bit exponent bytes for FAC1 and FAC2, which are part of the Commodore 64's floating-point representation. The high-level flow is as follows:

- Load the exponent of FAC2 from $69. If it is zero, branch to the underflow handling path, which involves popping the return address and clearing the exponent and sign of FAC1.
- Add the exponent of FAC1 ($61) to the exponent of FAC2 using CLC and ADC instructions to detect carry and signed results:
  - If the sum is less than $100 (no carry from 8-bit addition), continue.
  - If the signed result is negative (bit 7 set), treat it as overflow and jump to the overflow handler.
- Add $80 to the exponent before storing it back to $61, effectively adjusting the exponent.
- If the stored exponent becomes zero, jump to save the sign of FAC1 and return.
- Save the sign comparison (EOR result) from $6F into $66 and return.
- In the overflow handling path, complement the saved sign of FAC1 and use the BMI instruction to decide between overflow and underflow paths.
- In the underflow handling path, pop the return address and jump to a helper that clears the exponent and sign of FAC1 before returning to the caller.
- In the overflow handling path, jump to a warm-start/overflow error routine at $B97E.

**Control Flags Used:**

- **Carry Flag (C):** After ADC, indicates whether the 8-bit addition overflowed into the 9th bit (sum ≥ $100).
- **Negative Flag (N):** After ADC, tested with BMI to detect a negative signed result (bit 7 set), used here to decide overflow conditions.

**Zero-Page Variables:**

- **$61 (FAC1 exponent):** Stores the exponent byte of the first floating-point accumulator.
- **$66 (FAC1 sign):** Stores the sign of FAC1.
- **$6F (Sign comparison):** Stores the result of the EOR operation between the signs of FAC1 and FAC2.
- **$69 (FAC2 exponent):** Stores the exponent byte of the second floating-point accumulator.

## Source Code

```asm
                                *** test and adjust accumulators
.,BAB7 A5 69    LDA $69         ; get FAC2 exponent
.,BAB9 F0 1F    BEQ $BADA       ; branch if FAC2 = $00 (handle underflow)
.,BABB 18       CLC             ; clear carry for add
.,BABC 65 61    ADC $61         ; add FAC1 exponent
.,BABE 90 04    BCC $BAC4       ; branch if sum of exponents < $0100
.,BAC0 30 1D    BMI $BADF       ; do overflow error
.,BAC2 18       CLC             ; clear carry for the add
.,BAC3 2C 10 14 BIT $1410       ; test bit at $1410
.,BAC6 69 80    ADC #$80        ; adjust exponent
.,BAC8 85 61    STA $61         ; save FAC1 exponent
.,BACA D0 03    BNE $BACF       ; branch if not zero
.,BACC 4C FB B8 JMP $B8FB       ; save FAC1 sign and return
.,BACF A5 6F    LDA $6F         ; get sign compare (FAC1 EOR FAC2)
.,BAD1 85 66    STA $66         ; save FAC1 sign (b7)
.,BAD3 60       RTS             
                                ; handle overflow and underflow
.,BAD4 A5 66    LDA $66         ; get FAC1 sign (b7)
.,BAD6 49 FF    EOR #$FF        ; complement it
.,BAD8 30 05    BMI $BADF       ; do overflow error
                                ; handle underflow
.,BADA 68       PLA             ; pop return address low byte
.,BADB 68       PLA             ; pop return address high byte
.,BADC 4C F7 B8 JMP $B8F7       ; clear FAC1 exponent and sign and return
.,BADF 4C 7E B9 JMP $B97E       ; do overflow error then warm start
```

## References

- "multiply_fac1_by_memory_shift_add_loop" — expands on code called before the multiply shift/add to align/validate accumulators
- "divide_ay_by_fac1_core_algorithm" — expands on code invoked during division preparation to align exponents

## Labels
- FAC1_EXP
- FAC1_SIGN
- SIGN_COMPARE
- FAC2_EXP
