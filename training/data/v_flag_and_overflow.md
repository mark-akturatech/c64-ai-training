# V flag (overflow / signed arithmetic overflow)

**Summary:** The 6502 V (overflow) flag indicates signed arithmetic overflow and is affected only by addition/subtraction (ADC, SBC) and by BIT (copies bit 6 into V). Typical uses: BIT (bit-test), BVS/BVC branching, CLV to clear V, and (on some chips) hardware-set via a dedicated pin.

## V flag behavior
- Purpose: V (overflow) is meaningful only for signed (two's‑complement) arithmetic; it signals that a signed add/sub result cannot be represented in 8 bits.
- Instructions that affect V:
  - ADC, SBC — set/reset V according to signed overflow from the operation.
  - BIT memory — copies bit 6 of the tested memory byte into V (BIT also copies bit 7 into N and sets Z from A & M).
  - CLV — explicitly clears V.
  - Hardware — some 650x variants provide an external pin that can set V.
- Branching:
  - BVS — branches if V = 1 (overflow set).
  - BVC — branches if V = 0 (overflow clear).
- Notes:
  - There is no single instruction that directly sets V (other than BIT copying bit 6 or external hardware). CLV is the only instruction that clears it.
  - V is independent of the unsigned-carry condition; use C for unsigned overflow, V for signed overflow.
  - Practical rule for detecting signed overflow (concise): when adding two operands of the same sign produces a result with the opposite sign, V is set. (Equivalent signed condition: operands have same sign and result sign differs.)

## Overflow (signed vs unsigned)
- Definition: overflow means the true mathematical result cannot be represented in the destination width (here, 8 bits).
- Unsigned arithmetic: detect overflow with the Carry flag (C).
- Signed (two's‑complement) arithmetic: detect overflow with the V flag.
- Example (conceptual): 200 + 200 = 400 overflows an 8‑bit field; for signed numbers the same bit-patterns imply different interpretation — use V for signed checks, C for unsigned.

## References
- "n_flag_and_signed_numbers_introduction" — explanation of signed numbers that makes V meaningful
- "flag_summary_and_status_register_overview" — summary of flags and branching instructions

## Mnemonics
- ADC
- SBC
- BIT
- CLV
- BVS
- BVC
