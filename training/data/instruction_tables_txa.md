# TXA (Transfer X to Accumulator)

**Summary:** Implied 6502 instruction TXA (opcode $8A) transfers the X index register into the accumulator (A <- X), updates the N and Z flags, is 1 byte and takes 2 cycles.

## Operation
TXA copies the contents of the X register into the accumulator and updates the processor status flags:
- Operation: A <- X
- Affected flags:
  - N (Negative) — set to bit 7 of A after transfer
  - Z (Zero) — set if A == 0 after transfer
  - C, I, D, V — unaffected

Addressing mode: Implied (no operand). Assembly mnemonic: TXA

Timing and encoding:
- Opcode: $8A
- Size: 1 byte
- Cycles: 2

Pseudocode (behavioral):
- A = X
- Set N = (A & %10000000) != 0
- Set Z = (A == 0)

## Source Code
```text
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   TXA                 |   $8A   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+

Status flags: N Z C I D V
             / / _ _ _ _   (N and Z updated; C,I,D,V unchanged)

Operation:  X -> A                                    (Ref: 7.12)
```

```asm
; Example usage (no operand)
TXA    ; Transfer X to A, set N and Z accordingly (opcode $8A)
```

## References
- "instruction_operation_txa" — expands on TXA pseudocode

## Mnemonics
- TXA
