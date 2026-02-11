# LDY — Load index Y

**Summary:** LDY loads the Y index register from memory (M -> Y). Affects N and Z flags; opcodes: A0, A4, B4, AC, BC; addressing modes: Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X. (Ref: 7.1)

## Operation and flags
LDY transfers a memory operand into the Y register: M -> Y.  
Affects processor status:
- N (Negative): set if bit 7 of Y is 1 after the load.  
- Z (Zero): set if Y == 0 after the load.  
Other flags (C, I, D, V) are unaffected.

Timing and addressing summary (see Source Code for exact opcode table). For the Absolute,X addressing mode, the instruction takes an extra cycle if the indexed effective address crosses a page boundary (add 1 cycle).

## Source Code
```text
LDY                   LDY Load index Y with memory                    LDY
                                                        N Z C I D V
  Operation:  M -> Y                                    / / _ _ _ _
                                 (Ref: 7.1)
  +----------------+-----------------------+---------+---------+----------+
  | Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
  +----------------+-----------------------+---------+---------+----------+
  |  Immediate     |   LDY #Oper           |    A0   |    2    |    2     |
  |  Zero Page     |   LDY Oper            |    A4   |    2    |    3     |
  |  Zero Page,X   |   LDY Oper,X          |    B4   |    2    |    4     |
  |  Absolute      |   LDY Oper            |    AC   |    3    |    4     |
  |  Absolute,X    |   LDY Oper,X          |    BC   |    3    |    4*    |
  +----------------+-----------------------+---------+---------+----------+
  * Add 1 when page boundary is crossed.
```

## References
- "ldx_load_x" — companion instruction LDX (load X register)
- "sty_store_y" — STY (store Y to memory)
- "tay_transfer_a_to_y" — TAY (transfer A to Y, affects Y)

## Mnemonics
- LDY
