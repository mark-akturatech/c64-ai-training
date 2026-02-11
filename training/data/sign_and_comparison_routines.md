# SIGN / SGN / ABS / FCOMP — FAC1 sign & comparison routines ($BC2B, $BC39, $BC58, $BC5B)

**Summary:** ROM floating-point helpers for FAC1 sign extraction, sign→floating conversion, absolute-value, and FAC1 vs memory comparison. Routines at $BC2B (SIGN), $BC39 (SGN), $BC58 (ABS), $BC5B (FCOMP); workspace sign byte at 102 ($66); results placed in .A or FAC1 as described.

## Description
- SIGN — $BC2B (decimal 48171)
  - Purpose: Put the sign of FAC1 into the .A register.
  - Result in .A: 0 if FAC1 is zero; 1 if FAC1 is positive; 255 ($FF) if FAC1 is negative.
  - Operates on FAC1 implicitly (no pointer parameters required).

- SGN — $BC39 (decimal 48185)
  - Purpose: Produce a floating-point representation of FAC1's sign in FAC1.
  - Behavior: Calls SIGN to produce 0/1/255 in .A, then converts that byte value into a five‑byte floating point number stored back into FAC1.
  - Effect: FAC1 becomes the floating-point encoding of the sign value (0.0, +1.0, or -1.0 as produced by the SIGN value).

- ABS — $BC58 (decimal 48216)
  - Purpose: Make FAC1 positive (absolute value).
  - Behavior: Clears the sign bit of FAC1 by shifting the FAC1 sign byte (workspace offset 102 / $66) right so the top bit becomes 0.
  - Effect: FAC1 magnitude unchanged; sign forced positive.

- FCOMP — $BC5B (decimal 48219)
  - Purpose: Compare FAC1 to a five-byte floating point value in memory.
  - Entry convention: .A and .Y must point to the five-byte floating-point number to compare against FAC1 (pointer into memory where that 5-byte FP value begins).
  - Result in .A after return: 0 if FAC1 == memory value; 1 if FAC1 > memory value; 255 ($FF) if FAC1 < memory value.

Additional notes:
- Workspace sign byte: FAC1 sign is located at offset 102 (decimal) / $66 (hex) in the floating-point workspace used by these routines.
- SGN implementation relies on SIGN (.A) conversion followed by the ROM integer→floating conversion path to store the FP value into FAC1.
- FCOMP uses .A/.Y as the pointer; calling code must set those registers appropriately before JSR.

## References
- "normalization_negation_overflow" — expands on Sign and negation helpers and how they interact with normalization/overflow handling.
- "qint_and_int_integer_conversion" — expands on comparisons and sign operations used before integer-conversion routines.

## Labels
- SIGN
- SGN
- ABS
- FCOMP
