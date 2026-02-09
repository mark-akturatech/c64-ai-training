# 6502 Binary Long Division (trial-subtraction method)

**Summary:** Binary long division (trial-subtraction) for 6502 implementations: shift dividend bits into a work remainder, attempt subtracting the divisor, record quotient bit 1 if subtraction succeeds else 0. Searchable terms: trial-subtraction, long division, shift-subtract, quotient bits, 6502.

## Algorithm
Binary long division proceeds bit-by-bit using only two trial results per step (subtract 0 or divisor). The typical implementation for 6502-style code uses a single work-area remainder and the dividend shifted into it:

Steps:
- Align divisor and prepare a work remainder (initialized to 0).
- For each dividend bit (most-significant first):
  - Shift the work remainder left one bit and bring in the next dividend bit into the low bit of the remainder.
  - Attempt remainder - divisor (trial subtraction).
  - If subtraction result is >= 0:
    - Keep the subtraction result as the new remainder.
    - Record quotient bit = 1.
  - Else:
    - Discard subtraction result (remainder stays as before shifting in the bit).
    - Record quotient bit = 0.

This produces the quotient bits sequentially and leaves the final remainder. The method maps naturally to 6502 instructions: shifts (ASL, ROL), compare/subtract (CMP or SBC with borrow), branching (BPL/BMI/BCC/BCS) to record the quotient bit and restore remainder when needed.

Example (binary long division of 1101101 by 101 shown stepwise):

    10101
        _________
    101 ) 1101101
         -101
         ----
            11
            -0
            --
            111
           -101
           ----
             100
              -0
             ---
             1001
             -101
             ----
              100

Note: the example demonstrates that at each step the only possible subtrahends are 0 or the divisor, simplifying branching logic.

## References
- "two_byte_division_routine" — expands on example 6502 code implementing this trial-subtract method