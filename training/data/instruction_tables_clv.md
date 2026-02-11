# CLV (Clear Overflow Flag) — opcode $B8

**Summary:** CLV (opcode $B8) is an implied 6502 instruction that clears the overflow flag (V). It is 1 byte and takes 2 cycles; only the V flag is affected (set to 0).

## Description
CLV uses implied addressing and forces the processor status overflow flag V to zero. Other status flags (N, Z, C, I, D) are not modified by this instruction.

Flags after execution:
- N Z C I D V
- _ _ _ _ _ 0

(Ref: 3.6.1)

## Source Code
```text
  CLV                      CLV Clear overflow flag                      CLV

  Operation: 0 -> V                                     N Z C I D V
                                                        _ _ _ _ _ 0
                                (Ref: 3.6.1)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Implied       |   CLV                 |    B8   |    1    |    2     |
  +----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_clv" — CLV pseudocode and expanded operation details

## Mnemonics
- CLV
