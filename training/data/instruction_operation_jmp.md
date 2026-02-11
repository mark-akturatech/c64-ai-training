# 6502 JMP — Pseudocode (PC = target address)

**Summary:** JMP (jump) sets the 6502 program counter (PC) to a target 16-bit address fetched from the instruction operand. Common addressing modes: absolute and indirect (see instruction_tables_jmp).

## Operation
JMP loads the program counter with the target address specified by the instruction operand. In the pseudocode below, (src) denotes the 16-bit target address fetched from memory at the operand location (i.e., the word located at the operand, used directly for absolute mode or read via an indirect pointer for indirect mode).

- Effect: PC := target address read from operand
- Addressing modes: absolute (JMP abs), indirect (JMP (abs))
- Flags: (source does not state flag behavior)

## Source Code
```asm
; JMP pseudocode
/* JMP */
    PC = (src);
```

## References
- "instruction_tables_jmp" — expands on JMP opcodes (absolute and indirect)

## Mnemonics
- JMP
