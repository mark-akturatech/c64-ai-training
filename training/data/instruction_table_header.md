# 6502 Instruction Table Header — Figure A.2 (Addressing modes & byte counts)

**Summary:** Figure A.2 defines the instruction/timing table header for the 6502: the addressing-mode column order and the byte counts per addressing mode (Imm, Abs, ZP, Acc, Imp, (IX), (I)Y, ZP,X, AbsX, AbsY, Rel, Ind, ZP,Y) and shows the "OP N" cell format and trailing status-flag bits (N Z C I D V) used in the following timing/opcode tables.

## Description
This figure is the header template used by the instruction timing/opcode tables that follow. It specifies:

- The exact column order for addressing modes used in the tables: Immediate (Imm), Absolute (Abs), Zero Page (ZP), Accumulator (Acc), Implied (Imp), (Indirect,X) ((IX)), (Indirect),Y ((I)Y), Zero Page,X (ZP,X), Absolute,X (AbsX), Absolute,Y (AbsY), Relative (Rel), Indirect (Ind), and Zero Page,Y (ZP,Y).
- The byte counts for each addressing mode (second row): how many bytes the instruction occupies for that addressing mode.
- The per-cell format used in the timing/opcode tables: each opcode cell contains "OP N" (opcode value and N representing length or timing shorthand used in the tables).
- A trailing status-flag bit string "N ZCIDV" included below the opcode cells in the header; this lists the processor status flags (Negative, Zero, Carry, Interrupt disable, Decimal, Overflow) that the timing/opcode tables may indicate or affect.

Use this header as the canonical column/format reference when reading the expanded timing/opcode tables in the related chunks.

## Source Code
```text
Figure A.2

INSTRUCTIONS

   Imm :Abs :ZP  :Acc :Imp :(IX):(I)Y:ZP,X:AbsX:AbsY:Rel :Ind :ZP,Y:
   2   :3   :2   :1   :1   :2   :2   :2   :3   :3   :2   :3   :2   :
   OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:OP N:N ZCIDV
```

## References
- "instruction_timing_table_part1" — First portion of the instruction timing/opcode table using these headers
- "instruction_timing_table_part2" — Second portion of the instruction timing/opcode table using these headers
