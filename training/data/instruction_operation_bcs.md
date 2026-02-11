# BCS — Branch if Carry Set (6502)

**Summary:** BCS checks the processor Carry flag and, if set, computes the 16-bit relative target (REL_ADDR) and adds extra clock cycles for a taken branch: +1 cycle if target is on the same 256-byte page, +2 cycles if the branch crosses a page boundary. Affects PC (program counter) and depends on the Carry flag.

## Operation
BCS (Branch if Carry Set) is a conditional relative branch:
- Test: the Carry flag in the processor status.
- If Carry is clear: no branch taken; PC is left unchanged by this snippet (other fetch/advance logic handled elsewhere).
- If Carry is set: compute the 16-bit relative target using REL_ADDR(PC, src) (REL_ADDR returns a 16-bit address formed by sign-extending the 8-bit branch offset and adding it to PC), detect page crossing by comparing the high byte of current PC and of the target, add cycles accordingly, and set PC to the target.

Page-cross detection in the snippet uses:
- ((PC & 0xFF00) != (REL_ADDR(PC, src) & 0xFF00)) — compares high bytes of PC and target to detect crossing a 256-byte boundary.

Timing note (standard 6502 behavior inferred from this code):
- Branch not taken: base cycles only (handled externally).
- Branch taken, same page: base + 1 extra cycle.
- Branch taken, page crossed: base + 2 extra cycles.
(Usually this yields totals of 3 cycles if taken same page, 4 if page crossed when base is 2 cycles.)

## Source Code
```text
/* BCS */
    if (IF_CARRY()) {
	clk += ((PC & 0xFF00) != (REL_ADDR(PC, src) & 0xFF00) ? 2 : 1);
	PC = REL_ADDR(PC, src);
    }
```

## References
- "instruction_tables_bcs" — expands on BCS opcode timing and encoding

## Mnemonics
- BCS
