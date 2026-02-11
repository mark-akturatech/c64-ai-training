# 6502 — LDX (Load X Register)

**Summary:** LDX — 6502 load instruction for the X register. Encodings: Immediate $A2, Zero Page $A6, Zero Page,Y $B6, Absolute $AE, Absolute,Y $BE; instruction lengths 2–3 bytes; affects Negative (N) and Zero (Z) flags.

## Operation
LDX loads the operand into the X register (copies operand into X). It updates the Negative and Zero flags based on the resulting X value. Supported addressing modes: Immediate, Zero Page, Zero Page Indexed (Y), Absolute, Absolute Indexed (Y).

## Source Code
```asm
; Opcode table for LDX (6502)
; Addressing Mode            Encoding  Opcode  Bytes  Flags
; Immediate                  LDX #$aa   $A2     2      N,Z
; Zero Page                  LDX $aa    $A6     2      N,Z
; Zero Page Indexed, Y       LDX $aa,Y  $B6     2      N,Z
; Absolute                   LDX $aaaa  $AE     3      N,Z
; Absolute Indexed, Y        LDX $aaaa,Y $BE    3      N,Z

; Example usages:
        LDX #$10        ; immediate
        LDX $44         ; zero page
        LDX $44,Y       ; zero page, indexed by Y
        LDX $1234       ; absolute
        LDX $1234,Y     ; absolute, indexed by Y
```

## References
- "lda_instruction" — related load instruction (Accumulator)
- "ldy_instruction" — related load instruction (Y register)

## Mnemonics
- LDX
