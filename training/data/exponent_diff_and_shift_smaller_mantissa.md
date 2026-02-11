# FAC2 < FAC1: align smaller mantissa (ROM $B893–$B8A0)

**Summary:** Handles the case FAC2 < FAC1 (or swapped case) by clearing index and rounding byte, checking exponent-difference range against $F9, copying the exponent difference into Y, preparing the rounding byte, performing one LSR on a mantissa byte, and calling the right-shift routine (JSR $B9B0) to shift the smaller mantissa right by Y to align mantissas.

## Operation
This ROM fragment prepares and invokes the routine that right-shifts the smaller floating-point mantissa so both FAC1 and FAC2 are aligned for add/subtract.

Step-by-step behavior:
- LDY #$00 / STY $70 — clear Y (shift count) and clear the FAC1 rounding byte at zero page $70.
- CMP #$F9 / BMI $B862 — compare the exponent difference with constant $F9. The BMI branch transfers control when the exponent-difference value falls in the signed range $79–$F8 (handled elsewhere).
- TAY — if in-range, copy the exponent difference (in A) into Y; Y becomes the right-shift count.
- LDA $70 — fetch the FAC1 rounding byte (zero page $70).
- LSR $01,X — do a single logical-shift-right on the mantissa byte addressed by $01,X (mantissa storage indexed by X) (LSR shifts right; low bit -> carry).
- JSR $B9B0 — call the shift routine which performs Y additional right shifts to align the smaller mantissa with the larger one.

Notes:
- The shift routine at $B9B0 expects the initial LSR to have prepared the byte/flags; it then shifts the selected mantissa right Y times so mantissas match exponent alignment.
- Zero page $70 and $01,X are used as internal ROM/zero-page storage for rounding and mantissa bytes respectively (referenced here but not expanded).

## Source Code
```asm
.,B893 A0 00    LDY #$00        clear Y
.,B895 84 70    STY $70         clear FAC1 rounding byte
.,B897 C9 F9    CMP #$F9        compare exponent diff with $F9
.,B899 30 C7    BMI $B862       branch if range $79-$F8
.,B89B A8       TAY             copy exponent difference to Y
.,B89C A5 70    LDA $70         get FAC1 rounding byte
.,B89E 56 01    LSR $01,X       shift FAC? mantissa 1
.,B8A0 20 B0 B9 JSR $B9B0       shift FACX Y times right
```

## References
- "fac2_gt_fac1_swap_and_sign_setup" — prepares indices/signs used here
- "sign_compare_and_select_add_subtract" — after shifting, decide add vs subtract based on signs
- "shift_routine_reference" — details of the right-shift routine called at $B9B0