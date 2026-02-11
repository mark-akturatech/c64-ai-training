# KERNAL: Subtract paired zero-page bytes (16-bit subtraction, low-first)

**Summary:** 6502 KERNAL routine at $FCD1-$FCDA performs a 16-bit subtraction of two little-endian zero-page pointer pairs (low/high): minuend at $AC/$AD minus subtrahend at $AE/$AF, using SEC/SBC sequence; final A contains the high-byte result and processor flags reflect the overall subtraction (carry = no-borrow). Search terms: $FCD1, $AC, $AD, $AE, $AF, SEC, SBC, RTS, KERNAL.

## Operation
This routine implements a 16-bit (paired-byte) subtraction in little-endian order:

- SEC sets Carry = 1 so the first SBC performs subtraction without an initial borrow (6502 SBC semantics: A := A - M - (1 - C)).
- LDA $AC / SBC $AE subtracts the low bytes (minuend low $AC minus subtrahend low $AE). The result of this low-byte subtraction is placed in A temporarily and sets/clears processor flags; importantly, the Carry flag after this SBC indicates whether a borrow occurred from the low byte (Carry = 1 → no borrow, Carry = 0 → borrow).
- LDA $AD / SBC $AF subtracts the high bytes (minuend high $AD minus subtrahend high $AF), including the borrow produced by the low-byte subtraction via the Carry flag. The final A contains the high-byte of the 16-bit difference.
- RTS returns to the caller. The low-byte result is not preserved (overwritten); only the high-byte (in A) and the processor status flags reflect the subtraction outcome:
  - Carry flag after return = 1 if minuend >= subtrahend (no overall borrow), 0 if subtract produced a borrow (minuend < subtrahend).
  - N, V, Z flags reflect the final SBC (high-byte) result per 6502 rules.

Use case: compute relative offsets or lengths between pointer pairs; complementary routines (see references) increment paired zero-page addresses as the inverse operation.

## Source Code
```asm
.,FCD1 38       SEC
.,FCD2 A5 AC    LDA $AC
.,FCD4 E5 AE    SBC $AE
.,FCD6 A5 AD    LDA $AD
.,FCD8 E5 AF    SBC $AF
.,FCDA 60       RTS
```

## Key Registers
- $FCD1-$FCDA - KERNAL - subtract paired zero-page bytes routine (code addresses)
- $AC-$AF - Zero Page - operand bytes: minuend low/high = $AC/$AD, subtrahend low/high = $AE/$AF

## References
- "increment_indirect_address_counters" — paired increments (inverse of these subtractions)
- "set_status_bit_0x20" — related status-bit changes used during computations