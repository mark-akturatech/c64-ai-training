# 6502 Immediate Addressing Mode (#)

**Summary:** Immediate addressing encodes an 8-bit operand directly in the instruction; the assembler denotes it with "#" (e.g. LDA #$0A). Each 6502 instruction has a distinct opcode for its immediate form (LDA immediate = $A9); other instructions (ADC, etc.) have their own immediate opcodes.

## Description
In immediate mode the operand value is contained in the instruction itself rather than in memory. The assembler syntax uses a leading "#" to indicate an immediate constant. The 6502 immediate operand is a single byte (8 bits) following the opcode. The opcode byte used depends on the instruction and addressing mode — for example, LDA has different opcodes for immediate, absolute, zero-page, etc.; the immediate form of LDA is opcode $A9.

Behavioral note: using an immediate operand does not perform a memory read for the operand value (the value is taken from the instruction stream), though the processor still fetches the opcode and operand bytes as part of instruction fetch.

## Source Code
```asm
; Assembly example (6502)
LDA #$0A      ; Load accumulator with immediate hex value 0A

; Machine code bytes
; $A9 $0A   ; LDA immediate opcode ($A9) followed by operand ($0A)
```

## References
- "instruction_tables_adc" — ADC immediate opcode and cycles (see ADC instruction table)