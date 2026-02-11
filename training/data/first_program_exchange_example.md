# Exchange two bytes at $0380/$0381 — first machine program (LDA/LDX/STA/STX/BRK)

**Summary:** Example 6502/C64 program plan and hand-assembly to swap the bytes at $0380 and $0381 using registers (LDA/LDX/STA/STX) and BRK to stop; shows machine-code byte encoding (AD = LDA absolute) and little-endian (low-byte first) address ordering.

## Description
Goal: exchange the contents of two memory locations $0380 and $0381.

Plan and constraints
- The 6502 cannot copy directly memory→memory. Use CPU registers as temporaries.
- Chosen registers: A and X. Sequence: load A from $0380, load X from $0381, store A to $0381, store X to $0380.
- Alternative register pairs are possible (A/Y or X/Y) but this example stays with A/X.

Stop condition
- Use BRK (Break) as a simple way to return control to the machine-language monitor (MLM) when running interactively; BRK is a single-byte instruction.

Assembly vs machine code
- Assembly mnemonics used: LDA (load A), LDX (load X), STA (store A), STX (store X), BRK (break).
- The computer executes machine-code bytes. For example LDA absolute opcode is %10101101 (binary) = $AD (hex).
- Absolute addressing uses two-byte addresses stored low byte first (little-endian). For address $0380 the low byte 80 is placed first, then 03.

Behavioral note
- Each absolute load/store instruction occupies 3 bytes (opcode + low byte + high byte). BRK is 1 byte.
- The program must ensure values are preserved in registers before overwriting memory.

## Source Code
```asm
; Hand-assembled machine code lines (opcode bytes then assembly comment)
AD 80 03    ; LDA $0380    ; opcode $AD, operand low byte $80 then high byte $03
AE 81 03    ; LDX $0381    ; opcode $AE, operand low byte $81 then high byte $03
8D 81 03    ; STA $0381    ; opcode $8D, operand low byte $81 then high byte $03
8E 80 03    ; STX $0380    ; opcode $8E, operand low byte $80 then high byte $03
00          ; BRK          ; opcode $00 (break - return to MLM)
```

Additional machine-code details:
```text
- LDA absolute  : opcode $AD (binary %10101101)
- LDX absolute  : opcode $AE
- STA absolute  : opcode $8D
- STX absolute  : opcode $8E
- BRK           : opcode $00
- Address byte order for absolute operands: low byte first, high byte second.
- Total program length: 3 + 3 + 3 + 3 + 1 = 13 bytes
```

## References
- "opcode_encoding_and_translation" — expands on machine-code opcodes corresponding to assembler mnemonics
- "choosing_program_location" — discusses choosing where to place the assembled program in RAM (e.g. cassette buffer $033C)

## Mnemonics
- LDA
- LDX
- STA
- STX
- BRK
