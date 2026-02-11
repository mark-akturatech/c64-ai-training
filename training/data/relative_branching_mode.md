# Branching: Relative Address Mode

**Summary:** Relative branch instructions use a one-byte signed offset (8-bit signed, range -128..+127) stored after the opcode; the branch target is computed as offset + (PC after the branch instruction). Instruction length is two bytes; assemblers compute offsets automatically. Use JMP (absolute/indirect) when the target is outside the ±128-byte range. Relative branches are relocation-friendly.

## Relative Address Mode
Relative addressing for branch instructions encodes the branch target as a one-byte signed offset from the address of the instruction immediately following the branch (PC after branch). The branch instruction therefore occupies two bytes: one for the opcode and one for the signed offset.

- Offset interpretation: the byte is treated as a signed 8-bit value (range -128..+127).
  - Example: $05 means +5 (skip the next 5 bytes).
  - Example: $F7 is treated as signed -9 (branch backward 9 bytes).
- Calculation formula:
  - offset = target_address - (PC_after_branch)
  - where PC_after_branch is the address immediately following the two-byte branch instruction (i.e., PC + 2 from the branch opcode location).
- Worked example from source:
  - Branch opcode is at $0341 and should go to target $033C.
  - PC after branch = $0343 (branch is 2 bytes long).
  - offset = $033C - $0343 = $F9 (signed -7). The relative byte stored is $F9.
- Range limits:
  - Maximum forward offset: +127 ($7F).
  - Maximum backward offset: -128 ($80).
  - If the desired target is outside this range, use a JMP (absolute) instruction; a common pattern is to branch to a nearby JMP which then jumps to the farther target.
- Practical notes:
  - Assemblers compute these offsets automatically; manual hex subtraction is error-prone.
  - Because offsets are relative, branch instructions remain valid when the code block is relocated as a whole (i.e., relocation-friendly).

## References
- "jmp_indirect_mode_and_rom_link" — contrasts relative branches with JMP absolute/indirect
