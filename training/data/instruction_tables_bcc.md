# 6502 BCC (Branch on Carry Clear) — opcode $90, Relative

**Summary:** 6502 branch instruction BCC (Branch on Carry Clear) uses relative addressing (signed 8-bit displacement), opcode $90, 2 bytes, 2 cycles base; +1 cycle if branch taken, +2 cycles if branch taken to a different page. Does not affect processor flags.

## Operation / Details
- Mnemonic: BCC — Branch on Carry Clear.
- Condition: branch if C = 0.
- Flags affected: none.
- Addressing mode: Relative (signed 8-bit displacement).
- Encoding: $90 xx (xx = signed 8-bit displacement from the next instruction).
- Instruction length: 2 bytes.
- Timing: 2 cycles when branch not taken; if branch is taken add 1 cycle; if branch is taken to a different memory page add 2 cycles total (i.e., +1 for taken, and an additional +1 if page boundary crossed).

## Source Code
```text
Operation:  Branch on C = 0                           _ _ _ _ _ _
                               (Ref: 4.1.1.3)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Relative      |   BCC Oper            |    90   |    2    |    2*    |
+----------------+-----------------------+---------+---------+----------+

* Add 1 if branch occurs to same page.
* Add 2 if branch occurs to different page.
```

```asm
; Encoding form
; BCC <relative displacement>
; Machine bytes: $90 <xx>   ; xx = signed 8-bit offset (relative to PC after operand)
```

## References
- "addressing_modes_relative" — expands on relative addressing and signed displacement
- "branch_instructions_behavior" — expands on timing details for branches

## Mnemonics
- BCC
