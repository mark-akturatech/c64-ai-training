# BVS — Branch on Overflow Set

**Summary:** BVS is the 6502/Commodore 64 branch instruction that transfers control when the V (overflow) flag = 1; uses Relative addressing, mnemonic BVS, opcode $70, 2 bytes, and variable cycles (2 + page/same-page penalties).

## Operation
Branch (take the relative branch) when V = 1. Flags unaffected: N Z C I D V remain unchanged. (Ref: 4.1.1.7)

- Condition: V = 1 (overflow flag set).
- Effect on flags: none (no flags are modified).
- Operand: Relative signed 8-bit displacement (PC-relative; displacement added to the address of the next instruction).
- Note: When the source shows opcode "70" it is the hexadecimal opcode $70. **[Note: Source lists opcode as "70" — interpreted here as hex $70.]**

## Addressing and Timing
- Addressing mode: Relative (signed 8-bit offset).
- Instruction length: 2 bytes (opcode + relative offset).
- Base cycles: 2 cycles.
- Cycle penalties when branch is taken:
  - +1 cycle if the branch is taken and the target is on the same 256-byte page.
  - +2 cycles if the branch is taken and the target crosses to a different 256-byte page.

## Source Code
```text
  BVS                    BVS Branch on overflow set                     BVS

  Operation:  Branch on V = 1                           N Z C I D V
                                                        _ _ _ _ _ _
                               (Ref: 4.1.1.7)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Relative      |   BVS Oper            |    70   |    2    |    2*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 if branch occurs to same page.
  * Add 2 if branch occurs to different page.
```

## References
- "bvc_branch_on_overflow_clear" — paired branch instruction (BVC)
- "clc_clear_carry_flag" — the next instruction in example sequences (CLC)