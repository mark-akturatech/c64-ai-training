# BNE — Branch on Result Not Zero (6502)

**Summary:** BNE (opcode $D0) is a relative branch that transfers control when the zero flag (Z) is clear; uses Relative addressing with a signed 8-bit offset, 2 bytes, and timing 2/3/4 cycles depending on taken/page-crossing. (Ref: 4.1.1.6)

## Operation
Branch if Z = 0 (zero flag clear). The instruction does not modify processor flags (N, Z, C, I, D, V remain unchanged).

Addressing: Relative — operand is a signed 8-bit offset added to the program counter after the branch instruction (PC + 2), forming the target address.

Timing summary:
- 2 cycles if branch not taken.
- 3 cycles if branch taken to an address on the same 256-byte page.
- 4 cycles if branch taken and the target crosses a page boundary (additional +1 cycle).

**[Note: Source may contain an error — the assembly form was listed as "BMI Oper" in the original table; the correct form for opcode $D0 is "BNE Oper".]**

## Source Code
```text
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Relative      |   BNE Oper            |    D0   |    2    |    2*    |
+----------------+-----------------------+---------+---------+----------+

* Timing notes:
- 2 cycles = branch not taken.
- Add 1 cycle if branch is taken (same page) => 3 cycles.
- Add 1 additional cycle if branch is taken and crosses page boundary => 4 cycles total.
```

## References
- "bmi_branch_on_result_minus" — expands on the previous branch instruction (BMI)
- "bpl_branch_on_result_plus" — expands on the next branch instruction (BPL)

## Mnemonics
- BNE
