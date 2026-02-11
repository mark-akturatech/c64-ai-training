# 6502 ADC (Add with Carry) — pseudocode and flag rules

**Summary:** ADC performs A + M + C with binary and BCD (decimal) modes, affects processor status flags C (carry), Z (zero), V (overflow), S (sign). Includes decimal-mode adjustments (add 6 / add 96) and the standard overflow detection formula.

## Operation
Performs a full-byte addition of the accumulator (AC), memory operand (src), and the carry-in (C). The implementation must handle two modes: binary (default) and decimal (BCD, when D flag set).

Steps (preserves original variable names):
- Compute a wider temporary sum: temp = src + AC + (C ? 1 : 0).
- Zero flag: SET_ZERO(temp & 0xff); (source notes this is not valid in decimal mode)
- Binary mode:
  - Sign (S) set from the resulting 8-bit value (bit 7).
  - Overflow (V) uses the two's-complement overflow detection: V = (!((AC ^ src) & 0x80)) && ((AC ^ temp) & 0x80)
  - Carry (C) set if temp > 0xFF.
- Decimal (BCD) mode:
  - If low nibble sum > 9, add 6 to temp (BCD adjust).
  - Set Sign from resulting 8-bit value.
  - Overflow computed using the same two's-complement test as binary mode (based on AC, src, temp).
  - If temp > 0x99 after nibble adjust, add 96 (0x60) to temp (BCD carry adjust).
  - Carry (C) set if temp > 0x99.
- Final accumulator: AC = (BYTE)temp (low 8 bits stored).

Notes:
- Overflow detection formula used here is the common 6502 form: V = (~(A ^ M) & (A ^ R) & 0x80) != 0 (equivalently the code uses bitwise tests with XOR/AND logic).
- The pseudocode explicitly warns that SET_ZERO(temp & 0xff) "is not valid in decimal mode" (left as in source).

## Source Code
```asm
/* ADC */
    unsigned int temp = src + AC + (IF_CARRY() ? 1 : 0);
    SET_ZERO(temp & 0xff);	/* This is not valid in decimal mode */
    if (IF_DECIMAL()) {
        if (((AC & 0xf) + (src & 0xf) + (IF_CARRY() ? 1 : 0)) > 9) temp += 6;
	SET_SIGN(temp);
	SET_OVERFLOW(!((AC ^ src) & 0x80) && ((AC ^ temp) & 0x80));
	if (temp > 0x99) temp += 96;
	SET_CARRY(temp > 0x99);
    } else {
	SET_SIGN(temp);
	SET_OVERFLOW(!((AC ^ src) & 0x80) && ((AC ^ temp) & 0x80));
	SET_CARRY(temp > 0xff);
    }
    AC = ((BYTE) temp);
```

## References
- "instruction_tables_adc" — expands ADC opcode table and cycle counts
- "status_register" — details flags affected by ADC: C, Z, V, S (and D for decimal mode)

## Mnemonics
- ADC
