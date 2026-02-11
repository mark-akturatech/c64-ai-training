# 6502 Immediate Addressing (Recap)

**Summary:** Immediate addressing (6502) — the operand is the data value itself, indicated by a leading '#' (e.g. LDA #$29 or LDA #41). Common mnemonic forms: LDA #imm, STA #imm (note: STA does not use immediate in practice — only shown as form).

## Immediate addressing
Immediate addressing supplies the operand directly in the instruction bytes rather than an address in memory. The immediate operand follows the opcode and is interpreted as an immediate constant (byte-sized value for 6502 instructions). The immediate form is written with a leading '#' before the value (decimal or hex with $). Example usage: LDA #41 (decimal) or LDA #$29 (hex) loads the accumulator with the constant 41.

## Source Code
```asm
; Immediate addressing examples (6502)
        LDA #41      ; load decimal 41 into A  (41 = $29)
        LDA #$29     ; load hex $29 into A
        ; Note: immediate operand occupies one byte following the opcode
```

## References
- "immediate_addressing" — detailed immediate addressing
- "summary_indexed" — linked indexed addressing summary