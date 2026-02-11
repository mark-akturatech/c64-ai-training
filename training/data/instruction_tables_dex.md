# DEX — Decrement X (opcode $CA)

**Summary:** DEX decrements the X index register by one (X := X - 1). Implied addressing, opcode $CA, 1 byte, 2 cycles; updates N and Z flags (Negative from bit 7 of the result, Zero set when result == 0).

## Description
Operation: X - 1 -> X

Pseudocode (concise):
- X := (X - 1) & $FF
- Z := (X == 0)
- N := (X & $80) != 0

Flags:
- Affected: N (Negative), Z (Zero)
- Unchanged: C (Carry), I (Interrupt disable), D (Decimal), V (Overflow)

Assembly form and timing:
- Addressing mode: Implied
- Mnemonic: DEX
- Opcode: $CA
- Instruction length: 1 byte
- Execution time: 2 CPU cycles

## References
- "instruction_operation_dex" — expands on DEX pseudocode and operation details

## Mnemonics
- DEX
