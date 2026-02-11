# BVC — Branch on Overflow Clear

**Summary:** BVC (6502) tests the Overflow flag (P.V) and, if clear, adds a signed relative offset to the program counter (PC). Uses relative addressing; branch-not-taken and page-crossing affect cycle count (2 / 3 / 4 cycles).

## Operation
BVC checks the processor status Overflow flag (V). If V is clear, the instruction computes a relative target address from the current PC plus an 8-bit signed displacement (REL_ADDR) and sets PC to that target. Cycle accounting for branch instructions on the 6502:

- If the branch is not taken: 2 cycles.
- If the branch is taken and the target is on the same 256-byte page as the PC: 3 cycles (branch-taken adds +1).
- If the branch is taken and the target crosses a page boundary: 4 cycles (branch-taken + page-crossing adds +2).

Page crossing detection is done by comparing the high byte of the current PC and the high byte of the computed target:
- (PC & $FF00) != (target & $FF00) → page crossed.

REL_ADDR(PC, src) denotes PC + sign_extend(src) where src is the 8-bit relative displacement (signed). (PC is the address after fetching the branch operand.)

## Source Code
```asm
/* BVC pseudocode */
    if (!IF_OVERFLOW()) {
        clk += ((PC & 0xFF00) != (REL_ADDR(PC, src) & 0xFF00) ? 2 : 1);
        PC = REL_ADDR(PC, src);
    }
```

## References
- "instruction_tables_bvc_bvs" — BVC/BVS opcode summary and tables

## Mnemonics
- BVC
