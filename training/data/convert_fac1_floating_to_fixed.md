# Convert FAC1 floating to fixed integer (ROM routine BC9B-BCBA)

**Summary:** Converts FAC1 floating-point to a fixed integer using exponent at $0061, subtracting max-integer exponent #$A0, testing sign via BIT $0066, handling negative overflow (set overflow byte $0068 and two's-complement mantissa via JSR $B94D), then shifting the mantissa right A times via short or long shift routines (JSR $B999 / $B9B0). Uses SBC, BIT, TAX/TXA, CMP #$F9 to decide short (<8) vs long shift path.

## Description
This ROM fragment (BC9B–BCBA) implements the floating-to-fixed conversion for FAC1:

- Load FAC1 exponent from $0061. If exponent is zero, branch to the clear-FAC1 routine ($BCE9) which returns with FAC1 cleared.
- Perform SEC / SBC #$A0 to subtract the maximum integer exponent (A now holds exponent - $A0).
- BIT $0066 tests FAC1 sign by inspecting bit 7 of the byte at $0066.
  - If the number is positive (BPL taken), skip the negative-overflow handling and continue to the shift decision.
  - If negative:
    - TAX stores the subtracted exponent result into X for later use.
    - Set overflow indicator $0068 to #$FF (signalling negative overflow state).
    - JSR $B94D calls the routine that two's-complements (negates) the FAC1 mantissa.
    - TXA restores the subtracted exponent result into A from X.
- Prepare for shifting:
  - LDX #$61 sets X to point at FAC1 area (index used by the shift routines).
  - CMP #$F9 compares the exponent-result (A) against #$F9; the branch BPL decides whether the required right shifts are fewer than 8 (short path) or not.
    - If less than 8 shifts: branch to the short-shift handler (inlined elsewhere as "shift FAC1 right A times").
    - If 8 or more shifts: JSR $B999 calls the long-shift subroutine for multi-byte shifts.
- After long-shift return, STY $68 clears the overflow byte (stores Y into $0068, where Y presumably is 0 on entry to this code path).
- RTS returns to caller.

Behavioral notes reflected in code:
- The exponent subtraction determines how many right shifts are required to align the mantissa as an integer. Exponent zero is treated as a cleared FAC1.
- Negative numbers trigger overflow marking and mantissa negation before shifting.
- Two different shifting methods are used depending on the shift count: a short path for <8 shifts and a long path for >=8 shifts.

## Source Code
```asm
.,BC9B A5 61    LDA $61         get FAC1 exponent
.,BC9D F0 4A    BEQ $BCE9       if zero go clear FAC1 and return
.,BC9F 38       SEC             set carry for subtract
.,BCA0 E9 A0    SBC #$A0        subtract maximum integer range exponent
.,BCA2 24 66    BIT $66         test FAC1 sign (b7)
.,BCA4 10 09    BPL $BCAF       branch if FAC1 +ve
                                FAC1 was -ve
.,BCA6 AA       TAX             copy subtracted exponent
.,BCA7 A9 FF    LDA #$FF        overflow for -ve number
.,BCA9 85 68    STA $68         set FAC1 overflow byte
.,BCAB 20 4D B9 JSR $B94D       twos complement FAC1 mantissa
.,BCAE 8A       TXA             restore subtracted exponent
.,BCAF A2 61    LDX #$61        set index to FAC1
.,BCB1 C9 F9    CMP #$F9        compare exponent result
.,BCB3 10 06    BPL $BCBB       if < 8 shifts shift FAC1 A times right and return
.,BCB5 20 99 B9 JSR $B999       shift FAC1 A times right (> 8 shifts)
.,BCB8 84 68    STY $68         clear FAC1 overflow byte
.,BCBA 60       RTS
```

## Key Registers
- $0061 - Zero page - FAC1 exponent (input; tested for zero and subtracted by #$A0)
- $0066 - Zero page - FAC1 sign test (BIT, b7 examined)
- $0068 - Zero page - FAC1 overflow byte (set to #$FF on negative overflow, cleared later)
- $B94D - ROM routine - twos-complement (negate) FAC1 mantissa
- $B999 - ROM routine - long right-shift FAC1 A times (>=8 shifts)
- $BCE9 - ROM routine - clear FAC1 and return

## References
- "shift_fac1_right_a_times" — short-shift path for shifting FAC1 right A times (<8 shifts)
- "shift_fac1_right_a_times" — long-shift subroutine call paths (JSR $B999 / $B9B0)
- "clear_fac1" — clear FAC1 when exponent is zero (JSR target $BCE9)