# NMOS 6510: SHY behaves like STY for address $FE00 (example)

**Summary:** Demonstrates that the undocumented SHY instruction can act identically to STY when used with address $FE00 and X-indexing on NMOS 6510 (because &{H+1} becomes $FF). Also lists TAS (XAS/SHS) opcode summary: $9B, mnemonic TAS abs,y.

**Description**

When the SHY variant of the undocumented 6502/6510 store-Y opcodes is used with the absolute address $FE00 and X-indexing (SHY $FE00,X), the instruction behaves like a normal STY $FE00,X. The cause given in the source: the high-byte expression "&{H+1}" evaluates to $FF in this addressing case, producing identical effective addressing for SHY and STY.

The expression "&{H+1}" refers to the high byte of the effective address incremented by one. In the case of SHY $FE00,X, if X is such that the low byte of the effective address overflows (e.g., X = $02, making the effective address $FE00 + $02 = $FE02), the high byte of the effective address ($FE) is incremented by one, resulting in $FF. This causes the SHY instruction to store the value of the Y register at the same address as STY would, effectively making SHY behave like STY in this scenario.

TAS (also seen as XAS or SHS) is an undocumented instruction with the following characteristics:

- **Opcode:** $9B
- **Mnemonic:** TAS abs,Y
- **Description:** Stores the result of A AND X AND (high byte of the target address + 1) into memory and sets the stack pointer to A AND X.

## Source Code

```asm
; Example (illustrative, from source):
; Using $FE00 as address makes SHY act like STY because &{H+1} == $FF

SHY $FE00,X    ; (undocumented) acts like: STY $FE00,X when &{H+1} == $FF
STY $FE00,X    ; normal store-Y absolute,X

; TAS (XAS/SHS) opcode reference from source:
; Opcode $9B — Mnemonic: TAS abs,Y
; Type: Combinations of STA/TXS and LDA/TSX
```

## References

- "shy_opcode" — expands on example of &{H+1} = $FF making SHY equivalent to STY

## Mnemonics
- SHY
- TAS
- XAS
- SHS
