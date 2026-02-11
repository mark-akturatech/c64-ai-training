# 6502 Implied Addressing

**Summary:** Implied addressing (6502) requires no operand bytes; the operation and targets are implied by the opcode/mnemonic. Example: TAX (transfer accumulator to X), opcode $AA.

## Implied Addressing
No operand addresses or immediate data bytes are present for implied-mode instructions — the instruction byte alone determines the operation and its implicit source/target (registers or processor state). Assemblers emit a single opcode byte for these instructions. Example from the 6502 instruction set: TAX transfers the contents of the accumulator (A) to the X register (X), and is encoded as opcode $AA.

## Source Code
```asm
; 6502 implied addressing example
; TAX - Transfer Accumulator to X register
; Opcode: $AA (single-byte, implied)

        TAX     ; opcode $AA
```

## References
- "instruction_tables_tax" — expands on TAX implied opcode and behavior

## Mnemonics
- TAX
