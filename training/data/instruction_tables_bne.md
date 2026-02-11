# 6502 BNE (Branch on Result Not Zero) — opcode $D0

**Summary:** BNE (opcode $D0) is a Relative-mode branch instruction that transfers control when the zero flag (Z) = 0. Timing: 2 bytes, 2 cycles base; +1 cycle if branch taken on same page, +2 cycles if branch taken and page crossed.

## Operation
Branch when Z = 0. The instruction tests the processor status zero flag; if Z is clear, it adds a signed 8-bit relative offset to the program counter to form the branch target (offset is a signed 8-bit value added to PC+2). BNE does not modify processor flags.

**Flags affected:** none (N Z C I D V remain unchanged)

**[Note: Source may contain an error — assembly language form is shown as "BMI Oper" but opcode $D0 and the mnemonic BNE are correct.]**

## Timing and Addressing
- Addressing mode: Relative (signed 8-bit offset)
- Opcode: $D0
- Bytes: 2
- Cycles:
  - 2 cycles if branch not taken (no transfer)
  - If branch is taken: +1 cycle (3 cycles total) when target is on the same 256-byte page as the next instruction
  - If branch is taken and target crosses a page boundary: +2 cycles (4 cycles total)

## Source Code
```text
  BNE                   BNE Branch on result not zero                   BNE

  Operation:  Branch on Z = 0                           N Z C I D V
                                                        _ _ _ _ _ _
                               (Ref: 4.1.1.6)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Relative      |   BMI Oper            |    D0   |    2    |    2*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 if branch occurs to same page.
  * Add 2 if branch occurs to different page.
```

## References
- "instruction_operation_bne" — expands on BNE pseudocode and operation details

## Mnemonics
- BNE
- BNZ
