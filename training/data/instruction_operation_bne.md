# 6502 BNE (Branch if Not Equal) — pseudocode and timing

**Summary:** BNE tests the Zero flag and, if clear, adds cycles for a taken branch and an extra cycle if the branch target crosses a 256-byte page boundary; target is computed as a relative (signed 8-bit) address. Searchable terms: BNE, Zero flag, relative addressing, page crossing, cycles.

## Description
BNE (Branch if Not Equal) is a relative branch that is taken when the processor Zero (Z) flag is clear. When taken, the implementation must:
- Compute the branch target using the signed 8-bit relative operand (REL_ADDR).
- Add 1 extra clock cycle for a taken branch, and add a second extra clock cycle if the target lies on a different 256-byte page than the current PC (page crossing).

Typical cycle outcomes for BNE:
- Not taken: 2 cycles
- Taken, same page: 3 cycles
- Taken, different page (page crossed): 4 cycles

REL_ADDR(PC, src) denotes the branch target computed by adding the signed 8-bit offset src to PC (the implementation's PC value at that point). (REL_ADDR performs two's-complement sign extension of the 8-bit operand.)

## Source Code
```asm
/* BNE */
    if (!IF_ZERO()) {
	clk += ((PC & 0xFF00) != (REL_ADDR(PC, src) & 0xFF00) ? 2 : 1);
	PC = REL_ADDR(PC, src);
    }
```

## References
- "instruction_tables_bne" — expands on BNE opcode and timing

## Mnemonics
- BNE
