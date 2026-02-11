# STY — Store Y Register

**Summary:** STY stores the contents of the Y register to memory. Provided opcodes: $8C (Absolute, 3 bytes), $84 (Zero Page, 2 bytes), $94 (Zero Page,X, 2 bytes). Does not affect processor status flags.

## Operation
STY writes the current Y register value to the effective address determined by the instruction's addressing mode. It does not modify A or X registers and does not change any processor status flags.

Addressing modes:
- Absolute — 16-bit address operand.
- Zero Page — 8-bit zero-page address.
- Zero Page,X — zero-page address plus X (zero-page wrap-around applies).

## Source Code
```asm
; STY — Store Y Register — opcodes and sizes
; Absolute      STY $aaaa     opcode $8C    size 3    (no flags affected)
; Zero Page     STY $aa       opcode $84    size 2
; Zero Page,X   STY $aa,X     opcode $94    size 2

; Example usages:
STY $C000        ; store Y to absolute address $C000
STY $10          ; store Y to zero page address $0010
STY $20,X        ; store Y to zero page address ($0020 + X) & $FF
```

## References
- "sta_instruction" — expands on Store Accumulator (STA)
- "stx_instruction" — expands on Store X Register (STX)

## Mnemonics
- STY
