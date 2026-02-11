# IEVAL vector — $030A-$030B (pointer to EVAL routine)

**Summary:** $030A-$030B IEVAL vector (two-byte little-endian pointer) to the EVAL routine at $AE86 (44678 decimal); used by BASIC to evaluate single-term arithmetic expressions (functions such as INT and ABS).

## Description
The IEVAL vector at $030A-$030B contains the address of the EVAL routine (single-term arithmetic evaluator) used by Commodore BASIC. The vector is stored as a two-byte little-endian pointer: low byte at $030A and high byte at $030B. The canonical target for this vector is the EVAL routine located at $AE86 ($AE86 = 44678 decimal), which BASIC uses when evaluating single-term expressions (for example, the INT and ABS functions).

## Source Code
```text
Address   Name        Description
$030A     IEVAL (low) Low byte of pointer to EVAL routine
$030B     IEVAL (high)High byte of pointer to EVAL routine

Canonical EVAL address:
  $AE86  (decimal 44678)

Example contents for canonical EVAL pointer (little-endian):
  $030A = $86
  $030B = $AE
```

## Key Registers
- $030A-$030B - RAM - IEVAL vector (pointer to EVAL routine at $AE86 / 44678; low byte at $030A, high byte at $030B)

## References
- "basic_indirect_vector_table" — expands on BASIC indirect vectors overview

## Labels
- IEVAL
