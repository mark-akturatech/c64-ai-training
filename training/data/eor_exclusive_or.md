# EOR — Exclusive-OR (A EOR M -> A)

**Summary:** EOR performs a bitwise exclusive-OR between the accumulator and a memory operand (A ← A ⊕ M). Searchable terms: opcodes $49, $45, $55, $4D, $5D, $59, $41, $51; addressing modes (Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X), (Indirect),Y); affects N and Z flags. Add 1 cycle on page boundary crossings for modes marked with *.

## Operation
A EOR M -> A. Logical (bitwise) exclusive-OR of accumulator and memory:
- Flags affected: N, Z.
  - N (Negative) = set if bit 7 of result = 1.
  - Z (Zero) = set if result = 0.
- Flags unaffected: C, I, D, V.
(Ref: 2.2.3.2)

Timing: consult per-addressing-mode cycle counts below. For addressing modes marked with *, add 1 cycle if the effective address crosses a 256-byte page boundary.

## Source Code
```text
EOR "Exclusive-OR" memory with accumulator
Operation:  A EOR M -> A                              N Z C I D V
                                                     / / _ _ _ _

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Immediate     |   EOR #Oper           |    $49   |    2    |    2     |
| Zero Page     |   EOR Oper            |    $45   |    2    |    3     |
| Zero Page,X   |   EOR Oper,X          |    $55   |    2    |    4     |
| Absolute      |   EOR Oper            |    $4D   |    3    |    4     |
| Absolute,X    |   EOR Oper,X          |    $5D   |    3    |    4*    |
| Absolute,Y    |   EOR Oper,Y          |    $59   |    3    |    4*    |
| (Indirect,X)  |   EOR (Oper,X)        |    $41   |    2    |    6     |
| (Indirect),Y  |   EOR (Oper),Y        |    $51   |    2    |    5*    |
+----------------+-----------------------+---------+---------+----------+

* Add 1 if page boundary is crossed.
```

## References
- "ora_or_accumulator" — ORA (OR with accumulator) related logical instruction
- "lda_load_accumulator" — LDA (load accumulator) instruction
- "sbc_subtract_with_borrow" — SBC (subtract with borrow) arithmetic instruction

## Mnemonics
- EOR
