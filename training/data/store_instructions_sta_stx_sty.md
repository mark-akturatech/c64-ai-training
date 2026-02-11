# Kick Assembler — Store Instructions (STA / STX / STY) — 6502 Quick Reference

**Summary:** 6502 store instructions STA, STX, STY with opcode hex bytes, addressing modes, instruction lengths, and cycle counts.

**Instruction Overview**

- **STA**: Stores the contents of the accumulator (A) into memory.
- **STX**: Stores the X index register into memory.
- **STY**: Stores the Y index register into memory.

Addressing modes covered:

- Zero Page (zp)
- Zero Page,X (zp,X) and Zero Page,Y (zp,Y) where applicable
- Absolute
- Absolute,X and Absolute,Y where applicable
- (Indirect,X) and (Indirect),Y — available only for STA

The opcode table below lists standard 6502 opcode bytes, instruction lengths, and cycle counts for each mnemonic and supported addressing mode.

## Source Code

```text
; STA — Store Accumulator
; Addressing Mode          Opcode (hex)  Bytes  Cycles
STA zp                     $85           2      3
STA zp,X                   $95           2      4
STA (zp,X)                 $81           2      6
STA (zp),Y                 $91           2      6
STA abs                    $8D           3      4
STA abs,X                  $9D           3      5
STA abs,Y                  $99           3      5

; STX — Store X register
; Addressing Mode          Opcode (hex)  Bytes  Cycles
STX zp                     $86           2      3
STX zp,Y                   $96           2      4
STX abs                    $8E           3      4

; STY — Store Y register
; Addressing Mode          Opcode (hex)  Bytes  Cycles
STY zp                     $84           2      3
STY zp,X                   $94           2      4
STY abs                    $8C           3      4
```

## References

- "loads_shifts_and_stack_ops" — expands on previous block listing loads, shifts, and stack instructions
- "arithmetic_and_processor_status_and_transfers" — expands on next block, includes SBC and processor-status/register-transfer instructions

## Mnemonics
- STA
- STX
- STY
