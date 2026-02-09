# BMI — Branch on Result Minus (6502)

**Summary:** BMI tests the N (negative) flag and branches if N = 1; addressing mode: Relative (signed 8-bit offset). Opcode $30, 2 bytes, timing: 2 cycles baseline — +1 cycle if branch is taken, +1 additional cycle if branch crosses a page boundary.

## Operation
Branch if N = 1 (negative result). The instruction tests the processor status N flag and transfers control to the target when N is set; no processor status flags are changed by the branch itself. (Ref: 4.1.1.1)

- Condition: branch when N = 1 (negative)
- Flags: N Z C I D V — unchanged
- Addressing: Relative (signed 8-bit offset added to PC after the operand)

**[Note: Source may contain an error — timing footnotes in the original text were ambiguous; corrected here to standard 6502 behavior: baseline 2 cycles, +1 if branch taken, +1 additional if branch crosses page boundary.]**

## Addressing and Offset Calculation
Relative addressing: the operand is an 8-bit signed displacement (two's complement). The effective target address is computed by adding the signed offset to the address of the instruction following the branch (PC + 2).

- Offset calculation: target = (PC_after_operand) + signed_offset
  - where PC_after_operand = PC at opcode + 2

## Timing
- No branch (condition false): 2 cycles
- Branch taken (target on same page): 3 cycles (2 + 1)
- Branch taken and target crosses a page boundary: 4 cycles (2 + 1 + 1)

(Above follows standard 6502 branch timing rules; original source footnotes appeared ambiguous.)

## Source Code
```text
; From manual table (cleaned)
; Instruction: BMI — Branch on result minus
; Ref: 4.1.1.1

Addressing Mode | Assembly Form | Opcode | No. Bytes | No. Cycles
---------------------------------------------------------------
Relative        | BMI Oper      | $30    |    2      |    2* 

* Add 1 if branch is taken.
* Add 1 more if branch crosses a page boundary.

; Encoding example (assembly -> machine)
; BMI label    -> 30 <rel8>
; Example: if label is 2 bytes ahead:
;   bytes: 30 02

; Offset calculation (signed 8-bit):
;   offset = target_address - (PC + 2)
;   store offset as two's complement in operand byte
```

## Key Registers
- (none — BMI is an instruction, not a memory-mapped register)

## References
- "bit_test_bits_instruction" — covers BIT instruction details referenced in adjacent table
- "bne_branch_on_result_not_zero" — covers the BNE branch instruction (next entry)