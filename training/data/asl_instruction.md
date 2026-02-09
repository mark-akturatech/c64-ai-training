# ASL — Arithmetic Shift Left (6502)

**Summary:** ASL (Arithmetic Shift Left) shifts a byte one bit left, moving bit 7 into the Carry flag and filling bit 0 with 0; affects flags N (Negative), Z (Zero), and C (Carry). Encodings: Absolute $0E, Zero Page $06, Accumulator $0A, Absolute,X $1E, Zero Page,X $16.

## Operation
ASL shifts the operand left one bit:
- Bit 7 -> Carry (C).
- Bits 6..0 -> bits 7..1 of the result.
- Bit 0 <- 0.
- Affects flags: Negative (N = result bit 7), Zero (Z = result == 0), Carry (C = original bit 7).

Two forms:
- Accumulator: operates on the A register (instruction: ASL A).
- Memory: reads a memory location, shifts, writes the result back to memory.

Relation to other shift/rotate instructions:
- LSR is the opposite direction (logical shift right).
- ROL rotates left through the Carry flag (uses C as input/output).

## Source Code
```text
ASL	Arithmetic Shift Left

Addressing modes and opcodes:
- Absolute                ASL $aaaa           opcode $0E   length 3   flags: N,Z,C
- Zero Page               ASL $aa             opcode $06   length 2   flags: N,Z,C
- Accumulator             ASL A               opcode $0A   length 1   flags: N,Z,C
- Absolute, Indexed X     ASL $aaaa,X         opcode $1E   length 3   flags: N,Z,C
- Zero Page, Indexed X    ASL $aa,X           opcode $16   length 2   flags: N,Z,C

(Use the Accumulator form to shift A directly; memory forms read-modify-write the addressed location.)
```

## References
- "lsr_instruction" — LSR logical shift right (opposite direction)
- "rol_instruction" — ROL rotate left (through Carry)