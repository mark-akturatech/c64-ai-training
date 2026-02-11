# ADC & SBC — flags, overflow, Decimal Mode (BCD); CMP/CPX/CPY and BIT

**Summary:** Which flags ADC and SBC update on the NMOS 6502: Zero (Z), Negative (N), Overflow (V), and Carry (C). Explanation of the Overflow flag (signed overflow when operands share sign but result sign differs). Brief notes on Decimal Mode (D / BCD). CMP/CPX/CPY and BIT behavior included.

**Flags affected by ADC and SBC**
- ADC and SBC update: Z (zero), N (negative), V (overflow), C (carry).
- Z: set if the 8-bit ALU result == 0.
- N: set from bit 7 of the 8-bit result (1 = negative in two's complement).
- C (unsigned):
  - ADC sets C = 1 if the unsigned sum exceeds 0xFF (carry out of bit 7).
  - SBC sets C = 1 when the subtraction produces no borrow (i.e., unsigned result ≥ 0). In other words, after SBC a set C means no borrow occurred (A ≥ M + borrow-in).
- V (signed overflow): set when signed (two's‑complement) overflow occurs — specifically when the operands have the same sign and the sign of the result differs from that sign. (Equivalently: adding two positives produces a negative, or adding two negatives produces a positive.)

Example (binary signed overflow):
- A = $40 (0b0100_0000), operand = $40, initial C = 0.
  - Unsigned: 0x40 + 0x40 = 0x80 (no unsigned carry → C = 0).
  - Signed: +64 + +64 = +128 → result interpreted as -128 (sign changed) → overflow occurred → V = 1.
  - Result flags: N = 1 (bit7=1), V = 1, Z = 0, C = 0.

Note: SBC’s carry semantics are “borrow-in” inverted versus intuitive subtraction: the processor subtracts (A - M - (1 - C_in)), and sets C_out = 1 when the result is non-negative (no borrow).

**Decimal Mode (BCD)**
- The Decimal flag (D) selects BCD mode for ADC and SBC on NMOS 6502: each nibble is treated as a decimal digit 0..9 and the ALU result is adjusted to produce correct decimal arithmetic per nibble.
- D affects only ADC and SBC; INC and DEC do not use decimal mode.
- The 6502’s BCD behavior is implementation-specific in edge cases; the WDC/65C02 family and later CMOS derivatives have differences:
  - On the NMOS 6502, after a reset or interrupt, the state of the Decimal flag (D) is undefined, requiring software to clear it explicitly to avoid unintended behavior. The 65C02 automatically clears the D flag upon reset and interrupt entry, ensuring predictable behavior.
  - In Decimal mode, the NMOS 6502 updates the N (Negative), V (Overflow), and Z (Zero) flags based on the binary result before decimal correction, leading to potentially incorrect flag states. The 65C02 updates these flags based on the final decimal result, providing accurate flag status at the cost of an additional cycle per instruction.
  - The NMOS 6502's behavior with invalid BCD inputs (values with nibbles greater than 9) is undefined and can produce unpredictable results. The 65C02 handles invalid BCD inputs differently, particularly in SBC operations, where results may vary from the NMOS 6502.

**Compare instructions (CMP / CPX / CPY)**
- CMP, CPX, CPY perform a subtraction (register − operand) without storing the result in the register; they update N, Z, and C as a subtraction would:
  - register < operand → Z = 0, C = 0, N = sign-bit of result
  - register = operand → Z = 1, C = 1, N = 0
  - register > operand → Z = 0, C = 1, N = sign-bit of result
- The carry flag after compare indicates unsigned ≥ (C = 1 means register ≥ operand). The negative flag is the sign bit of the subtraction result but is not generally needed for simple unsigned comparisons.

**BIT instruction**
- BIT performs A AND operand but does not store the result in A. It updates:
  - Z: set if (A & operand) == 0.
  - N: copied from bit 7 of the operand.
  - V: copied from bit 6 of the operand.
- Use: test bits in a memory operand without destroying A; use BMI/BPL and BVS/BVC to branch on N/V, BEQ/BNE on Z.

## Source Code
```asm
                      4 [---1----]   SMB4 zpg         C7   2      5
                      5 [--1-----]   SMB5 zpg         D7   2      5
                      6 [-1------]   SMB6 zpg         E7   2      5
                      7 [1-------]   SMB7 zpg         F7   2      5
                  *   add 1 to cycles if page boundary is crossed
                  **  add 1 to cycles if branch occurs on same page
                      add 2 to cycles if branch occurs to different page
```

```text
            accumulator         operand
            [76543210] AND     [76543210]    == 0 ?
                                ↓↓            ↓
                                NV            Z
```

```asm
                        ;a condition has been previously evaluated
                        ;by setting the carry, now set a flag…
                        BCS SETFLAG       ;set a flag in location "FLAG"
```

## References
- "decimal_mode_bcd" — expands on full BCD examples and flag semantics

## Mnemonics
- ADC
- SBC
- CMP
- CPX
- CPY
- BIT
