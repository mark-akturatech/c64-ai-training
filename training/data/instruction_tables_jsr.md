# JSR (Absolute) — Opcode $20

**Summary:** JSR (opcode $20) — Absolute addressing. Pushes the return address (PC+2) onto the stack and sets PC to the target address. Instruction length 3 bytes, 6 clock cycles, does not affect processor flags (N Z C I D V).

## Description
JSR Oper (Absolute)
- Fetches a 16-bit absolute address operand (low byte then high byte) following the opcode.
- Pushes the return address onto the stack so that an RTS will return to the instruction after the JSR:
  - The source lists the pushed bytes as (PC+1) -> PCL and (PC+2) -> PCH (i.e., low then high of PC+2 as shown in the source).
- Loads the target address into the PC and begins execution there.
- Instruction effects on flags: none (N Z C I D V are unchanged).

Timing and size:
- Bytes: 3
- Cycles: 6

Behavioral note:
- The source describes the return address as "PC + 2" being pushed. This is consistent with saving the address of the last byte of the JSR instruction so that RTS can return to the next instruction.

## Source Code
```text
Operation:  PC + 2 toS, (PC + 1) -> PCL               N Z C I D V
                        (PC + 2) -> PCH               _ _ _ _ _ _
                               (Ref: 8.1)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Absolute      |   JSR Oper            |    20   |    3    |    6     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_jsr" — expands on JSR stack sequence pseudocode
- "stack_instructions_table" — expands on stack use by JSR/RTS

## Mnemonics
- JSR
