# NMOS 6510 ADC (Decimal/BCD) — detailed pseudocode and flag behavior

**Summary:** Detailed step-by-step pseudocode for the NMOS 6510 ADC instruction in decimal (BCD) mode, showing lower-nibble addition and BCD fixup, conditional carry into the upper nibble, Z/N/V flag timing and logic, high-nibble BCD fixup, final carry computation, and accumulator assignment.

## Behavior
This chunk is a precise, implementation-level pseudocode sequence for ADC with the decimal (BCD) flag set on the NMOS 6510. It preserves the exact ordering and flag timing used by many documented NMOS 6502-family decimal implementations:

- Use a wider temporary (tmp) to hold the lower-nibble result plus any carry out from the lower nibble so the upper-nibble stage can inspect it.
- Step 1: Add the low nibbles of A and immediate and the incoming carry into tmp.
- Step 2: Perform a BCD correction on the low nibble: if the low-nibble sum > 9 then add 6 (0x06) to tmp.
- Step 3: Recombine the corrected low nibble with the high nibble(s) of A and immediate; include an extra 0x10 if the low-nibble correction produced a carry into the high nibble.
- Step 4: The Zero flag is computed exactly as in binary mode from the 8-bit binary sum (A + imm + C) before any BCD high-nibble correction.
- Step 5: Negative and Overflow flags are computed after the low-nibble fixup, using binary logic on the intermediate tmp (so their inputs reflect the low-nibble correction but precede the high-nibble BCD correction).
  - N is derived from tmp bit 7.
  - V uses the binary two's-complement overflow formula with A and tmp and the original operand imm as shown in the pseudocode.
- Step 6: Apply a BCD correction for the high nibble — if the (high-nibble region) exceeds the BCD threshold, add 0x60.
- Step 7: Compute the final Carry flag from the high bits of tmp after BCD fixup, then write tmp into A.

Timing/semantic notes preserved from the pseudocode:
- The Zero flag uses the binary 8-bit sum (A + imm + C) & 0xff.
- The N and V flags use binary logic and are computed after the lower-nibble fixup but before the high-nibble 0x60 correction and before the final Carry assignment.
- The final C flag is determined only after the complete BCD correction.

**[Note: Source may contain an unconventional mask usage — see Source Code comment below.]**

## Source Code
```text
/* A = value in Akku, imm = immediate argument, C = carry */
/* Calculate the lower nibble. */
tmp = (A & 0x0f) + (imm & 0x0f) + C;
/* BCD fixup for lower nibble. */
if (tmp > 9) { tmp += 6; }
if (tmp <= 15) {
    tmp = (tmp & 0x0f) + (A & 0xf0) + (imm & 0xf0);
} else {
    tmp = (tmp & 0x0f) + (A & 0xf0) + (imm & 0xf0) + 0x10;
}
/* Zero flag is set just like in Binary mode. */
Z = ((A + imm + C) & 0xff) ? 0 : 1;
/* Negative and Overflow flags are set with the same logic than in
   Binary mode, but after fixing the lower nibble. */
N = (tmp & 0x80) >> 7;
V = ((A ^ tmp) & 0x80) && !((A ^ imm) & 0x80);
/* BCD fixup for higher nibble. */
if ((tmp & 0x1f0) > 0x90) {
    tmp += 0x60;
}
/* Carry is the only flag set after fixing the result. */
C = (tmp & 0xff0) > 0xf0;
A = tmp;
```

## References
- "adc_opcode_table_and_decimal_flags" — expands on high-level ADC decimal-mode flag behavior and opcode contexts referenced by the pseudocode
- "adc_decimal_examples_and_compatibility" — expands on example usage patterns that rely on decimal-mode ADC behavior and the pseudocode's results