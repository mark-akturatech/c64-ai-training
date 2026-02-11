# Immediate Addressing (Immediate Mode)

**Summary:** Immediate addressing (e.g., LDA #$34) embeds a literal value in the instruction (opcode + 1-byte immediate operand = two bytes). Use immediate mode for constants (LDA #$00), but avoid overuse because hard-coded values complicate porting and maintenance; some instructions (for example STA) cannot use immediate mode.

## Immediate addressing
Immediate mode supplies a literal operand inside the instruction rather than referencing a memory address. An instruction encoded with immediate addressing occupies two bytes: one for the opcode and a second byte for the immediate value.

Immediate addressing is natural, fast, and convenient for constants. The drawback is maintainability: literal values frozen into many instructions make later changes error-prone and time-consuming. Example given in the source: a program written for a VIC-20 uses the screen width 22 (decimal; $16 hex) in many immediate comparisons and arithmetic operations. Porting that program to a Commodore 64 (40 columns, $28 hex) would require changing each immediate occurrence. Storing such a value in a memory location (variable) avoids widespread edits.

Certain instructions cannot take immediate operands — for example, STA must store the accumulator into memory and therefore cannot use immediate addressing.

## Source Code
```asm
; Immediate addressing examples (reference only)

LDA #$34    ; Load A with literal $34 (instruction uses two bytes: opcode + operand)
LDA #$00    ; Load A with literal zero

; STA #$34  ; invalid: STA cannot use immediate addressing (must specify a memory address)
```

## References
- "addition_program_using_subroutine" — expands on immediate ASCII constants for printing characters
