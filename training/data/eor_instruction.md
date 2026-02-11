# 6502 EOR (Exclusive OR)

**Summary:** 6502 EOR (Exclusive OR) — bitwise XOR between the accumulator and a memory operand (A ← A XOR M). Addressing modes and opcodes: $4D, $45, $49, $5D, $59, $55, $41, $51. Flags affected: Negative (N), Zero (Z).

## Instruction Description
EOR performs a bitwise exclusive-OR of the accumulator with the fetched operand and stores the result in the accumulator (A ← A XOR M). The instruction sets the Negative and Zero flags according to the result. (Source lists only N and Z as affected.)

## Addressing modes and opcodes
The instruction is available in the following addressing modes with these opcodes and instruction lengths:

- Absolute         — opcode $4D — 3 bytes
- Zero Page        — opcode $45 — 2 bytes
- Immediate        — opcode $49 — 2 bytes
- Absolute,X       — opcode $5D — 3 bytes
- Absolute,Y       — opcode $59 — 3 bytes
- Zero Page,X      — opcode $55 — 2 bytes
- (Indirect,X)     — opcode $41 — 2 bytes
- (Indirect),Y     — opcode $51 — 2 bytes

## Source Code
```text
EOR    Exclusive OR

Addressing mode         Syntax         Opcode  Bytes  Flags affected
Absolute                EOR $aaaa      $4D     3      N,Z
Zero Page               EOR $aa        $45     2      N,Z
Immediate               EOR #$aa       $49     2      N,Z
Absolute Indexed,X      EOR $aaaa,X    $5D     3      N,Z
Absolute Indexed,Y      EOR $aaaa,Y    $59     3      N,Z
Zero Page Indexed,X     EOR $aa,X      $55     2      N,Z
Indexed Indirect        EOR ($aa,X)    $41     2      N,Z
Indirect Indexed        EOR ($aa),Y    $51     2      N,Z
```

## References
- "and_instruction" — AND (related logical operation)
- "ora_instruction" — ORA (related logical operation)

## Mnemonics
- EOR
