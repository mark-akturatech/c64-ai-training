# Multiply 16-bit value by 5 (add original to times-4)

**Summary:** 6502 assembly sequence that forms a 16-bit value ×5 by adding the original 16-bit value in $033E/$033F to the times-4 result in $033C/$033D using CLC/ADC, leaving the product in $033C/$033D.

## Operation
This routine assumes:
- $033C/$033D contain the original value ×4 (high byte at $033C, low byte at $033D).
- $033E/$033F contain the original value (high byte at $033E, low byte at $033F).

Procedure:
1. Clear carry (CLC) to ensure no incoming carry affects the low-byte addition.
2. Add the low byte: load low-byte of times-4 from $033D, ADC the original low byte from $033F, and store the resulting low byte back to $033D. ADC sets the carry if the low-byte sum overflows.
3. Add the high byte with carry: load high-byte of times-4 from $033C, ADC the original high byte from $033E (this ADC includes the carry from the low-byte addition), and store the resulting high byte back to $033C.

Result: $033C/$033D hold the original 16-bit value multiplied by five (with correct carry propagation between low and high bytes).

## Source Code
```asm
.A 08A0  CLC
.A 08A1  LDA $033D
.A 08A4  ADC $033F
.A 08A7  STA $033D
.A 08AA  LDA $033C
.A 08AD  ADC $033E
.A 08B0  STA $033C
```

## References
- "extract_variable_bytes_and_prepare_for_shifts" — expands on x4 value in $033C/$033D and originals in $033E/$033F
- "double_to_make_times_ten_and_store_back" — expands on final doubling to get times-ten and storing result back into V%