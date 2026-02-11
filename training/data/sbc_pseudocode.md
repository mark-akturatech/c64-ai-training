# NMOS 6510 - SBC Pseudocode with BCD Correction and Flag Updates

**Summary:** Pseudocode for the NMOS 6510/6502 SBC (Subtract with Carry) instruction, detailing binary subtraction, flag computations (C, N, Z, V), and BCD (Binary-Coded Decimal) corrections applied in decimal mode. The pseudocode now includes explicit gating by the Decimal flag (D) and ensures the final stored accumulator value is masked to 8 bits.

**Operation Detail**

This pseudocode implements the SBC instruction as follows:

- **Binary Subtraction:**
  - `tmp = A - imm - (C ^ 1);`
  - Note: SBC uses an inverted carry for subtraction; `(C ^ 1)` implements that inversion (if C=1 then subtract 0, if C=0 then subtract 1).

- **Flag Computation:**
  - **Carry (C):** Set to 1 when no borrow occurred (`tmp < 0x100`), otherwise 0.
  - **Negative (N):** Set from bit 7 of `tmp` (`tmp & 0x80`).
  - **Zero (Z):** Set when the low 8 bits are zero (`(tmp & 0xff) == 0`).
  - **Overflow (V):** Computed from operand/result sign relationships:
    - `V = (((A ^ tmp) & (A ^ imm)) & 0x80) != 0;`
    - This detects sign change patterns between A, imm, and tmp.

- **BCD Correction (applied only if Decimal flag D is set):**
  - **Low-Nibble Subtraction:**
    - `tmp2 = (A & 0x0f) - (imm & 0x0f) - (C ^ 1);`
    - If the low-nibble subtraction underflows (`tmp2 & 0x10` set), subtract 6 from the low nibble and decrement the high nibble subtraction by 0x10; otherwise, keep the high nibble subtraction unadjusted.
  - **High-Nibble Combination and Final BCD Adjustment:**
    - After combining, if bit 8 of `tmp2` is set (`tmp2 & 0x100`), subtract 0x60 to complete BCD correction.

- **Accumulator Update:**
  - Store the adjusted result back into A, ensuring it is masked to 8 bits: `A = tmp2 & 0xFF;`

## Source Code

```text
/* A = value in Accumulator, imm = immediate argument, C = carry, D = decimal flag */
/* Perform binary subtraction */
tmp = A - imm - (C ^ 1);
C = (tmp < 0x100) ? 1 : 0;
N = (tmp & 0x80) >> 7;
Z = ((tmp & 0xff) == 0) ? 1 : 0;
V = (((A ^ tmp) & (A ^ imm)) & 0x80) != 0;

/* Apply BCD correction only if Decimal flag is set */
if (D) {
  /* Calculate the lower nibble */
  tmp2 = (A & 0x0f) - (imm & 0x0f) - (C ^ 1);
  /* BCD correction */
  if (tmp2 & 0x10) {
    tmp2 = ((tmp2 - 6) & 0xf) | ((A & 0xf0) - (imm & 0xf0) - 0x10);
  } else {
    tmp2 = (tmp2 & 0xf) | ((A & 0xf0) - (imm & 0xf0));
  }
  if (tmp2 & 0x100) {
    tmp2 -= 0x60;
  }
  A = tmp2 & 0xFF;
} else {
  A = tmp & 0xFF;
}
```

## References

- "sbc_instruction_decimal_mode_overview" — expands on decimal-mode differences and flags that this pseudocode implements.

## Mnemonics
- SBC
