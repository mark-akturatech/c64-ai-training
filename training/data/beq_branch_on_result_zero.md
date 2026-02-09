# COMMODORE 64 - BEQ — Branch on Result Zero

**Summary:** BEQ ($F0) branches when the Z flag = 1; uses Relative addressing (signed 8-bit offset) and does not modify processor flags. Timing: 2 bytes, 2 cycles base; +1 cycle if branch taken within same 256-byte page, +2 cycles if branch taken to a different page.

## Operation
BEQ tests the Zero (Z) flag and performs a branch if Z = 1. No processor status flags are changed by this instruction. (Ref: 4.1.1.5)

- Condition: branch when Z = 1.
- Flags affected: none (N Z C I D V — unchanged).
- Addressing: Relative (signed 8-bit offset from the next instruction).
- Typical use: conditional forward/backward jumps within ±128 bytes of the following instruction.

## Addressing and Timing
- Opcode: $F0
- Size: 2 bytes (opcode + 8-bit offset)
- Timing:
  - 2 cycles if branch is not taken.
  - If branch is taken: add 1 cycle when target is on the same 256-byte page as the next instruction.
  - If branch is taken and crosses a 256-byte page boundary: add 2 cycles (compared to base 2 cycles), resulting in 4 cycles total.

## Source Code
```text
  BEQ                    BEQ Branch on result zero                      BEQ
                                                        N Z C I D V
  Operation:  Branch on Z = 1                           _ _ _ _ _ _
                               (Ref: 4.1.1.5)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Relative      |   BEQ Oper            |    F0   |    2    |    2*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 if branch occurs to same  page.
  * Add 2 if branch occurs to next  page.
```

## Key Registers
- (none)

## References
- "bcs_branch_on_carry_set" — expands on previous branch instruction (BCS)
- "bit_test_bits_instruction" — expands on next table entry (BIT)