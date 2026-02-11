# FAC2 exponent compare / branch — save FAC1 rounding byte, test exponents, prepare subtract

**Summary:** Assembly snippet from the C64 ROM handling FAC1/FAC2 floating-point alignment: copies FAC1 rounding byte ($70) into FAC2 rounding slot ($56), loads FAC2 exponent ($69) into Y, early-exits if exponent zero, then performs SEC / SBC $61 (subtract FAC1 exponent) and branches to either mantissa-add when exponents equal or to shift/align when FAC2 < FAC1. Uses 6502 flags (SEC/SBC, BEQ, BCC).

## Description
This ROM fragment implements the exponent-comparison stage used when preparing two BASIC floating-point accumulators (FAC1 and FAC2) for addition/subtraction:

- LDX $70 / STX $56
  - Copies the FAC1 rounding byte (source $70) into the FAC2 rounding-byte slot ($56). This preserves rounding state into the working FAC2 slot before alignment/operation.
- LDX #$69 / LDA $69 / TAY
  - Sets index to the FAC2 exponent address ($69), loads FAC2 exponent into A, then transfers it to Y. Y now holds FAC2 exponent for later use.
- BEQ $B848
  - If FAC2 exponent is zero, branch to the zero-exponent early-exit handler (no operation or special-case result).
- SEC / SBC $61
  - Sets carry to 1 (so SBC performs A - M) and subtracts FAC1 exponent at $61 from FAC2 exponent (A). After SBC the result in A is FAC2_exp - FAC1_exp with flags set accordingly.
- BEQ $B8A3
  - If the subtraction result is zero (exponents equal), branch to the mantissa-add routine (no shifting needed).
- BCC $B893
  - If Carry is clear after SBC, a borrow occurred → FAC2 < FAC1, branch to the routine that shifts (right) the smaller mantissa (align FAC2 to FAC1). If carry set, FAC2 > FAC1 and execution continues into the path that handles FAC2 > FAC1 (swap/sign setup path handled elsewhere).

Behavioral notes (from code flow and 6502 semantics):
- SEC before SBC ensures no implicit borrow is included; SBC computes FAC2_exp - FAC1_exp.
- BEQ and BCC operate on result/flags set by SBC:
  - BEQ → exponents equal → direct mantissa add.
  - BCC → FAC2 < FAC1 → FAC2 must be shifted right to align.
  - Otherwise (carry set and not zero) FAC2 > FAC1 → handle swap and sign setup.

## Source Code
```asm
.,B86F A6 70    LDX $70         get FAC1 rounding byte
.,B871 86 56    STX $56         save as FAC2 rounding byte
.,B873 A2 69    LDX #$69        set index to FAC2 exponent address
.,B875 A5 69    LDA $69         get FAC2 exponent
.,B877 A8       TAY             copy exponent
.,B878 F0 CE    BEQ $B848       exit if zero
.,B87A 38       SEC             set carry for subtract
.,B87B E5 61    SBC $61         subtract FAC1 exponent
.,B87D F0 24    BEQ $B8A3       if equal go add mantissas
.,B87F 90 12    BCC $B893       if FAC2 < FAC1 then go shift FAC2 right
```

## References
- "fac1_zero_early_exit_copy_fac2" — expands on previous early-exit check
- "fac2_gt_fac1_swap_and_sign_setup" — expands on path taken when FAC2 exponent > FAC1 exponent
- "exponent_diff_and_shift_smaller_mantissa" — expands on path taken when FAC2 exponent < FAC1 exponent (align mantissas)
- "mantissa_add_path" — branch target when exponents equal
