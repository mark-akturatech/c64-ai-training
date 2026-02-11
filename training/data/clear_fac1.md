# clear FAC1 and return ($BCE9-$BCF2)

**Summary:** Assembly routine at $BCE9-$BCF2 that clears FAC1 mantissa bytes ($62-$65), clears the Y index register (via TAY), and returns with RTS. Search terms: $BCE9, $BCF2, FAC1, mantissa, STA, TAY, RTS.

## Description
This short ROM routine zeroes the four mantissa bytes of FAC1 (the BASIC floating-point accumulator; zero-page workspace at $62-$65) by storing the accumulator into each byte, then transfers A into Y (TAY) to clear Y, and returns (RTS). The code assumes A already contains 0 when executed (so STA writes zero into the mantissa bytes).

- Purpose: ensure FAC1 represents 0.0 (mantissa cleared) and clear Y before returning to caller.
- Usage context: used by conversion and zero-result paths (e.g., when FAC1 exponent is zero), see related conversion/compare routines.

## Source Code
```asm
.,BCE9 85 62    STA $62         clear FAC1 mantissa 1
.,BCEB 85 63    STA $63         clear FAC1 mantissa 2
.,BCED 85 64    STA $64         clear FAC1 mantissa 3
.,BCEF 85 65    STA $65         clear FAC1 mantissa 4
.,BCF1 A8       TAY             clear Y
.,BCF2 60       RTS
```

## References
- "convert_fac1_floating_to_fixed" — expands on calls that clear FAC1 when FAC1 exponent is zero  
- "compare_fac1_with_pointer_ay" — expands on comparisons that may detect zero values mapping to cleared FAC1

## Labels
- FAC1
