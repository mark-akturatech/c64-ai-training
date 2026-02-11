# SEC (Set Carry) — opcode $38

**Summary:** SEC sets the processor carry flag (C) to 1. Instruction SEC is implied addressing, opcode $38, length 1 byte, and takes 2 clock cycles; other flags are unaffected.

## Description
SEC (Set Carry) performs a single operation: it writes a logical 1 into the Carry (C) flag. It uses the implied addressing mode and completes in 2 CPU cycles. The instruction does not modify the Negative (N), Zero (Z), Interrupt Disable (I), Decimal (D), or Overflow (V) flags.

- Mnemonic: SEC
- Opcode: $38
- Addressing mode: Implied
- Bytes: 1
- Cycles: 2
- Operation: 1 -> C (set Carry flag)
- Flags: N unchanged, Z unchanged, C = 1, I unchanged, D unchanged, V unchanged
- Reference note: (Ref: 3.0.1)

## Source Code
```text
  SEC                        SEC Set carry flag                         SEC

  Operation:  1 -> C                                    N Z C I D V
                                                        _ _ 1 _ _ _
                                (Ref: 3.0.1)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   SEC                 |    38   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

Example usage (assembly):
```asm
        SEC     ; set carry flag to 1
```

## References
- "instruction_operation_sec" — expands on SEC pseudocode and operation details

## Mnemonics
- SEC
