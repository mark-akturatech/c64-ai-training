# NMOS 6510 ARR instruction (opcode $6B)

**Summary:** ARR #imm (opcode $6B) is an undocumented 6502/6510 immediate instruction that performs A = ROR(A & #imm) (AND then ROR). It affects flags N, V, Z and C and contains ADC-like BCD fixups when Decimal mode (D=1) is active.

## Operation
- Type: combination immediate + implied (sub-operations: AND, then ROR)
- Opcode: $6B
- Size: 2 bytes
- Cycles: 2 (as shown in source)
- Mnemonic: ARR #imm

Behavior (binary mode):
- Compute tmp = A & imm.
- Perform ROR on tmp with the processor Carry as the high bit input.
- Set N from the original Carry (C) before the ROR.
- Set Z if the ROR result is zero.
- Set V if bit 6 changed between the AND result and the ROR result (i.e., (tmp2 ^ tmp) & 0x40 != 0).
- Update A with the ROR result.

Decimal-mode (D=1) specifics (preserved from source):
- ARR first performs the AND and ROR as in binary mode.
- N is copied from the initial C flag (the carry used as input to the ROR).
- Z is set from the ROR result.
- V is set if bit 6 of the accumulator changed state between the AND result and the ROR result.
- BCD fixups:
  - Low-nibble fixup: if ((low nibble of tmp) + (tmp & 0x1)) > 5, add 6 to the low nibble of the ROR result. This low-nibble adjustment may overflow into the high nibble, but the high nibble is not adjusted by that overflow.
  - High-nibble fixup and Carry: if ((high nibble of tmp) + (tmp & 0x10)) > 0x50, add 0x60 to the high nibble of the ROR result and set Carry; otherwise clear Carry.
- The instruction therefore embeds ADC-like decimal correction rules in its final result and carry update.

## Source Code
```text
/* Pseudocode from source (preserves original logic and variable names)
   A = value in Akku, imm = immediate argument, C = carry */

tmp = A & imm;             /* perform the AND */

/* perform ROR using original carry as high bit */
tmp2 = tmp | (C << 8);
tmp2 >>= 1;

N = C; /* original carry state is preserved in N */
Z = (tmp2 == 0 ? 1 : 0); /* Z is set when the ROR produced a zero result */

/* V is set when bit 6 of the accumulator changed between AND result and ROR result */
V = ((tmp2 ^ tmp) & 0x40) >> 6;

/* fixup for low nibble (BCD correction) */
if (((tmp & 0x0f) + (tmp & 0x01)) > 0x05) {
    tmp2 = (tmp2 & 0xf0) | ((tmp2 + 0x06) & 0x0f);
}

/* fixup for high nibble, set carry */
if (((tmp & 0xf0) + (tmp & 0x10)) > 0x50) {
    tmp2 = (tmp2 & 0x0f) | ((tmp2 + 0x60) & 0xf0);
    C = 1;
} else {
    C = 0;
}

A = tmp2;
```

Test program filenames (from source):
- CPU/decimalmode/arr00.prg
- CPU/decimalmode/arr01.prg
- CPU/decimalmode/arr02.prg
- CPU/decimalmode/arr10.prg
- CPU/decimalmode/arr11.prg
- CPU/decimalmode/arr12.prg

## References
- "CPU/decimalmode/arr00.prg" — test: ARR decimal-mode cases (low nibble)
- "CPU/decimalmode/arr01.prg" — test: ARR decimal-mode cases
- "CPU/decimalmode/arr02.prg" — test: ARR binary/decimal interactions
- "CPU/decimalmode/arr10.prg" — test: ARR high-nibble / carry behavior
- "CPU/decimalmode/arr11.prg" — test: ARR additional decimal cases
- "CPU/decimalmode/arr12.prg" — test: ARR edge cases
- "sbc_instruction_decimal_mode_overview" — related decimal-mode fixup behavior (SBC and general BCD rules)