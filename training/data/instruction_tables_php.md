# PHP — Push Processor Status on Stack

**Summary:** PHP (opcode $08) is an implied 6502 instruction that pushes the processor status register (P) onto the stack (S). Instruction length: 1 byte; execution time: 3 clock cycles.

**Operation**

Operation: P → S

Addressing mode: Implied  
Assembly mnemonic: PHP  
Opcode: $08  
Bytes: 1  
Cycles: 3

The instruction pushes the current processor status register value onto the stack; no flags are affected.

**Detailed Behavior**

When executing the PHP instruction:

1. The processor status register (P) is pushed onto the stack.
2. The stack pointer (S) is decremented by 1.

**Representation of Flags in the Pushed Byte:**

- **Break (B) Flag (Bit 4):** Set to 1 when pushed by PHP.
- **Unused Bit (Bit 5):** Set to 1 when pushed by PHP.

These bits are set to distinguish software interrupts (BRK or PHP) from hardware interrupts (IRQ or NMI), which push the B flag as 0. ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))

## Source Code

```text
  PHP                 PHP Push processor status on stack                PHP

  Operation:  P toS                                     N Z C I D V
                                                        _ _ _ _ _ _
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   PHP                 |    08   |    1    |    3     |
  +----------------+-----------------------+---------+---------+----------+
```

## References

- "instruction_operation_php" — expands on PHP pseudocode and operation details

## Mnemonics
- PHP
