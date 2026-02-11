# 6502 SBC (Subtract with Carry) — pseudocode and flag behavior

**Summary:** Pseudocode for the 6502 SBC instruction showing arithmetic temp = AC - src - borrow, Sign/Zero/Overflow flag calculations, decimal-mode (BCD) adjustments, Carry determination, and final AC result (low byte). Mentions status flags C (carry) and D (decimal).

## Operation and flag effects
This chunk describes one canonical implementation of SBC (Subtract with Carry) on the 6502:

- Primary arithmetic: temp = AC - src - borrow, where borrow = IF_CARRY() ? 0 : 1 (the carry flag is inverted for subtraction).
- Sign (N) and Zero (Z) are set from temp (low byte) by SET_SIGN and SET_ZERO as shown; the source comments that Sign and Zero are invalid in decimal mode.
- Overflow (V) uses the classic two-xor test: an overflow occurs when the sign of AC differs from the result and the sign of AC differs from the source: SET_OVERFLOW(((AC ^ temp) & 0x80) && ((AC ^ src) & 0x80)).
- Decimal mode (D flag) uses BCD adjustment rules:
  - If the lower nibble borrows (i.e., (AC & 0xF) - borrow < (src & 0xF)), subtract 6 from temp to correct nibble result.
  - If after that temp > 0x99, subtract 0x60 to correct the tens place.
- Carry flag (C) is set according to whether the subtraction produced no borrow: SET_CARRY(temp < 0x100). AC is finalised to the low byte: AC = temp & 0xFF.

Notes on semantics derived directly from the pseudocode:
- Borrow is computed as (IF_CARRY() ? 0 : 1).
- Overflow calculation uses the pre-correction temp (set before decimal corrections in this pseudocode).
- Decimal correction is applied after initial flag settings in this implementation.
- The final AC is the low 8 bits of temp; Carry indicates no borrow (temp < 0x100).

## Source Code
```c
/* SBC */
    unsigned int temp = AC - src - (IF_CARRY() ? 0 : 1);
    SET_SIGN(temp);
    SET_ZERO(temp & 0xff);	/* Sign and Zero are invalid in decimal mode */
    SET_OVERFLOW(((AC ^ temp) & 0x80) && ((AC ^ src) & 0x80));
    if (IF_DECIMAL()) {
	if ( ((AC & 0xf) - (IF_CARRY() ? 0 : 1)) < (src & 0xf)) /* EP */ temp -= 6;
	if (temp > 0x99) temp -= 0x60;
    }
    SET_CARRY(temp < 0x100);
    AC = (temp & 0xff);
```

Additional search hints (not embedded):
- "instruction_tables_sbc" — expands on SBC opcode table and decimal-mode behavior
- "status_register" — expands on C and D flags used in SBC behavior

## References
- "instruction_tables_sbc" — SBC opcode table and detailed decimal-mode behavior
- "status_register" — definitions and semantics of the C (carry) and D (decimal) flags

## Mnemonics
- SBC
