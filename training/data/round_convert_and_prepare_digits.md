# Prepare FAC1 for Digit Extraction — round, convert, compute digit/exponent counts

**Summary:** Commodore 64 BASIC ROM disassembly: round FAC1 (JSR $B849), convert FAC1 floating to fixed (JSR $BC9B), compute digits-before-decimal and exponent adjustment using zero-page workspace ($005D, $005E). Searchable terms: FAC1, floating-to-fixed, round, ADC #$0A, SBC #$02, $005D, $005E.

## Description
This code block finalizes arithmetic preparation before the decimal-digit extraction/emission phase. Steps performed:

- Round FAC1 by adding 0.5 (JSR $B849) to implement correct nearest-digit rounding.
- Convert FAC1 from the BASIC floating representation to a fixed (integer-like) representation (JSR $BC9B). After this conversion the routines use the BASIC zero-page workspace to determine how many digits appear before the decimal point and an exponent adjustment used later during digit extraction.
- Initialize a default digits-before-decimal count to 1 (LDX #$01).
- Read the working exponent/count byte from zero page $005D (LDA $5D). This value is then adjusted with ADC #$0A (add decimal 10) — the code comments indicate this is to allow "up to 9 digits before point".
  - If the ADC result sets the negative flag (BMI), the routine abandons adjustment and keeps the default 1 digit before the decimal point.
  - Otherwise the adjusted value is compared to #$0B (11 decimal) via CMP #$0B and BCS; the comment notes this threshold corresponds to very large numbers (n >= 1E9).
- If the value is below the threshold, the code executes ADC #$FF (effectively subtract 1 with carry clear), then TAX to move the computed digits-before-decimal into X.
- The code sets up an exponent adjustment value (A9 #$02, then SEC / SBC #$02) and saves it to zero page $005E.
- The computed digits-before-decimal (in X) are stored back to $005D (STX $5D). The X register is copied back to A (TXA) and tested:
  - BEQ branches for the no-digits-before-decimal case.
  - BPL branches for the positive-digit count case and continues into the digit extraction loop.

This block therefore ensures FAC1 is rounded and converted, then determines and stores:
- the final digits-before-decimal count (zero page $005D),
- an exponent adjustment used by the digit-extraction routines (zero page $005E).

## Source Code
```asm
.,BE2F 20 49 B8 JSR $B849       add 0.5 to FAC1 (round FAC1)
.,BE32 20 9B BC JSR $BC9B       convert FAC1 floating to fixed
.,BE35 A2 01    LDX #$01        set default digits before dp = 1
.,BE37 A5 5D    LDA $5D         get number exponent count
.,BE39 18       CLC             clear carry for add
.,BE3A 69 0A    ADC #$0A        up to 9 digits before point
.,BE3C 30 09    BMI $BE47       if -ve then 1 digit before dp
.,BE3E C9 0B    CMP #$0B        A>=$0B if n>=1E9
.,BE40 B0 06    BCS $BE48       branch if >= $0B
                                carry is clear
.,BE42 69 FF    ADC #$FF        take 1 from digit count
.,BE44 AA       TAX             copy to X
.,BE45 A9 02    LDA #$02        set exponent adjust
.,BE47 38       SEC             set carry for subtract
.,BE48 E9 02    SBC #$02        -2
.,BE4A 85 5E    STA $5E         save exponent adjust
.,BE4C 86 5D    STX $5D         save digits before dp count
.,BE4E 8A       TXA             copy to A
.,BE4F F0 02    BEQ $BE53       branch if no digits before dp
.,BE51 10 13    BPL $BE66       branch if digits before dp
```

## Key Registers
- $005D-$005E - Zero page (BASIC floating workspace) - $005D: working exponent/digits-before-decimal count; $005E: exponent adjustment for digit extraction

## References
- "choose_notation_and_scale_fac1_to_get_digit_count" — expands on uses of the computed exponent/digit counts from scaling
- "digit_extraction_loop_and_output_write" — expands on next: extract digits from the fixed FAC1 and write them to the output buffer