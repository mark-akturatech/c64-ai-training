# NMOS 6510 undocumented opcode $EB — SBC #imm

**Summary:** Undocumented NMOS 6510 opcode $EB implements SBC #imm (immediate subtract with carry). Function A = A - #{imm}, size 2 bytes, 2 clock cycles; flags affected: N, V, Z, C (same behavior as regular SBC immediate).

**Details**
- **Type:** Immediate
- **Opcode:** $EB
- **Mnemonic:** SBC #imm
- **Function:** A = A - #{imm} (subtract immediate from accumulator, with borrow/carry)
- **Size:** 2 bytes
- **Cycles:** 2
- **Flags affected:** N (negative), V (overflow), Z (zero), C (carry/borrow)
- **Operation:** Performs subtraction of the immediate operand from the accumulator using the processor carry as borrow, operating the same as the documented SBC immediate instruction.

## References
- "Lorenz-2.15/sbcb-eb.prg" — test code referenced for opcode $EB
- "sbx_toggle_bit_with_carry_example" — related discussion of subtraction and carry/flag effects
- "las_opcode_entry" — next undocumented opcode entry in sequence

## Mnemonics
- SBC
