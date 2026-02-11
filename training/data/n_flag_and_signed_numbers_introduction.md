# N (Negative / High-Bit) Flag

**Summary:** Describes the 6502 processor status N flag (negative/high-bit), its relation to the high bit of register results, interaction with BMI/BPL branches, and two's-complement signed-number interpretation (examples: LDA #$65, LDX #$DA, LDA #$C8).

## Operation of the N flag
The N flag reflects the high (bit 7) of a register result: it is set when the most-significant bit of the result is 1, and cleared when that bit is 0. It is updated by virtually every instruction that changes a register (loads, arithmetic, logical operations, comparisons, etc.). Comparison instructions (e.g., CMP/CPX/CPY) also affect N, though that N value is frequently not meaningful by itself.

Branch behavior:
- BMI — branch if N = 1 (negative/high-bit set).
- BPL — branch if N = 0 (negative/high-bit clear).

Examples in binary/hex:
- LDA #$65 → $65 = %01100101 → bit 7 = 0 → N cleared.
- LDX #$DA → $DA = %11011010 → bit 7 = 1 → N set.
- LDA #$C8 → $C8 = 200 decimal, bit 7 = 1 → N set (appears "negative" only under signed interpretation).

## Signed numbers and two's-complement
Whether a byte is unsigned (0..255) or signed (-128..+127) is a programmer convention; the hardware only stores bits. Signed integers on the 6502 are represented in two's-complement form, where the high bit indicates negative values when interpreted as signed:

Common two's-complement mappings:
- -1  → $FF
- -2  → $FE
- ...
- -128 → $80

Counting down past zero in hex (illustrates wrap/ten's-complement analogy):
- $10, $0F, $0E, ..., $02, $01, $00, $FF (== -1 signed), $FE (== -2), $FD (== -3), ...

Decimal analogy: wrap-around counters (odometer style) produce negative interpreted values when viewed in two's-complement; the underlying bit pattern is identical — only the interpretation (unsigned vs signed) changes.

## References
- "c_flag_description" — expands on Other flag descriptions (C)
- "v_flag_and_overflow" — expands on Signed-number overflow and the V flag
- "comparison_instructions_and_branch_usage" — expands on How compares interact with N in practice
