# BVC / BVS — Branch on Overflow Clear / Set (relative mode, $50 / $70)

**Summary:** 6502 branch instructions BVC ($50) and BVS ($70) use relative addressing (signed 8-bit displacement) and test the V (overflow) flag; timing: 2 cycles if not taken, +1 cycle if taken to same page, +2 cycles if taken to different page.

## Operation
- BVC: Branch if V = 0 (overflow clear).
- BVS: Branch if V = 1 (overflow set).
- These are relative-mode branches: the operand is a signed 8-bit displacement added to the program counter (PC) after the opcode and operand have been fetched (PC points to the next instruction at that time).
- Flags: none of the processor status flags are changed by these instructions.
- Page-cross timing: if adding the signed displacement changes the high byte of PC (i.e., crosses a 256-byte page boundary), an extra cycle is required.

## Addressing and displacement
- Addressing mode: Relative — operand is an 8-bit signed value (-128..+127).
- Effective target address calculation (typical 6502 behavior):
  - Fetch opcode, fetch operand (8-bit).
  - Let base = PC (address of next instruction after operand).
  - Let offset = signed 8-bit operand (two's complement).
  - newPC = base + offset
  - If (base & $FF00) != (newPC & $FF00) then page crossed → +1 additional cycle.
- Branch not taken: 2 cycles.
- Branch taken, same page: 3 cycles.
- Branch taken, different page: 4 cycles.

## Notes
- These instructions test the V flag only; they do not read or modify other status flags.
- Use these for overflow-handling control flow after arithmetic that sets the V flag.

## Source Code
```text
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Relative      |   BVC Oper            |    50   |    2    |    2*    |
|  Relative      |   BVS Oper            |    70   |    2    |    2*    |
+----------------+-----------------------+---------+---------+----------+

* Add 1 if branch occurs to same page.
* Add 2 if branch occurs to different page.
```

```asm
; Pseudocode (explicit)
; BVC: Branch on overflow clear
; if V == 0 then PC := PC + (signed operand)
; else PC unchanged

; BVS: Branch on overflow set
; if V == 1 then PC := PC + (signed operand)
; else PC unchanged

; Signed operand: treat operand byte as two's complement (-128..+127)
```

## References
- "instruction_operation_bvc" — expands on BVC pseudocode and examples
- "instruction_operation_bvs" — expands on BVS pseudocode and examples

## Mnemonics
- BVC
- BVS
