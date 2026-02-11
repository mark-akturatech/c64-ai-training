# 6502 CLC — Clear Carry Flag

**Summary:** CLC (opcode $18) clears the processor carry flag (C = 0) on the 6502; addressing mode: implied. Useful searchable terms: CLC, $18, carry flag, 6502, implied addressing, 2 cycles.

**Description**
Clears the carry flag in the 6502 processor status register. CLC affects only the C flag (sets it to 0) and does not modify N, V, Z, or the other status bits. The instruction uses the implied addressing mode (no operand bytes).

Use cases: preparing for unsigned arithmetic or ensuring ADC/SBC behavior that depends on the carry bit.

**Encoding & Timing**
- Opcode: $18
- Bytes: 1
- Addressing mode: Implied
- Cycles: 2
- Flags affected: C -> 0
- Flags not affected: N, V, Z, D, I, B (unchanged)

## Source Code
```asm
; Pseudocode
; CLC
    SET_CARRY(0);
```

## References
- "instruction_tables_clc" — expands on CLC opcode (encoding, timing, variants)

## Mnemonics
- CLC
