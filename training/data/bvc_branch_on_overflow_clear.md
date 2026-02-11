# BVC — Branch on Overflow Clear (6502)

**Summary:** BVC (Branch on Overflow Clear) is a 6502 relative-branch instruction that tests the V flag and branches if V = 0. Mnemonic: BVC, opcode $50, addressing: Relative (8-bit signed offset), timing: 2 cycles base with +1/+2 page rules.

## Operation
Branches when the overflow flag (V) is clear (V = 0). Flags are not modified by this instruction (N Z C I D V unchanged). The Relative addressing form uses an 8-bit signed offset (relative to the address of the next instruction) to compute the branch target. (8-bit signed offset from next instruction)

(Ref: 4.1.1.8)

## Timing
- Base: 2 cycles.
- Add 1 cycle if the branch is taken and the target is on the same 256-byte page as the next instruction.
- Add 2 cycles if the branch is taken and the target crosses to a different 256-byte page.

## Source Code
```text
Addressing Mode | Assembly Form | OP CODE | No. Bytes | No. Cycles
----------------------------------------------------------------
Relative        | BVC Oper      | $50     |    2      |    2*
* Add 1 if branch occurs to same page.
* Add 2 if branch occurs to different page.

Example usage (assembly):
    BVC label    ; branch to label if V = 0 (offset encoded as signed 8-bit)
```

## References
- "brk_force_break" — expands on the previous instruction (BRK)
- "bvs_branch_on_overflow_set" — the paired branch instruction when V = 1 (BVS)

## Mnemonics
- BVC
