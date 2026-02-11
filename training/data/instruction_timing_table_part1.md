# 6502 Instruction Timing / Opcode Table — Part 1 (ADC..JSR)

**Summary:** Partial instruction timing/opcode table for the 6502/Commodore 64 covering ADC, AND, ASL, BCC, BCS, BEQ, BIT, BMI, BNE, BPL, BRK, BVC, BVS, CLC, CLD, CLI, CLV, CMP, CPX, CPY, DEC, DEX, DEY, EOR, INC, INX, INY, JMP, and JSR. Shows opcode hex per addressing mode, cycle counts, and a trailing notes column (page-boundary extra cycles, branch timing variants, and other symbols referenced elsewhere).

**Table format / how to read**
- Each row represents one mnemonic. Addressing-mode columns and their order are defined in the table header below.
- Cell format uses "cycles:opcode" (e.g., "2:6D" = 2 cycles, opcode $6D). Cells with ".:.." or ".." indicate the addressing mode is not defined for that mnemonic.
- The final column is a compact notes/flags field (symbol meanings like !, @, M6, M7, #, $, x, -, etc., are explained in the legend below).
- This chunk is the first part of the full table; remaining instructions and the header/legend are in the referenced chunks.

## Source Code
```text
--------+----+----+----+----+----+----+----+----+----+----+----+----+-------
ADC!69 2:6D 4:65 3:.. .:.. .:61 6:71 5:75 4:7D 4:79 4:.. .:.. .:.. .:x$xx--x
AND!29 2:2D 4:25 3:.. .:.. .:21 6:31 5:35 4:3D 4:39 4:.. .:.. .:.. .:x x----
ASL .. .:0E 6:06 5:0A 2:.. .:.. .:.. .:16 6:1E 7:.. .:.. .:.. .:.. .:x xx---
BCC .. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:90 @:.. .:.. .:- -----
BCS .. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:B0 @:.. .:.. .:- -----
BEQ .. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:F0 @:.. .:.. .:- -----
BIT .. .:2C 4:24 3:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:M7x---M6
BMI .. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:30 @:.. .:.. .:- -----
BNE .. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:D0 @:.. .:.. .:- -----
BPL .. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:10 @:.. .:.. .:- -----
BRK .. .:.. .:.. .:00 7:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- --1--
BVC .. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:50 @:.. .:.. .:- -----
BVS .. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:70 @:.. .:.. .:- -----
CLC .. .:.. .:.. .:.. .:18 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- -0---
CLD .. .:.. .:.. .:.. .:D8 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- ---0-
CLI .. .:.. .:.. .:.. .:58 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- --0--
CLV .. .:.. .:.. .:.. .:B8 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- ----0
CMP!C9 2:CD 4:C5 3:.. .:.. .:C1 6:D1 5:D5 4:DD 4:D9 4:.. .:.. .:.. .:x xx---
CPX E0 2:EC 4:E4 3:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x xx---
CPY C0 2:CC 4:C4 3:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x xx---
DEC .. .:CE 6:C6 5:.. .:.. .:.. .:.. .:D6 6:DE 7:.. .:.. .:.. .:.. .:x x----
DEX .. .:.. .:.. .:.. .:CA 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x x----
DEY .. .:.. .:.. .:.. .:B8 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x x----
EOR!49 2:4D 4:45 3:.. .:.. .:41 6:51 5:55 4:5D 4:59 4:.. .:.. .:.. .:x x----
INC .. .:EE 6:E6 5:.. .:.. .:.. .:.. .:F6 6:FE 7:.. .:.. .:.. .:.. .:x x----
INX .. .:.. .:.. .:.. .:E8 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x x----
INY .. .:.. .:.. .:.. .:C8 2:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:x x----
JMP .. .:4C 3:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:6C 5:.. .:- -----
JSR .. .:20 6:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:.. .:- -----
```

**Table Header**

**Legend**
- **!**: Indicates the instruction affects the carry flag.
- **@**: Branch instructions; add 1 cycle if the branch is taken, and an additional cycle if it crosses a page boundary.
- **M6**: BIT instruction; sets the overflow flag to bit 6 of the memory operand.
- **M7**: BIT instruction; sets the negative flag to bit 7 of the memory operand.
- **#**: Immediate addressing mode.
- **$**: Absolute addressing mode.
- **x**: Indexed addressing mode.
- **-**: No effect on flags.

## Source Code

```text
--------+----+----+----+----+----+----+----+----+----+----+----+----+-------
Mnemonic|Abs |Zpg |Acc |Imm |(Zp,X)| (Zp),Y|Zpg,X|Abs,X|Abs,Y|Ind |Rel |Imp |Notes
--------+----+----+----+----+----+----+----+----+----+----+----+----+-------
```


## References
- "instruction_table_header" — Header defining the addressing-mode columns and cycle-count conventions used in this table
- "instruction_timing_table_part2" — Continuation of the instruction timing/opcode table (remaining instructions)
- "instruction_table_notes_and_figure" — Explanation of table symbols (!, @, M6, M7, #, $, x, -) and Figure A.4

## Mnemonics
- ADC
- AND
- ASL
- BCC
- BCS
- BEQ
- BIT
- BMI
- BNE
- BPL
- BRK
- BVC
- BVS
- CLC
- CLD
- CLI
- CLV
- CMP
- CPX
- CPY
- DEC
- DEX
- DEY
- EOR
- INC
- INX
- INY
- JMP
- JSR
