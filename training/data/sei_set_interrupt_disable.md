# SEI — Set Interrupt Disable Status (6502)

**Summary:** SEI (6502) sets the processor status Interrupt Disable flag (I) to 1. Instruction: implied addressing, opcode $78, 1 byte, 2 cycles; affects the I bit of the status register.

## Operation
SEI sets the Interrupt Disable flag (I) in the processor status register to 1, preventing maskable IRQ interrupts until I is cleared (CLI) or the status is later restored (RTI). Flags affected: I is set; N, Z, C, D, V are not modified by SEI.

- Operation: 1 -> I
- Addressing mode: Implied
- Opcode: $78
- Size: 1 byte
- Cycles: 2
- Status bits (before/after): N Z C I D V  — _ _ _ 1 _ _

**[Note: Source may contain an error — the original header includes "SED" after the SEI description; SED is a different instruction (Set Decimal).]**

(See RTI for how the status, including I, is restored from the stack after an interrupt.)

## Source Code
```asm
; One-line assembly form
SEI     ; Set Interrupt Disable (I = 1)
```

```text
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   SEI                 |   78    |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "rti_return_interrupt" — return-from-interrupt (RTI) behavior and interaction with I flag
- "sed_set_decimal" — SED instruction (Set Decimal Flag) information

## Mnemonics
- SEI
