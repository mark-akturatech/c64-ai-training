# JSR — Jump to new location saving return address

**Summary:** JSR (Absolute) saves the return address (PC+2) on the stack and transfers control to an absolute operand; opcode $20, 3 bytes, 6 cycles, flags unaffected (N Z C I D V).

## Description
JSR performs a subroutine call: it saves the return address on the stack and loads the program counter with the 16-bit absolute operand. According to the source notation, the operation pushes PC + 2 to the stack and places (PC + 1) into the low byte and (PC + 2) into the high byte (as shown below). All processor status flags are unchanged by JSR.

- Addressing mode: Absolute
- Assembly form: JSR Oper
- Opcode: $20
- Instruction size: 3 bytes
- Cycles: 6
- Flags: N Z C I D V — unaffected

## Source Code
```text
JSR          JSR Jump to new location saving return address           JSR

Operation:  PC + 2 to S, (PC + 1) -> PCL               N Z C I D V
                        (PC + 2) -> PCH               _ _ _ _ _ _
                               (Ref: 8.1)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Absolute      |   JSR Oper            |    20   |    3    |    6     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "jmp_jump" — expands on JMP (unconditional jump without saving return address)
- "rts_return_subroutine" — expands on RTS (return from subroutine)

## Mnemonics
- JSR
