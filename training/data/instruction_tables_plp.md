# PLP (Pull Processor Status) — opcode $28

**Summary:** PLP (opcode $28) is an implied 6502 instruction that pulls the processor status byte from the stack into the P register (processor status). Encoding: 1 byte, 4 cycles, affects flags N Z C I D V.

## Operation
PLP restores the processor status register P from the value previously pushed onto the stack (typically by PHP or BRK). The instruction reads one byte from the stack and places that byte into P; all flag bits are loaded from the pulled byte. Addressing: implied. Size: 1 byte. Timing: 4 cycles.

Pseudocode (6502 behavior):
- Increment stack pointer, then read from stack page:
  - S := S + 1
  - P := M[$0100 + S]
- Flags N, Z, C, I, D, V are taken from the corresponding bits of P.

Reference: See "instruction_operation_plp" for expanded pseudocode and details (Ref: 8.12).

## Source Code
```text
Instruction: PLP
Assembly form: PLP
Opcode: $28
Bytes: 1
Cycles: 4
Addressing Mode: Implied

Operation: P <- From Stack
Flags affected: N Z C I D V   (loaded from the pulled byte)

Summary table:
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   PLP                 |   $28   |    1    |    4     |
+----------------+-----------------------+---------+---------+----------+

Pseudocode:
  ; Pull processor status from stack into P
  S = (S + 1) & $FF
  P = ReadByte($0100 + S)
```

## References
- "instruction_operation_plp" — expanded pseudocode and operation details (Ref: 8.12)

## Mnemonics
- PLP
