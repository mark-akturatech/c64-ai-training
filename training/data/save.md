# SAVE ($FFD8)

**Summary:** KERNAL SAVE routine at $FFD8 (real address $F5DD) — saves a file. Requires prior SETLFS/SETNAM. Inputs: A = zero page register holding start address; X/Y = end address plus 1. Returns Carry clear on success; Carry set and A = error code on failure. Uses/clobbers A, X, Y registers.

## Description
Saves a file previously prepared by SETLFS and SETNAM. Call convention:
- Input
  - A = zero page register (the zero-page address pointer) that holds the start address of the data to save
  - X/Y = end address plus 1 (address immediately after last byte to save)
- Output
  - Carry flag: 0 = success, 1 = error
  - A = error code if Carry = 1
- Registers used: A, X, Y (these registers are used/clobbered by the routine)

Real/implementation address: $F5DD.

No additional behavior, buffer formats, or error-code table is included here; use the error code in A when Carry=1 to determine the failure.

## Key Registers
- $FFD8 - KERNAL - SAVE: save file entry point; inputs: A (zero-page pointer to start), X/Y (end+1); outputs: Carry/A (error)

## References
- "load" — complementary file read operation (LOAD $FFD5)
- "setlfs" — SETLFS configures device/logical number for SAVE

## Labels
- SAVE
