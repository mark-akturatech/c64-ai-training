# Add FAC2 mantissa into FAC1 mantissa (ROM $B8FE–$B91A)

**Summary:** Adds FAC2 rounding byte into FAC1 rounding (ADC), saves the result, then performs a multi-byte ADC chain to add FAC2 mantissa bytes into FAC1 mantissa bytes ($62-$65 ← $6A-$6D) with carry propagation; finally JMPs to normalisation/test at $B936. Searchable terms: ADC, STA, LDA, JMP, carry, FAC1, FAC2, $56, $62-$65, $6A-$6D, $70, $B936.

## Description
This ROM fragment performs the addition of the FAC2 floating-point mantissa into FAC1's mantissa. Steps performed:

- Add FAC2 rounding byte ($56) into the accumulator using ADC; the accumulator is then stored as FAC1 rounding byte at $70. (Caller must have loaded FAC1 rounding byte into A before entry.)
- Perform four successive add-with-carry (ADC) operations to add FAC2 mantissa bytes into FAC1 mantissa bytes, using the processor carry to propagate across the 4-byte mantissa:
  - FAC1 mantissa byte 4 ($65) plus FAC2 mantissa byte 4 ($6D) → store back to $65
  - FAC1 mantissa byte 3 ($64) plus FAC2 mantissa byte 3 ($6C) → store back to $64
  - FAC1 mantissa byte 2 ($63) plus FAC2 mantissa byte 2 ($6B) → store back to $63
  - FAC1 mantissa byte 1 ($62) plus FAC2 mantissa byte 1 ($6A) → store back to $62
- After the 4-byte addition, execution jumps to $B936 where carry-dependent normalization / rotation logic handles any overflow (carry = 1) or finalisation (carry = 0).

This routine assumes little-endian byte ordering for the mantissa with byte 1 at the lowest address ($62) and byte 4 at the highest ($65). The carry flag is used to propagate across the multi-byte addition and is then tested by the code at $B936 for normalization.

## Source Code
```asm
        ; add FAC2 mantissa to FAC1 mantissa
.,B8FE  65 56     ADC $56         ; add FAC2 rounding byte
.,B900  85 70     STA $70         ; save FAC1 rounding byte
.,B902  A5 65     LDA $65         ; get FAC1 mantissa 4
.,B904  65 6D     ADC $6D         ; add FAC2 mantissa 4
.,B906  85 65     STA $65         ; save FAC1 mantissa 4
.,B908  A5 64     LDA $64         ; get FAC1 mantissa 3
.,B90A  65 6C     ADC $6C         ; add FAC2 mantissa 3
.,B90C  85 64     STA $64         ; save FAC1 mantissa 3
.,B90E  A5 63     LDA $63         ; get FAC1 mantissa 2
.,B910  65 6B     ADC $6B         ; add FAC2 mantissa 2
.,B912  85 63     STA $63         ; save FAC1 mantissa 2
.,B914  A5 62     LDA $62         ; get FAC1 mantissa 1
.,B916  65 6A     ADC $6A         ; add FAC2 mantissa 1
.,B918  85 62     STA $62         ; save FAC1 mantissa 1
.,B91A  4C 36 B9  JMP $B936       ; test and normalise FAC1 for C=0/1
```

## Key Registers
- $56 - Zero Page - FAC2 rounding byte (source added via ADC)
- $62-$65 - Zero Page - FAC1 mantissa bytes 1–4 (least to most significant)
- $6A-$6D - Zero Page - FAC2 mantissa bytes 1–4 (least to most significant)
- $70 - Zero Page - FAC1 rounding byte (destination of ADC result)

## References
- "sign_compare_and_select_add_subtract" — expands on entry here when signs indicate addition
- "post_add_normalisation_shift_loop" — expands on performs rotation/normalisation when carry indicates overflow from addition

## Labels
- FAC1_MANT1
- FAC1_MANT2
- FAC1_MANT3
- FAC1_MANT4
- FAC2_MANT1
- FAC2_MANT2
- FAC2_MANT3
- FAC2_MANT4
