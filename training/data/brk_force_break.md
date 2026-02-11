# BRK — Force Break (software interrupt)

**Summary:** BRK ($00) is the implied Force Break software interrupt instruction on the 6502/C64; it pushes PC+2 and the processor status to the stack, sets the Interrupt Disable bit in the pushed status, is 1 byte and takes 7 cycles, and cannot be masked by setting I.

## Operation
BRK performs a forced software interrupt. On execution:
- The return address pushed is PC + 2.
- The processor status (P) is pushed to the stack (the manual indicates behavior for P bit 4).
- The pushed status shows the Interrupt Disable (I) bit set in the snapshot pushed to the stack (status mask shown as N Z C I D V = _ _ _ 1 _ _ in the source).
- BRK is an implied addressing instruction and is not blocked by the Interrupt Disable flag (I); a BRK command cannot be masked by setting I.

(Ref: 9.11)

## Source Code
```text
BRK                          BRK Force Break                          BRK

Operation:  Forced Interrupt PC + 2 toS P toS         N Z C I D V
                                                      _ _ _ 1 _ _
                               (Ref: 9.11)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   BRK                 |    00   |    1    |    7     |
+----------------+-----------------------+---------+---------+----------+

1. A BRK command cannot be masked by setting I.

238   BASIC TO MACHINE LANGUAGE
~
```

## References
- "bpl_branch_on_result_plus" — expands on previous branch instruction (BPL)
- "bvc_branch_on_overflow_clear" — expands on next branch instruction (BVC)

## Mnemonics
- BRK
