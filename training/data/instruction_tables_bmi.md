# BMI (Branch on Result Minus) — opcode $30

**Summary:** BMI ($30) is a relative-mode branch instruction that transfers control when the negative flag (N) = 1. Encoding is a one-byte opcode plus a signed 8-bit relative offset; cycles include a +1 for a taken branch and an additional +1 if the branch crosses a page boundary.

## Operation
Branches to PC + relative_offset if the N (negative) flag is set (N = 1). Does not modify any processor status flags.

- Condition tested: N = 1
- Addressing mode: Relative (signed 8-bit offset from next instruction)
- Encoding: 30 <offset>
- Operand size: 1 byte (offset)
- Effect on flags: None (N Z C I D V — unchanged)

Timing:
- 2 cycles when branch not taken.
- If branch is taken: +1 cycle.
- If branch is taken and target is on a different page: +1 additional cycle (total +2 when crossing page).

(Ref: 4.1.1.1)

## Source Code
```text
  BMI                    BMI Branch on result minus                     BMI

  Operation:  Branch on N = 1                           N Z C I D V
                                                        _ _ _ _ _ _
                               (Ref: 4.1.1.1)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Relative      |   BMI Oper            |    30   |    2    |    2*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 if branch occurs to same page.
  * Add 1 if branch occurs to different page.
```

## References
- "instruction_operation_bmi" — expands on BMI pseudocode and examples

## Mnemonics
- BMI
