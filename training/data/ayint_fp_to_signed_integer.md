# AYINT ($B1BF)

**Summary:** Routine at $B1BF that checks the Floating Point Accumulator is within signed 16-bit range (32767 to -32768), returns an ILLEGAL QUANTITY error on failure, and on success converts and stores the 16-bit signed integer with high byte at $64 and low byte at $65.

## Description
AYINT validates the value currently held in the Floating Point Accumulator to ensure it fits in a signed 16-bit range (maximum 32767, minimum -32768). If the accumulator is outside this range the routine produces an ILLEGAL QUANTITY error. If within range, the routine converts the floating-point value to a 16-bit signed integer and stores the result in zero page: high byte at $64 (decimal 100) and low byte at $65 (decimal 101).

Entry point: $B1BF.

## Key Registers
- $0064-$0065 - Zero Page - Signed 16-bit conversion result (high byte at $0064, low byte at $0065)

## References
- "floating_point_constant_n32768" — Uses -32768 constant for lower-range checking  
- "fp_to_signed_in_a_and_y_registers" — Called by that routine to perform the actual conversion  
- "intidx_subscript_conversion" — Related routine for subscript conversion and positivity checks

## Labels
- AYINT
