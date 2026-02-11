# LDX — Load index X with memory

**Summary:** LDX loads the X register from memory (M -> X). Affects Negative and Zero flags (N, Z). Opcodes: $A2, $A6, $B6, $AE, $BE. Reference: 7.0.

## Description
LDX transfers a byte from memory into the X index register. The instruction updates the N (negative) and Z (zero) flags according to the loaded value; other processor flags (C, I, D, V) are unaffected. Supported addressing modes are Immediate, Zero Page, Zero Page,Y, Absolute, and Absolute,Y. The Absolute,Y mode incurs an extra cycle when a page boundary is crossed.

## Source Code
```text
  LDX                   LDX Load index X with memory                    LDX

  Operation:  M -> X                                    N Z C I D V
                                                        / / _ _ _ _ _
                                 (Ref: 7.0)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Immediate     |   LDX #Oper           |   $A2   |    2    |    2     |
  |  Zero Page     |   LDX Oper            |   $A6   |    2    |    3     |
  |  Zero Page,Y   |   LDX Oper,Y          |   $B6   |    2    |    4     |
  |  Absolute      |   LDX Oper            |   $AE   |    3    |    4     |
  |  Absolute,Y    |   LDX Oper,Y          |   $BE   |    3    |    4*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 when page boundary is crossed.
```

## References
- "ldy_load_y" — companion instruction LDY (load Y index)
- "stx_store_x" — STX (store X to memory)
- "tax_transfer_a_to_x" — TAX (transfer A to X)

## Mnemonics
- LDX
