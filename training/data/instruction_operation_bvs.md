# 6502 BVS (Branch if Overflow Set)

**Summary:** BVS checks the 6502 Overflow flag (V) and, if set, performs a relative branch; timing depends on page crossing (adds 1 extra cycle if taken, +1 more if branch crosses a 256-byte page boundary). Searchable terms: BVS, Overflow flag, relative branch, page crossing, PC, cycles.

## Behavior
BVS tests the processor status Overflow flag (V). If V is set the instruction transfers control to a signed 8-bit relative offset from the instruction following the branch operand; otherwise execution continues to the next sequential instruction.

- Condition: branch taken when V = 1.
- Target calculation: REL_ADDR(PC, src) computes the 8-bit signed offset added to the PC value that points to the next instruction (i.e., PC after operand fetch).
- Side effects: Only the program counter (PC) and cycle count change. No status flags are modified.

## Timing (cycles)
Standard 6502 timing for branch instructions:
- Branch not taken: 2 cycles total.
- Branch taken, target on same page: 3 cycles total (base 2 + 1).
- Branch taken, target on different page: 4 cycles total (base 2 + 2).

The pseudocode provided increments clock cycles by 1 when the branch is taken and target stays on the same high-byte page, or by 2 if the target crosses a page boundary. The code assumes the base 2 cycles are accounted for elsewhere.

Page-cross detection is performed by comparing the high byte of the PC (before branching) with the high byte of the computed target address:
- If (PC & $FF00) != (target & $FF00) → page crossed.

## REL_ADDR detail
REL_ADDR(PC, src) semantics (as used here):
- Reads the signed 8-bit immediate operand at memory location src (the operand fetch).
- Interprets it as a signed two's-complement offset (-128..+127).
- Adds that offset to the PC value that points to the next instruction (PC after operand fetch).
- Returns the 16-bit target address.

Important: When emulating, ensure PC passed to REL_ADDR is the value after fetching the branch operand; using the current instruction address will produce an incorrect target.

## Implementation notes for emulators
- Ensure base 2 cycles for branches are applied even when branch not taken.
- When the branch is taken:
  - Add 1 cycle for taking the branch.
  - If the target crosses a page boundary (high byte changes), add an additional cycle.
- Use integer arithmetic with signed 8-bit offset when computing REL_ADDR to handle negative and positive branches correctly.
- Compare high bytes using PC & $FF00 before updating PC.

## Source Code
```text
/* BVS */
    if (IF_OVERFLOW()) {
	clk += ((PC & 0xFF00) != (REL_ADDR(PC, src) & 0xFF00) ? 2 : 1);
	PC = REL_ADDR(PC, src);
    }
```

## References
- "instruction_tables_bvc_bvs" — expands on BVC/BVS opcode summary and timing details.

## Mnemonics
- BVS
