# 6502 Conditional Branch Instructions (Relative addressing, 2 bytes)

**Summary:** 6502 conditional branch opcodes use Relative addressing (signed 8-bit offset), are 2 bytes long, and do not modify processor status flags; opcodes include BCC $90, BCS $B0, BEQ $F0, BMI $30, BNE $D0, BPL $10, BVC $50, BVS $70.

## Description
Conditional branch instructions test a single processor status flag and, if the test succeeds, add a signed 8-bit offset to the program counter (PC) to jump relative to the next instruction. The operand is a signed displacement (range -128..+127) relative to the address of the instruction following the branch opcode and operand.

Behavior details:
- Addressing: Relative (signed 8-bit offset). The effective branch target = PC_after_operand + signed_offset.
- Size: 2 bytes (1 byte opcode, 1 byte offset).
- Flags: Executing the branch does not change any processor status flags.
- Tests performed:
  - Carry (C) — BCC (branch if clear), BCS (branch if set)
  - Zero (Z) — BEQ (branch if set), BNE (branch if clear)
  - Negative (N) — BMI (branch if set), BPL (branch if clear)
  - Overflow (V) — BVS (branch if set), BVC (branch if clear)
- Cycle timing (NMOS 6502 typical): 2 cycles if branch not taken; 3 cycles if branch taken and target stays on same 256-byte page; 4 cycles if branch taken and target crosses a page boundary (+1 cycle for page cross).

Encoding note (brief): the operand byte is the two's‑complement signed offset (aa). Example: to branch forward 5 bytes, use offset $05; to branch back 3 bytes, use offset $FD (-3).

## Source Code
```text
6502 conditional branch opcodes (Relative addressing, 2 bytes each, no flags changed by executing the branch itself):

Mnemonic  Description                          Syntax     Opcode  Size  Flags changed
BCC       Branch if carry flag clear         Relative   BCC aa   $90    2    none
BCS       Branch if carry flag set           Relative   BCS aa   $B0    2    none
BEQ       Branch if zero flag set            Relative   BEQ aa   $F0    2    none
BMI       Branch if negative flag set        Relative   BMI aa   $30    2    none
BNE       Branch if zero flag clear          Relative   BNE aa   $D0    2    none
BPL       Branch if negative flag clear      Relative   BPL aa   $10    2    none
BVC       Branch if overflow flag clear      Relative   BVC aa   $50    2    none
BVS       Branch if overflow flag set        Relative   BVS aa   $70    2    none
```

## References
- "jmp_instruction" — expands on unconditional jump (JMP)

## Mnemonics
- BCC
- BCS
- BEQ
- BMI
- BNE
- BPL
- BVC
- BVS
