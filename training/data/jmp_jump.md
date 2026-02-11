# JMP (6502)

**Summary:** JMP — unconditional jump instruction for the 6502/C64 CPU. Addressing modes: Absolute (opcode $4C, 3 bytes, 3 cycles) and Indirect (opcode $6C, 3 bytes, 5 cycles). Operation: (PC+1) -> PCL, (PC+2) -> PCH; processor status flags N Z C I D V remain unchanged. See references 4.0.2 and 9.8.1.

## Description
JMP transfers execution to a new address provided by the instruction operand.

- Operation (effective for both addressing modes):
  - (PC + 1) -> PCL
  - (PC + 2) -> PCH
  - Processor status flags N, Z, C, I, D, V are unaffected.

- Addressing modes:
  - Absolute: operand is a 16-bit address encoded as low byte then high byte following the opcode.
  - Indirect: operand is a 16-bit pointer address; the CPU loads the new PC from the two-byte vector stored at that pointer (low byte from pointer, high byte from pointer+1).

- Timing and encoding (summary):
  - Absolute: opcode $4C, 3 bytes, 3 cycles.
  - Indirect: opcode $6C, 3 bytes, 5 cycles.

- Usage note: JMP provides an unconditional branch to a fixed location (Absolute) or via a memory-resident vector (Indirect). It does not push or pull the stack.

## References
- "jsr_jump_save_return" — expands on JSR (call subroutine)
- "rts_return_subroutine" — expands on RTS (return from subroutine)
- "rti_return_interrupt" — expands on RTI (return from interrupt)

## Mnemonics
- JMP
