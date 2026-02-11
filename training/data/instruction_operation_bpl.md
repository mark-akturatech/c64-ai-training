# 6502 BPL (Branch on Plus) — pseudocode and cycle behavior

**Summary:** BPL (Branch on Plus) tests the 6502 Sign/Negative flag and, if clear, updates the program counter (PC) to a relative address. The instruction's timing depends on whether the branch is taken and if a page boundary is crossed.

**Operation**

BPL branches when the Negative/Sign flag is clear (N = 0). The branch target is computed by adding a signed 8-bit relative offset (REL_ADDR) to the address following the branch instruction.

Branch timing on the 6502:

- Branch not taken: 2 cycles.
- Branch taken: 3 cycles.
- Branch taken and crossing a 256-byte page boundary: 4 cycles.

The provided pseudocode accounts for the additional cycle adjustments when the branch is taken and when a page boundary is crossed. The base cycles (2 cycles) are applied unconditionally.

## Source Code

```asm
/* BPL */
    clk += 2; // Base cycles
    if (!IF_SIGN()) {
        clk += ((PC & 0xFF00) != (REL_ADDR(PC, src) & 0xFF00) ? 2 : 1);
        PC = REL_ADDR(PC, src);
    }
```

## References

- "6502 Instruction Set" — details on BPL opcode timings and formal opcode table entries.

## Mnemonics
- BPL
