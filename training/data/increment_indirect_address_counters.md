# KERNAL: Increment zero-page 16-bit pointer ($00AC/$00AD)

**Summary:** KERNAL helper at $FCDB-$FCE1 that increments a 16-bit little-endian pointer stored in zero page $00AC (low) / $00AD (high) using INC/BNE/INC/RTS. Propagates the carry from low to high byte when the low byte wraps ($FF -> $00); INC affects N/Z but not C (6502 behavior).

## Description
This small routine advances an indirect pointer pair by one. Sequence:

- INC $00AC — increment low byte (sets N/Z, does not touch C).
- BNE skip — if low byte did not wrap to zero, branch to RTS (no high-byte increment).
- INC $00AD — low wrapped (was $FF); increment high byte to propagate the carry.
- RTS — return.

Size: 7 bytes at $FCDB-$FCE1. Typical use: stepping through tables or advancing pointers that reference ROM/IO tables; see related routines for subtraction and table traversal.

## Source Code
```asm
.,FCDB E6 AC    INC $AC
.,FCDD D0 02    BNE $FCE1
.,FCDF E6 AD    INC $AD
.,FCE1 60       RTS
```

## Key Registers
- $00AC-$00AD - Zero Page - 16-bit little-endian indirect pointer (low/high) used by this KERNAL increment helper

## References
- "subtract_indirect_pair_offsets" — expands on pairs with the subtraction helper for pointer math
- "load_device_vectors_from_rom_table" — expands on use when stepping through ROM-sourced tables