# JMP (Jump) — Absolute ($4C) and Indirect ($6C)

**Summary:** JMP absolute ($4C) and JMP indirect ($6C) set the program counter (PC) to a new 16-bit target. JMP absolute reads a 16-bit immediate operand at (PC+1),(PC+2); JMP indirect reads a 16-bit vector from memory (an address stored in two bytes). Opcodes: $4C, $6C.

## Description
JMP transfers control by loading a new 16-bit value into the program counter (PC). Two addressing modes:

- Absolute (JMP Oper): The instruction contains a 16-bit target address in the instruction operand bytes. The low byte of the operand (at PC+1) becomes PCL, the high byte (at PC+2) becomes PCH. Instruction length: 3 bytes. Cycles: 3. No processor status flags are affected.

- Indirect (JMP (Oper)): The instruction operand is a 16-bit pointer (vector) which itself is an address in memory where the 16-bit target is stored. The processor reads the low byte from memory at the pointer address and the high byte from the following memory location; these form the new PCL/PCH. Instruction length: 3 bytes. Cycles: 5. No processor status flags are affected.

Effects on flags: none (N Z C I D V unchanged).

Operation summary (explicit):
- Absolute: (PC+1) -> PCL; (PC+2) -> PCH
- Indirect: operand = word at (PC+1, PC+2); read low = M[operand]; high = M[operand+1]; PCL <- low; PCH <- high

## Source Code
```text
Operation:  (PC + 1) -> PCL                           N Z C I D V
            (PC + 2) -> PCH   (Ref: 4.0.2)            _ _ _ _ _ _
                                  (Ref: 9.8.1)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Absolute      |   JMP Oper            |    4C   |    3    |    3     |
|  Indirect      |   JMP (Oper)          |    6C   |    3    |    5     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "addressing_modes_indirect" — expands on JMP (Indirect) explanation
- "instruction_operation_jmp" — expands on JMP pseudocode

## Mnemonics
- JMP
