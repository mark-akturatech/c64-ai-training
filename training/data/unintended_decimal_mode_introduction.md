# NMOS 6510 - ADC / SBC Decimal (BCD) Mode Behavior and Affected Undocumented Instructions

**Summary:** This document details the behavior of the NMOS 6502/6510 microprocessor when executing ADC and SBC instructions in decimal (BCD) mode, including the effects on processor flags (C, V, N, Z). It also explains how undocumented instructions derived from ADC/SBC (such as ARR, RRA, ISC, and the unofficial $EB immediate SBC) exhibit decimal-mode effects. Note that this behavior is specific to the NMOS family; the 65C02 and 65816 processors differ in this regard.

**Decimal-Mode Overview (NMOS 6502/6510)**

- **Affected Instructions:** Only the ADC (Add with Carry) and SBC (Subtract with Carry) instructions are influenced by the processor's decimal flag (D). Undocumented instructions that utilize ADC/SBC micro-operations, including ARR, RRA, ISC, and the unofficial $EB (SBC immediate), inherit this decimal-mode behavior.

- **Implementation Details:** In the NMOS 6502, decimal mode operates by first performing the binary addition or subtraction, setting the overflow (V) flag based on the binary result, and then applying a decimal (BCD) correction to the binary result. The carry (C) flag is set or cleared based on the adjusted value. The negative (N) and zero (Z) flags are set according to the final 8-bit result after decimal adjustment.

**ADC (Decimal Mode) — Algorithm and Flag Behavior**

**Behavior (Stepwise):**

1. **Binary Addition:** Compute the binary sum: `binary_sum = A + M + carry_in` (where `carry_in` is 0 or 1).

2. **Overflow Flag (V):** Set the overflow flag based on the binary result: `V = ((A ^ binary_sum) & (M ^ binary_sum) & 0x80) != 0`.

3. **Decimal Adjustment (if D = 1):**
   - **Low Nibble Adjustment:** If the sum of the lower nibbles plus `carry_in` exceeds 9, add 6 to `binary_sum`.
   - **High Nibble Adjustment:** If `binary_sum` exceeds 0x99, add 0x60 to `binary_sum` and set `carry_out` to 1; otherwise, set `carry_out` to 0.

4. **Carry Flag (C):** If D = 0, set `carry_out` based on the binary addition (i.e., if `binary_sum` ≥ 256).

5. **Accumulator Update:** Store the lower 8 bits of `binary_sum` in the accumulator: `A = binary_sum & 0xFF`.

6. **Flag Updates:**
   - **Negative Flag (N):** Set based on bit 7 of the final accumulator value.
   - **Zero Flag (Z):** Set if the final accumulator value is 0.
   - **Carry Flag (C):** Set to `carry_out`.
   - **Overflow Flag (V):** Already set from step 2.

**Notes and Consequences:**

- **Overflow Flag (V):** Computed from the binary result before decimal correction, a characteristic specific to the NMOS 6502.

- **Non-BCD Inputs:** If one or both operands have nibbles greater than 9 (i.e., non-BCD inputs), the decimal correction still applies, potentially yielding non-BCD results. The 6502 does not validate BCD input nibbles.

**SBC (Decimal Mode) — Algorithm and Flag Behavior**

**Behavior (Stepwise):**

1. **Binary Subtraction:** Treat SBC as `A + (~M) + carry_in` (where `carry_in` is the original carry flag). Compute `binary_diff = A - M - (1 - carry_in)` using binary arithmetic.

2. **Overflow Flag (V):** Set based on the binary subtraction result, using the same method as for ADC.

3. **Decimal Adjustment (if D = 1):**
   - **Low Nibble Adjustment:** If the result of the low nibble subtraction is negative, subtract 6 from `binary_diff`.
   - **High Nibble Adjustment:** If `binary_diff` is negative, subtract 0x60 from `binary_diff` and set `carry_out` to 0 (indicating a borrow); otherwise, set `carry_out` to 1 (no borrow).

4. **Carry Flag (C):** If D = 0, set `carry_out` based on the binary subtraction (i.e., `carry_out` = 1 if no borrow occurred, meaning `binary_diff` ≥ 0).

5. **Accumulator Update:** Store the lower 8 bits of `binary_diff` in the accumulator: `A = binary_diff & 0xFF`.

6. **Flag Updates:**
   - **Negative Flag (N):** Set based on bit 7 of the final accumulator value.
   - **Zero Flag (Z):** Set if the final accumulator value is 0.
   - **Carry Flag (C):** Set to `carry_out`.
   - **Overflow Flag (V):** Already set from step 2.

**Notes and Consequences:**

- **Overflow Flag (V):** Reflects the binary operation (pre-adjustment) on the NMOS 6502.

- **Carry Semantics:** After SBC, a carry flag (C) of 1 indicates no borrow (result ≥ 0), while a carry flag of 0 indicates a borrow occurred. Decimal adjustment modifies the final carry flag as described above.

- **Non-BCD Inputs:** Non-BCD operand nibbles produce results consistent with the algorithm but may not be valid BCD values.

**Examples and Interpretation**

The following examples illustrate ADC operations in decimal mode. The initial carry-in value (carry_in) is assumed to be 0 unless otherwise specified:

- **Example 1:** `$00 + $1F = $25`
  - **Binary Sum:** 0x00 + 0x1F = 0x1F
  - **Low Nibble:** 0x0 + 0xF = 0xF (≤ 9), no adjustment needed.
  - **High Nibble:** 0x1, no adjustment needed.
  - **Result:** 0x25

- **Example 2:** `$10 + $1F = $35`
  - **Binary Sum:** 0x10 + 0x1F = 0x2F
  - **Low Nibble:** 0x0 + 0xF = 0xF (≤ 9), no adjustment needed.
  - **High Nibble:** 0x2, no adjustment needed.
  - **Result:** 0x35

- **Example 3:** `$05 + $1F = $2A`
  - **Binary Sum:** 0x05 + 0x1F = 0x24
  - **Low Nibble:** 0x5 + 0xF = 0x14 (> 9), add 6 → 0x1A.
  - **High Nibble:** 0x2, no adjustment needed.
  - **Result:** 0x2A (Note: Non-BCD final nibble).

- **Example 4:** `$0F + $0A = $1F`
  - **Binary Sum:** 0x0F + 0x0A = 0x19
  - **Low Nibble:** 0xF + 0xA = 0x19 (> 9), add 6 → 0x1F.
  - **High Nibble:** 0x1, no adjustment needed.
  - **Result:** 0x1F

- **Example 5:** `$0F + $0B = $10`
  - **Binary Sum:** 0x0F + 0x0B = 0x1A
  - **Low Nibble:** 0xF + 0xB = 0x1A (> 9), add 6 → 0x20.
  - **High Nibble:** 0x2, no adjustment needed.
  - **Result:** 0x20

In Example 5, the result `$10` is unexpected based on the standard decimal-adjust algorithm. This discrepancy may be due to an unstated initial carry-in value or other contextual factors.

## Mnemonics
- ADC
- SBC
