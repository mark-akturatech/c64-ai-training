# NMOS 6510 — ARR flag-mapping table header and formulas

**Summary:** ARR (undocumented NMOS 6502/6510 opcode) flag-mapping header: defines the inputs used before the ROR step (Carry, input bit 7, input bit 6) and the resulting output bits/flags (output bit 7, output bit 6, Carry, Overflow) with exact Boolean formulas.

## Explanation
This chunk provides the header and Boolean formulas used to compute the flag and bit outputs for the ARR sequence's ROR-related mapping on NMOS 6510. Inputs are the processor carry and the two most-significant bits of the value being rotated (Bit 7 and Bit 6) immediately before the ROR operation; outputs are the rotated result bits and affected flags.

Inputs (before ROR):
- Carry — processor Carry flag prior to the ROR step
- Input Bit 7 — the current bit 7 of the value before ROR
- Input Bit 6 — the current bit 6 of the value before ROR

Outputs (after ROR / mapping):
- Output Bit 7
- Output Bit 6
- Output Carry
- Output Overflow

Mapping formulas (Boolean expressions):
- Output Bit 7 = Input Bit 7
- Output Bit 6 = Input Bit 7 XOR Input Bit 6
- Output Carry = Input Carry
- Output Overflow = Input Bit 7

These formulas are the header rules used to derive the full 8-row lookup (all 3-bit input combinations) presented in the companion chunk "arr_flag_mapping_table_data".

## Source Code
```text
Input before ROR columns:  Carry | Input Bit 7 | Input Bit 6
Output columns:             Bit 7 | Bit 6      | Carry | Overflow

Formulas:
Output Bit 7  = Input Bit 7
Output Bit 6  = Input Bit 7 ^ Input Bit 6
Output Carry  = Input Carry
Output Overflow = Input Bit 7
```

## References
- "arr_flag_mapping_table_data" — complete lookup table rows for all input combinations (raw output bits listed)

## Mnemonics
- ARR
