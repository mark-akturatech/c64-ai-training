# ORA — OR memory with accumulator

**Summary:** ORA performs a bitwise OR between the accumulator and memory (A OR M -> A) on the 6502/Commodore 64; affects N and Z flags. Common opcodes: $09 (immediate), $05/$15 (zero page), $0D/$1D/$19 (absolute / absolute,X / absolute,Y), $01/$11 ((Indirect,X)/(Indirect),Y).

## Operation and flags
ORA computes a bitwise inclusive-OR between the accumulator and a memory operand, storing the result back into A: A <- A OR M. Only the Negative (N) and Zero (Z) flags are affected; Carry (C), Interrupt disable (I), Decimal (D) and Overflow (V) are not affected. N reflects bit 7 of the result; Z is set if the result is zero.

Addressing modes supported: Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X) and (Indirect),Y. Absolute,X and Absolute,Y require an extra clock cycle when the effective address crosses a 256-byte page boundary.

**[Note: Source may contain an error — the original table shows opcode $10 for Absolute,X; the correct opcode for ORA Absolute,X is $1D.]**

## Source Code
```text
Instruction: ORA — OR memory with accumulator
Operation: A OR M -> A
Flags affected: N Z (C I D V unchanged)
Reference: 2.2.3.1

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Immediate      | ORA #Oper             |   $09   |    2    |    2     |
| Zero Page      | ORA Oper              |   $05   |    2    |    3     |
| Zero Page,X    | ORA Oper,X            |   $15   |    2    |    4     |
| Absolute       | ORA Oper              |   $0D   |    3    |    4     |
| Absolute,X     | ORA Oper,X            |   $1D   |    3    |    4*    |
| Absolute,Y     | ORA Oper,Y            |   $19   |    3    |    4*    |
| (Indirect,X)   | ORA (Oper,X)          |   $01   |    2    |    6     |
| (Indirect),Y   | ORA (Oper),Y          |   $11   |    2    |    5     |
+----------------+-----------------------+---------+---------+----------+

* Add 1 cycle on page crossing (Absolute,X and Absolute,Y)
```

## References
- "eor_exclusive_or" — covers EOR (exclusive OR) instruction
- "lda_load_accumulator" — covers LDA (load accumulator)
- "sta_store_accumulator" — covers STA (store accumulator)

## Mnemonics
- ORA
