# JMP (Jump)

**Summary:** JMP (6502) jump instruction using Absolute ($4C) and Indirect ($6C) addressing modes; both are 3-byte opcodes that set the program counter and do not affect processor flags.

## Description
JMP transfers execution to a new address by loading the program counter with the target address. It is an unconditional control-flow transfer and does not modify any status flags.

Supported addressing modes in this chunk:
- Absolute — operand is a 16-bit address ($aaaa).
- Indirect — operand is a 16-bit pointer to a 16-bit address (the vector is read from memory at $aaaa and used as the new PC).

Both documented forms occupy 3 bytes (opcode + 16-bit address) and neither affects processor flags.

## Source Code
```text
Instruction   Description               Syntax           Opcode  Bytes  Flags
JMP           Jump to another location  Absolute        JMP $aaaa  $4C    3    none
              (indirect)                Indirect        JMP ($aaaa) $6C    3

Example (Absolute):
    .asm
    ORG $0801
    JMP $C000        ; bytes: $4C $00 $C0

Example (Indirect):
    .asm
    ; If memory at $1000 contains $00 $C0 (low byte then high byte)
    JMP ($1000)      ; bytes: $6C $00 $10
```

## References
- "branch_instructions" — expands on conditional branches and other control-flow instructions

## Mnemonics
- JMP
