# BCC (Branch if Carry Clear) — 6502 pseudocode

**Summary:** BCC (branch on carry clear) tests the processor Carry flag and, if clear, computes a relative target address and increments clock cycles for a taken branch and for page crossing; uses PC and an 8-bit signed relative offset (REL_ADDR), and checks high-byte change for page crossing.

## Operation
- Condition: If Carry flag is clear (IF_CARRY() == false), the branch is taken.
- Target calculation: REL_ADDR(PC, src) — compute the branch target using the current PC and the 8-bit signed relative offset (relative addressing).
- Cycle accounting when branch taken:
  - Add 1 cycle for a taken branch.
  - Add an additional 1 cycle if the branch target crosses a page boundary (high byte of PC changes).
  - The routine detects page crossing by comparing high bytes:
    (PC & 0xFF00) != (REL_ADDR(PC, src) & 0xFF00)
- PC update: When the branch is taken, set PC to the computed relative address.

Notes:
- IF_CARRY() is the Carry flag test (true if Carry set).
- REL_ADDR(PC, src) denotes PC combined with the signed 8-bit offset (relative addressing).

## Source Code
```text
/* BCC */
    if (!IF_CARRY()) {
        clk += ((PC & 0xFF00) != (REL_ADDR(PC, src) & 0xFF00) ? 2 : 1);
        PC = REL_ADDR(PC, src);
    }
```

## References
- "instruction_tables_bcc" — expands on BCC opcode and timing

## Mnemonics
- BCC
