# LDY — Load Y Register (6502)

**Summary:** LDY (6502) loads a memory or immediate value into the Y register; opcodes $AC, $A4, $A0, $BC, $B4; affects Negative (N) and Zero (Z) flags.

## Instruction details
LDY copies a value from memory or an immediate operand into the Y register, then sets the Zero flag if the result is 0, and the Negative flag if bit 7 of the result is set. Supported addressing modes: Absolute, Zero Page, Immediate, Absolute Indexed,X, and Zero Page Indexed,X. (Immediate: operand is a constant; Zero Page: low 256-byte page.)

Do not infer additional timing or page-cross cycle behavior from this entry — only the opcode encodings and byte lengths below are specified.

## Source Code
```text
; LDY — opcode summary (6502)
; Addressing Mode            Syntax         Opcode  Bytes  Flags
; -------------------------------------------------------------
; Absolute                   LDY $aaaa      $AC     3      N,Z
; Zero Page                  LDY $aa        $A4     2      N,Z
; Immediate                  LDY #$aa       $A0     2      N,Z
; Absolute Indexed, X        LDY $aaaa,X    $BC     3      N,Z
; Zero Page Indexed, X       LDY $aa,X      $B4     2      N,Z
```

```asm
; Minimal examples
LDY #$10       ; load immediate 0x10 into Y
LDY $00        ; load from zero page address $00 into Y
LDY $1234      ; load from absolute address $1234 into Y
LDY $2000,X    ; load from absolute address $2000 + X into Y
LDY $10,X      ; load from zero page address $10 + X into Y
```

## References
- "lda_instruction" — related load instruction for the Accumulator (A)
- "ldx_instruction" — related load instruction for the X register (X)

## Mnemonics
- LDY
