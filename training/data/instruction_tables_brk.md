# 6502 Instructions: BRK ($00) and BVC ($50)

**Summary:** BRK (opcode $00) is the software "Force Break" instruction that pushes PC+2 and the processor status to the stack, sets the B and I flags, and loads the PC from the vector at $FFFE/$FFFF (7 cycles). BVC (opcode $50) is a relative branch that occurs when the overflow flag V = 0 (base 2 cycles; extra cycles if branch taken or page-crossed).

## Operation
BRK (Force Break)
- Addressing: Implied.
- Behavior: Forces an interrupt sequence: pushes (PC + 2) and the status register (P) to the stack, sets the Break and Interrupt Disable flags (B and I), then loads the new PC from the IRQ/BRK vector at $FFFE/$FFFF.
- Flags: Sets I and B as part of the sequence; other flags unaffected by BRK itself.
- Timing: 7 cycles.
- Notes: A BRK instruction is not prevented by the Interrupt Disable (I) flag — it always initiates the software break sequence.

BVC (Branch on Overflow Clear)
- Addressing: Relative (signed 8-bit offset).
- Behavior: Branches to target address when V = 0.
- Flags: No processor status flags are modified by the instruction.
- Encoding: opcode $50, 2 bytes (opcode + offset).
- Timing: 2 cycles base. If the branch is taken, add 1 cycle; if the branch is taken and crosses a page boundary, add 2 cycles instead of 1 (i.e., +2 for page-cross).

## Source Code
```text
BRK                          BRK Force Break                          BRK

Operation:  Forced Interrupt    PC + 2   toS    P toS        N Z C I D V
                                                   _ _ _ 1 _ _
                                 (Ref: 9.11)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   BRK                 |    00   |    1    |    7     |
+----------------+-----------------------+---------+---------+----------+

1. A BRK command cannot be masked by setting I.


BVC                   BVC Branch on overflow clear                    BVC

Operation:  Branch on V = 0                       N Z C I D V
                                                   _ _ _ _ _ _
                               (Ref: 4.1.1.8)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Relative      |   BVC Oper            |    50   |    2    |    2*    |
+----------------+-----------------------+---------+---------+----------+

* Add 1 if branch occurs to same page.
* Add 2 if branch occurs to different page.
```

## References
- "instruction_operation_brk" — expands on BRK pseudocode and stack sequence

## Mnemonics
- BRK
- BVC
