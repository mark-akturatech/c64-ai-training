# $0306-$0307 — IQPLOP: Vector to BASIC token-to-ASCII routine (QPLOP)

**Summary:** $0306-$0307 is the BASIC indirect vector IQPLOP pointing to the QPLOP routine (QPLOP at $A71A / 42778) which lists a BASIC program token as ASCII text. The vector holds a 16-bit little-endian address to the token-listing routine.

## Description
This RAM location is part of the C64 BASIC indirect vector table. The two-byte vector at $0306-$0307 (IQPLOP) contains the low and high bytes of the entry point for the QPLOP routine, which converts or lists a single BASIC program token into its ASCII text representation (used when printing or token-dumping BASIC programs).

- Target routine: QPLOP at $A71A (decimal 42778).
- Vector format: 16-bit little-endian address (low byte at $0306, high byte at $0307).
- Purpose: Redirectable entry point for token → ASCII listing of BASIC program tokens; part of the BASIC interpreter's indirection table so the behavior can be patched or relocated by replacing the vector.

## Key Registers
- $0306-$0307 - BASIC - IQPLOP: vector containing 16-bit address of QPLOP (lists BASIC token as ASCII), little-endian

## References
- "basic_indirect_vector_table" — overview and expansion of BASIC indirect vectors

## Labels
- IQPLOP
- QPLOP
