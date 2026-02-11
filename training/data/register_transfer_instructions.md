# 6502 Register Transfer: TAX / TAY / TXA / TYA

**Summary:** 6502 implied-mode register transfers: TAX $AA, TAY $A8, TXA $8A, TYA $98 — each is 1 byte and affects the N and Z processor flags (N = negative flag, set from result bit 7; Z = zero flag, set if result == 0).

## Description
These four instructions perform direct register-to-register moves using the implied addressing mode:

- TAX: Transfer accumulator (A) to X.
- TAY: Transfer accumulator (A) to Y.
- TXA: Transfer X to accumulator (A).
- TYA: Transfer Y to accumulator (A).

Behavioral notes:
- Each instruction is a single-byte opcode (no operand bytes).
- Only the N (negative) and Z (zero) flags are affected: N reflects bit 7 of the result; Z is set if the result is zero.
- No memory accesses are performed by these implied transfers.

## Source Code
```asm
; 6502 register transfer instructions (summary)
; Mnemonic    Description                 AddrMode  Opcode  Bytes  Flags
TAX     Transfer accumulator to X       Implied    $AA     1     N,Z
TAY     Transfer accumulator to Y       Implied    $A8     1     N,Z
TXA     Transfer X to accumulator       Implied    $8A     1     N,Z
TYA     Transfer Y to accumulator       Implied    $98     1     N,Z

; Alternate compact listing
TAX    $AA    1    N,Z
TAY    $A8    1    N,Z
TXA    $8A    1    N,Z
TYA    $98    1    N,Z
```

## References
- "inx_instruction" — expands on increment X register (related register operations)
- "ldy_instruction" — expands on load Y (related register operations)

## Mnemonics
- TAX
- TAY
- TXA
- TYA
