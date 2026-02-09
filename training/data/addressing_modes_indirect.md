# 6502 Indirect Addressing (JMP (addr))

**Summary:** Indirect addressing (JMP (addr)) is an addressing mode used only by the JMP instruction on the 6502; the two bytes at the supplied address form the 16-bit jump destination (low byte at the low address). Example: JMP ($215F) reads $215F (low) and $2160 (high) to form $3076.

## Indirect addressing (JMP only)
This mode applies exclusively to the JMP instruction and is written with parentheses around the operand, e.g. JMP (addr). The operand is the address of a two-byte little-endian pointer: the byte at the given address is the low byte of the destination, and the byte at the next address is the high byte of the destination. Example given in source:

- Memory:
  - $215F = $76  (low byte)
  - $2160 = $30  (high byte)
- Instruction: JMP ($215F)
- Effective jump destination: $3076

(Addresses are stored little-endian: low byte first.)

## Source Code
```asm
        ; Example: pointer stored at $215F-$2160 points to $3076
        JMP ($215F)    ; reads $215F -> $76 (low), $2160 -> $30 (high) -> PC = $3076

        ; illustrative data at $215F
        .org $215F
        .byte $76
        .byte $30
```

## Key Registers
(omitted — this chunk documents an addressing mode, not hardware registers)

## References
- "instruction_tables_jmp" — expands on JMP absolute and indirect opcodes and cycles