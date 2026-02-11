# 6502 BEQ (Branch on Result Zero) — opcode $F0

**Summary:** BEQ (opcode $F0) is a relative-mode branch that transfers control when the zero flag (Z) = 1. Uses a signed 8-bit offset; timing: 2 cycles if not taken, +1 if taken same page, +2 if taken and crosses page.

## Operation
BEQ tests the processor status zero flag and, if set, adds a signed 8-bit relative offset to the address following the branch operand to form the new program counter (relative addressing).

- Condition: branch if Z = 1.
- Flags affected: none (N Z C I D V remain unchanged).
- Effective target calculation: target_address = PC_after_operand + signed(offset) (PC_after_operand = address of the next instruction following the 2-byte BEQ operand).
- Typical use: short conditional forward/backward jumps within ±128 bytes.

Pseudocode:
if (P.Z == 1) then
  PC := PC_after_operand + signed(offset)

(Reference: 4.1.1.5)

## Timing
- 2 cycles when branch not taken.
- If branch is taken: +1 cycle.
- If branch is taken and the target crosses a page boundary: +2 cycles (i.e., total +2 relative to not taken; usually resulting in 4 cycles).

Examples of common totals:
- Not taken: 2 cycles
- Taken, same page: 3 cycles
- Taken, page crossed: 4 cycles

## Source Code
```asm
; Example: branch forward 5 bytes if zero flag set
        BEQ skip       ; opcode F0 <offset>
        ; ... fall-through ...
skip:   ; target after branch

; Machine code example (offset = $05)
F0 05

; Table (from source)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Relative      |   BEQ Oper            |    F0   |    2    |    2*    |
+----------------+-----------------------+---------+---------+----------+
* Add 1 if branch occurs to same  page.
* Add 2 if branch occurs to next  page.
```

## References
- "instruction_operation_beq" — expands on BEQ pseudocode

## Mnemonics
- BEQ
