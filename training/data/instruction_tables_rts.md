# RTS (Return from Subroutine) — 6502 opcode $60

**Summary:** RTS is the 6502 implied-mode return-from-subroutine instruction (opcode $60). It pulls a 16-bit return address from the stack (low then high), adds 1, loads it into the PC, does not affect processor flags, and takes 6 cycles.

## Operation
RTS restores the program counter from the stack and then increments it by one so execution resumes at the instruction following the original JSR. Flags are not affected.

Pseudocode:
- PCL := pull()        ; pull low byte from stack (stack increments)
- PCH := pull()        ; pull high byte from stack
- PC := (PCH << 8) | PCL
- PC := PC + 1

Behavior notes:
- Addressing mode: implied.
- Opcode: $60.
- Instruction length: 1 byte.
- Cycles: 6.
- Flags: N, V, B, D, I, Z, C — none are changed by RTS.

## Stack sequence and addressing details
- The 6502 stack resides at page 1: memory $0100 + S. S is the 8-bit stack pointer (initially $FF after reset).
- JSR pushes the return address (the address of the last byte of the JSR operand) onto the stack (high then low). RTS pulls low then high and increments the pulled 16-bit value by one to form the final return PC.
- Example flow (conceptual):
  - Before JSR: PC points to JSR opcode; after JSR executes, return address (address of JSR last operand byte) is on stack.
  - RTS pulls low then high, forms address, adds 1, and sets PC to that value — resuming at the instruction immediately after the original JSR.

## Source Code
```text
Operation:  PC fromS, PC + 1 -> PC                    (Ref: 8.2)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   RTS                 |    $60  |    1    |    6     |
+----------------+-----------------------+---------+---------+----------+
```

```asm
; Pseudocode (conceptual)
; pull = read from $0100 + (S + 1) and increment S

PCL = pull()        ; pull low byte from stack
PCH = pull()        ; pull high byte
PC = (PCH << 8) | PCL
PC = PC + 1
```

## References
- "instruction_operation_rts" — expands on RTS pseudocode and stack sequence

## Mnemonics
- RTS
