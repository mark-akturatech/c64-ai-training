# BPL — Branch on Result Plus

**Summary:** BPL is the 6502 branch instruction that tests the N (negative) flag and branches if N = 0. Relative addressing, opcode 10 (decimal, $10 hex), 2 bytes, variable cycles with +1/+2 on taken/same-page or page-crossing branches; flags are unchanged. (Ref: 4.1.1.2)

## Operation
Branch when the Negative flag (N) is clear (N = 0). The instruction does not modify any processor flags. Condition tested: N.

## Addressing Mode and Timing
- Addressing: Relative — branch offset encoded as signed 8-bit displacement from the next instruction.
- Assembly form: BPL Oper
- Opcode: 10 (decimal) — $10 (hex)
- Size: 2 bytes
- Cycles: 2 base cycles; add 1 cycle if the branch is taken to an address on the same 256-byte page, add 2 cycles if the branch is taken to an address on a different page.

(Ref: 4.1.1.2)

## Source Code
```text
Operation:  Branch on N = 0                           N Z C I D V
                                                         _ _ _ _ _ _
                               (Ref: 4.1.1.2)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Relative      |   BPL Oper            |    10   |    2    |    2*    |
+----------------+-----------------------+---------+---------+----------+
* Add 1 if branch occurs to same page.
* Add 2 if branch occurs to different page.
```

## References
- "bne_branch_on_result_not_zero" — previous branch instruction (BNE)
- "brk_force_break" — next instruction (BRK)

## Mnemonics
- BPL
