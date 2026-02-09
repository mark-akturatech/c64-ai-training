# ABS() for FAC1 — clear sign byte with LSR $66

**Summary:** Clears the sign bit of the floating-point accumulator FAC1 at zero-page address $0066 using a logical shift right (LSR $66), then returns (RTS). Searchable terms: $0066, FAC1, LSR, ABS, RTS.

## Description
This routine implements the ABS() operation for FAC1 by performing a single logical shift right on the FAC1 sign byte at zero page $66. LSR shifts the byte right one bit, inserting 0 into bit 7 and moving the previous bit 7 into bit 6; the net effect is that the sign bit (bit 7) becomes zero, removing the negative sign from FAC1. The routine consists of one instruction followed by RTS, so no normalization, rounding, or further adjustment is performed here — those are handled by other routines referenced below.

## Source Code
```asm
.,BC58 46 66    LSR $66         clear FAC1 sign, put zero in b7
.,BC5A 60       RTS
```

## Key Registers
- $0066 - Zero Page - FAC1 sign byte (bit 7 = sign)

## References
- "save_a_as_integer_byte_and_prepare_fac1_for_abs" — prepares FAC1 and then uses ABS/normalise to finish
- "round_fac1" — how normalization and rounding routines interact with FAC1 sign clearing