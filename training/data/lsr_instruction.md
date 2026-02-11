# 6502 LSR (Logical Shift Right)

**Summary:** LSR (Logical Shift Right) shifts the accumulator or memory one bit right; opcodes: $4A (A), $46 (zp), $56 (zp,X), $4E (abs), $5E (abs,X). Affects flags: Carry, Zero, Negative (Negative set from result bit7).

## Operation
LSR shifts the selected byte one bit to the right. Bit 0 is shifted into the Carry flag; bit 7 is filled with 0. The instruction updates:
- Carry (C) = previous bit0 of operand
- Zero (Z) = set if result == 0
- Negative (N) = set from result bit7 (which is 0 after LSR; therefore N will be cleared)

LSR may operate on the Accumulator (A) or on a memory location (Zero Page, Zero Page,X, Absolute, Absolute,X).

## Opcodes and addressing modes
- Accumulator: LSR A — opcode $4A, length 1 byte, affects N,Z,C
- Zero Page: LSR $aa — opcode $46, length 2 bytes, affects N,Z,C
- Zero Page,X: LSR $aa,X — opcode $56, length 2 bytes, affects N,Z,C
- Absolute: LSR $aaaa — opcode $4E, length 3 bytes, affects N,Z,C
- Absolute,X: LSR $aaaa,X — opcode $5E, length 3 bytes, affects N,Z,C

## Source Code
```text
LSR - Logical Shift Right opcode summary
Addressing Mode         Syntax         Opcode  Bytes  Flags
Accumulator             LSR A          $4A     1      N,Z,C
Zero Page               LSR $aa        $46     2      N,Z,C
Zero Page,X             LSR $aa,X      $56     2      N,Z,C
Absolute                LSR $aaaa      $4E     3      N,Z,C
Absolute,X              LSR $aaaa,X    $5E     3      N,Z,C
```

## References
- "asl_instruction" — ASL (Logical/Arithmetic Shift Left) details and relation to LSR
- "ror_instruction" — ROR (Rotate Right) relation to LSR (uses Carry as input/output)

## Mnemonics
- LSR
