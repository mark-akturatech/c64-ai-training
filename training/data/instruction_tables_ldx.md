# 6502: LDX (Load X)

**Summary:** LDX loads a memory value into the X index register (M -> X), affects the Negative and Zero flags (N,Z), and uses opcodes $A2, $A6, $B6, $AE, $BE for Immediate, Zero Page, Zero Page,Y, Absolute, and Absolute,Y addressing respectively. Absolute,Y may add one cycle on a page boundary crossing.

**Operation**
LDX transfers a memory operand to the X register: M -> X.  
Flags affected: N and Z set according to the resulting X; C, I, D, V are unaffected.

**Addressing modes and timing**
Supported addressing modes:
- Immediate (#Oper)           — opcode $A2 — 2 bytes, 2 cycles
- Zero Page (Oper)           — opcode $A6 — 2 bytes, 3 cycles
- Zero Page,Y (Oper,Y)       — opcode $B6 — 2 bytes, 4 cycles
- Absolute (Oper)            — opcode $AE — 3 bytes, 4 cycles
- Absolute,Y (Oper,Y)        — opcode $BE — 3 bytes, 4 cycles (add 1 cycle if a page boundary is crossed)

**Pseudocode**
The operation of the LDX instruction can be described with the following pseudocode:


Where:
- `X` is the X register.
- `M` is the memory operand.
- `Z` is the Zero flag.
- `N` is the Negative flag.
- `X[7]` represents the most significant bit (bit 7) of the X register.

## Source Code

```
X = M
if X == 0 then
    Z = 1
else
    Z = 0
endif
N = X[7]
```

```text
LDX                   LDX Load index X with memory                    LDX

Operation:  M -> X                                    N Z C I D V
                                                      / / _ _ _ _ _
                                 (Ref: 7.0)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Immediate     |   LDX #Oper           |    A2   |    2    |    2     |
| Zero Page     |   LDX Oper            |    A6   |    2    |    3     |
| Zero Page,Y   |   LDX Oper,Y          |    B6   |    2    |    4     |
| Absolute      |   LDX Oper            |    AE   |    3    |    4     |
| Absolute,Y    |   LDX Oper,Y          |    BE   |    3    |    4*    |
+----------------+-----------------------+---------+---------+----------+
* Add 1 when page boundary is crossed.
```

## References
- "instruction_operation_ldx" — expands on LDX pseudocode and micro‑operation details.

## Mnemonics
- LDX
