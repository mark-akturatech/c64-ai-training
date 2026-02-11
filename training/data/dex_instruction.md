# DEX — Decrement the X register

**Summary:** 6502 implied instruction DEX decrements the X register by 1; opcode $CA, 1 byte. Affects flags: Negative (N) and Zero (Z).

## Description
DEX subtracts 1 from the X register and stores the result back in X (X := X - 1, with 8-bit wraparound). After execution:
- Zero flag (Z) is set if the resulting X = 0; otherwise Z is cleared.
- Negative flag (N) is set according to bit 7 of the result (set if result & %10000000 ≠ 0); otherwise N is cleared.
- No other flags are altered by DEX (Carry, Overflow, Decimal, Interrupt disable, etc., remain unchanged).

Typical use: loop counters and index adjustments. Example usage in assembly: DEX  (decrement X and branch based on Z).

## References
- "dey_instruction" — expands on DEY (decrement Y register)

## Mnemonics
- DEX
